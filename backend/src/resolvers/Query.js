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
};

module.exports = Query;
