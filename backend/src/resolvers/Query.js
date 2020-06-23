const { forwardTo } = require('prisma-binding');

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
};

module.exports = Query;
