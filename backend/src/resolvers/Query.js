const { forwardTo } = require('prisma-binding');
const {
  unusedFragMessage,
} = require('graphql/validation/rules/NoUnusedFragments');
const { hasPermission } = require('../utils');

const Query = {
  // Use the prisma-binding forwardTo() to delegate this query directly to Prisma DB
  items: forwardTo('db'), // 'db' is the bindingName string
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  async me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      // It's perfectly valid for no one to be logged-in, so don't
      // throw an error, just return null
      console.log('No valid userId from token');
      return null;
    }

    const user = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );
    return user;
  },

  async users(parent, args, ctx, info) {
    // Verify that some user is logged-in
    if (!ctx.request.userId) {
      throw new Error('You must be logged-in');
    }

    if (
      ctx.request.user &&
      hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    ) {
      const users = await ctx.db.query.users({}, info);
      return users;
    } else {
      return [];
    }
  },

  async order(parent, args, ctx, info) {
    // Verify that some user is logged-in
    if (!ctx.request.userId) {
      throw new Error('You must be logged-in');
    }

    // Get the order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );

    // Does this user have permissions to view this order?
    if (
      !hasPermission(ctx.request.user, ['ADMIN']) &&
      order.user.id !== ctx.request.userId
    ) {
      throw new Error('You do not have permissions to view this order');
    }

    return order;
  },
};

module.exports = Query;
