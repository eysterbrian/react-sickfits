const Mutation = {
  createDog: function(parent, args, ctx, info) {
    console.log(args);
    if (!global.dogs) global.dogs = [];

    const newDog = { name: args.name };
    global.dogs.push(newDog);
    return newDog;
  },
};

module.exports = Mutation;
