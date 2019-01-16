'use strict';

const readCSV = require('../utils/read-csv') // Used to read csv files
const db = require('../models') // All db models

/**
 * Suppose we want to insert some data into a few tables by default, to manage
 * this we use something called seeders, with seed files such as this one. In general,
 * seed files are some change in data that can be used to populate database table with
 * sample data or test data. It is particularly useful whenever a db migration occurs,
 * since you can easily seed the new db.
 *
 * These seed files (in our case) are generated using Sequelize from the command line.
 * An example of one such command in the README.
 *
 * @type {{up: function(queryInterface, Sequelize), down: function(queryInterface, Sequelize)}}
 */
module.exports = {

  /**
  * The up function is used when loading the seed data (test/dummy data) into the database.
  * @param queryInterface - The object with methods for modifying the db.
  * @param Sequelize - The Sequelize object.
  * @returns {*}
  */
  up: (queryInterface, Sequelize) => {

    // Return promise to read in the csv file's data
    return readCSV('../data/mock-users.csv')
      // Output is an array of objects with each object including all data fields from
      // a single line in the file
      .then(function (users) {

        // Remove all ids so that ids are generated by the db
        const usersWithoutIds = users.map(function (user) {
          const userCopy = Object.assign({}, user)
          delete userCopy.id
          return userCopy
        })

        // Insert formatted data into the csv
        return queryInterface.bulkInsert('Users', usersWithoutIds)
      })

  },

  /**
   * The down function is used for reverting the changes made to the db by seeding.
   * It removes all seed (i.e. test/dummy data) from the db.
   * @param queryInterface - The object with methods for modifying the db.
   * @param Sequelize - The Sequelize object.
   * @returns {*}
   */
  down: (queryInterface, Sequelize) => {

    // Return promise to read in the csv file's data
    return readCSV('../data/mock-users.csv')

      // Output is an array of objects with each object including all data fields from
      // a single line in the file
      .then(function (users) {

        // Map all data into simply an object with the user's email
        const mockUserEmails = users.map(function (user) {
          return user.email
        })

        // Destroy all db records that match the user emails
        return db.User.destroy({
          where: {
            email: mockUserEmails
          }
        })

      })
  }
};
