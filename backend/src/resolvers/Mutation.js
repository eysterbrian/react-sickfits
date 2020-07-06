const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { forwardTo } = require('prisma-binding');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeHtmlEmail } = require('../../mail');
const { hasPermission } = require('../utils');

const RESET_EXPIRY = 1000 * 60 * 60; // 1 hour
const LOGIN_EXPIRY = 1000 * 60 * 60 * 24; // 1 day

const Mutation = {
  createItem: async function(parent, args, ctx, info) {
    // TODO: Check that the user is logged-in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to create a new item');
    }

    // Call the Prisma DB mutation
    const item = await ctx.db.mutation.createItem({
      // Create data object from our args
      data: {
        // We're using spread here so we can later add some additional params to data
        ...args,

        // Provide a relationship between this item and a user
        user: {
          connect: {
            id: ctx.request.userId,
          },
        },
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
    // Make sure the user is logged in
    if (!ctx.request.userId || !ctx.request.user) {
      throw new Error('You must be logged in to delete an item');
    }

    // Find the item
    const item = await ctx.db.query.item(
      { where: { id: args.id } },
      `{id title user { id }}` // Specify the return values from prisma via gql
    );

    // Check if they own that item or have admin permissions
    const userOwnsItem = ctx.request.userId === item.user.id;
    const userHasPermissions = ctx.request.user.permissions.some((permission) =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    );
    if (!userOwnsItem && !userHasPermissions) {
      throw new Error('You do not have permissions to delete this item');
    }

    // Delete it
    return await ctx.db.mutation.deleteItem(
      { where: { id: args.id } },
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

    // Generate and send the password reset email
    const resetUrl = `${
      process.env.FRONTEND_URL
    }/reset?resetToken=${resetToken}`;
    const msgText = `Your password reset token is: \n\n <a href="${resetUrl}">${resetUrl}</a>`;
    try {
      const mailRes = await transport.sendMail({
        from: 'brian@brianeyster.com',
        to: user.email,
        subject: 'Password Reset',
        html: makeHtmlEmail(msgText),
        text: msgText,
      });
    } catch (err) {
      throw new Error(`Unable to send email to ${user.email}!`);
    }

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

  async updatePermissions(parent, args, ctx, info) {
    // Verify that user is logged-in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    // Does current user have permissions to allow this kind of update?
    if (
      !ctx.request.user ||
      !hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    ) {
      throw new Error('Sorry, you are not allowed to update user permissions.');
    }

    // Update the user in the DB
    return ctx.db.mutation.updateUser(
      {
        where: { id: args.userId },
        data: {
          // Since this is custom enum, Prisma requires us to call { set: value }
          permissions: { set: args.permissions },
        },
      },
      info
    );
  },
};

module.exports = Mutation;
