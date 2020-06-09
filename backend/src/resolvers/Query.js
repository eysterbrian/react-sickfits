const Query = {
  dogs(parent, args, ctx, info) {
    // return [{ name: 'Georgie' }, { name: 'Buddy' }];
    if (!global.dogs) global.dogs = [];
    return global.dogs;
  },
};

module.exports = Query;
