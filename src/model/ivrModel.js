const connection = require('../database/connection')

class ivrModel {
  getIvrsFromDomain({ domain }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await connection.raw(`
          select
              u.vch_name
          from
              tbl_pbx_address a,
              tbl_sys_domain d,
              tbl_pbx_pbxuser pu,
              tbl_sys_user u
          where
              a.int_domain_key = d.int_domain_key and
              a.int_pbxuser_key = pu.int_pbxuser_key and
              pu.int_user_key = u.int_user_key and
              a.int_type = 2 and
              a.int_active != 0 and
              u.int_agentuser = 5 and
              u.int_active != 0 and
              d.vch_domain = 'cloud.cloudcom.com.br' and
              u.vch_name not in ('recordFileBox', 'ivr_preprocesscall')
          order by
              u.vch_name`)

        result = result.map(item => item.VCH_NAME)

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new ivrModel()