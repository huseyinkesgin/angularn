const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cities').del()
    .then(function () {
      // Inserts seed entries
      const fakeCities = [];
      for (let i = 0; i < 100; i++) {
        fakeCities.push({
          name: faker.location.city(),
          code: faker.location.zipCode(),
          is_active: faker.datatype.boolean()
        });
      }
      return knex('cities').insert(fakeCities);
    });
};
