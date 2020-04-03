const connection = require('../database/connection')

class groupModel {
  getGroupsFromDomain({ domain }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await connection.raw(`
          select
              a.vch_address
          from
              tbl_pbx_address a,
              tbl_sys_domain d
          where
              a.int_domain_key = d.int_domain_key and
              a.int_type = 2 and
              a.int_active != 0 and
              a.int_group_key is not null and
              d.vch_domain = '${domain}'
        `)

        result = result.map(item => item.VCH_ADDRESS)

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new groupModel()