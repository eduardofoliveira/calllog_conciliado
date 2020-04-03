const connection = require('../database/connection')

class trunkModel {
  getTrunksFromDomain({ domain }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await connection.raw(`
          select
              u.vch_username
          from
              BASIXBRASTEL.tbl_sys_user u,
              BASIXBRASTEL.tbl_sys_domain d
          where
              u.int_domain_key = d.int_domain_key and
              u.int_agentuser = 10 and
              u.int_active != 0  and
              d.vch_domain = '${domain}'
        `)

        result = result.map(item => item.VCH_USERNAME)

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new trunkModel()