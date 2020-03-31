const connection = require('../database/connection')

class didModel {
  getDidsFromDomain({ domain }) {
    return new Promise((resolve, reject) => {
      try {
        const result = await connection.raw(`
          select
              *
          from
              tbl_pbx_address a,
              tbl_sys_domain d
          where
              a.int_domain_key = d.int_domain_key and
              a.int_type = 3 and
              a.int_active != 0 and
              d.vch_domain = '${domain}'
        `)

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new didModel()