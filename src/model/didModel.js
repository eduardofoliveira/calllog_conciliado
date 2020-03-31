const connection = require('../database/connection')

class didModel {
  getDidsFromDomain({ domain }) {
    return new Promise((resolve, reject) => {
      try {
        const result = await connection.raw(`
          SELECT
            *
          FROM
            
        `)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = didModel()