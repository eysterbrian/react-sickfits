const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { forwardTo } = require('prisma-binding');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const RESET_EXPIRY = 1000 * 60 * 60; // 1 hour
const LOGIN_EXPIRY = 1000 * 60 * 60 * 24; // 1 day

const Mutation = {
  createItem: async function(parent, args, ctx, info) {
    // TODO: Check that the user is logged-in

    // Call the Prisma DB mutation
    const item = await ctx.db.mutation.createItem({
      // Create data object from our args
      data: {
        // We're using spread here so we can later add some additional params to data
        ...args,
      },
    });

    return item;
  },

  updateItem: async function(parent, args, ctx, info) {
    // First make a copy of the updates args to pass to prisma
    const updates = { ...args };
    // Remove the id since that's not a param to prisma updateItem
    delete updates.id;
    // Now run the mutation on prisma db
    const item = await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id },
      },
      info // Info is used by prisma to determine the return obj
    );

    return item;
  },

  deleteItem: async function(parent, args, ctx, info) {
    const where = { id: args.id };

    // 1. Find the item
    // 2. Check if they own that item or have admin permissions
    // TODO:
    const item = await ctx.db.query.item(
      { where },
      `{id title}` // Specify the return values from prisma via gql
    );

    // 3. Delete it
    return await ctx.db.mutation.deleteItem(
      { where },
      info // Prisma uses the original query to determine retval payload
    );
  },

  signup: async function(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    // Hash their password.  10 is the length of the salt (which gets stored with the hash)
    const password = await bcrypt.hash(args.password, 10);

    // Write the user to the Prisma DB
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password: password, // overwrite the args.password with the hashed value
          permissions: { set: ['USER'] }, // See the UserCreatepermissionsInput type
        },
      },
      info // Info contains the original gql query, used to determine specific return args
    );

    // Now create the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true, // don't allow JS to access the JWT cookie
      maxAge: LOGIN_EXPIRY,
    });

    // Finally, return the User to the browser
    return user;
  },

  signin: async function(parent, { email, password }, ctx, info) {
    // Check that a user exists with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }

    // Check that their password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      throw new Error(`Invalid password`);
    }

    // Create a JWT for their logged-in user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set the token in their cookies
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: LOGIN_EXPIRY,
    });

    // Return the user
    // TODO: Shouldn't we return just the return fields from the Query???
    return user;
  },

  signout: function(parent, args, ctx, info) {
    // Remove any token cookie from the client
    ctx.response.clearCookie('token');

    // Return a SuccessMessage
    return { message: 'Successfully signed out!' };
  },

  requestReset: async function(parent, args, ctx, info) {
    // Is this email a valid user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found for email ${args.email}`);
    }

    const resetToken = (await promisify(randomBytes)(24)).toString('hex');
    const resetTokenExpiry = Date.now() + RESET_EXPIRY;

    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    console.log(res);
    return { message: 'Reset token generated!' };
  },

  resetPassword: async function(
    parent,
    { password, passwordConfirm, resetToken },
    ctx,
    info
  ) {
    // Confirm that the password and confirmPassword are the same
    if (password !== passwordConfirm) {
      throw new Error('Passwords do not match!');
    }

    // Get the user based on the resetToken
    // NOTE: we're using query.users here since resetToken isn't unique so it's not avail in the
    // query.user.
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now(),
      },
    });
    if (!user) {
      throw new Error('Invalid password reset token!');
    }

    // hash the new password
    const newPassword = await bcrypt.hash(password, 10);

    // Update the User with new password and no token/expiry
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: { password: newPassword, resetToken: null, resetTokenExpiry: null },
    });

    // Generate the JWT and set in cookie
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true, // don't allow JS to access the JWT cookie
      maxAge: LOGIN_EXPIRY, // 1 day expiration
    });

    // Return the User
    console.log(updatedUser);
    return updatedUser;
  },
};

module.exports = Mutation;
