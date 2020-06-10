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
};

module.exports = Mutation;
