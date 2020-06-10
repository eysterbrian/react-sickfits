const { forwardTo } = require('prisma-binding');

const Query = {
  // Use the prisma-binding forwardTo() to delegate this query directly to Prisma DB
  items: forwardTo('db'), // 'db' is the bindingName string

  // items: async function(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // },
};

module.exports = Query;
