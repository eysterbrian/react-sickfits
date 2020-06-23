const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { forwardTo } = require('prisma-binding');

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
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
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
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    });

    // Return the user
    // TODO: Shouldn't we return just the return fields from the Query???
    return user;
  },
};

module.exports = Mutation;
