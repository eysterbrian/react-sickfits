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
};

module.exports = Mutation;
