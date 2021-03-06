const connection = require('../database/connection')

class didModel {
  getDidsFromDomain({ domain }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await connection.raw(`
          select
            vch_address as did
          from
              tbl_pbx_address a,
              tbl_sys_domain d
          where
              a.int_domain_key = d.int_domain_key and
              a.int_type = 3 and
              a.int_active != 0 and
              d.vch_domain = '${domain}'
        `)

        result = result.filter(item => item.DID.length > 8 ).map(item => item.DID)

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new didModel()