const connection = require('../database/connection')

class userModel {
  getUsersFromDomain({ domain }) {
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
              u.int_agentuser = 0 and
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

  getUsersAndExtensionFromDomain({ domain }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await connection.raw(`
          select
            u.vch_username as usuario,
            a.vch_address as  ramal
          from
            BASIXBRASTEL.tbl_sys_user u,
            BASIXBRASTEL.tbl_sys_domain d,
            basixbrastel.tbl_pbx_pbxuser pu,
            basixbrastel.tbl_pbx_address a
          where
            u.int_domain_key = d.int_domain_key and
            u.int_user_key = pu.int_user_key and
            pu.int_pbxuser_key = a.int_pbxuser_key and
            a.int_type = 1 and
            u.int_agentuser = 0 and
            u.int_active != 0  and
            d.vch_domain = '${domain}' and
            u.vch_username != 'administrator'
        `)

        result = result.map(item => {
          let obj = { usuario: item.USUARIO, ramal:  item.RAMAL}
          return obj
        })

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new userModel()