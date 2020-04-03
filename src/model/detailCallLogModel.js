const Moment = require('moment')
const connection = require('../database/connection')

const { callAnalyzer } = require('../util')
const { getUsersFromDomain } = require('./userModel')
const { getIvrsFromDomain } = require('./ivrModel')

const arrayToList = (total, item, index, lista) => {
  if (index === 0 && lista.length - 1) {
    return total = `'${item}'`
  }

  if (index === lista.length - 1) {
    return total += `'${item}'`
  } else {
    return total += `'${item}', `
  }
}

class detailCallLogModel {
  getCallLogFromDomain({ domain, start, end, dids }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await connection.raw(`
          select
            distinct vch_callid
          from(
            select
                vch_callid
            from
              tbl_pbx_systemcalllog cl,
              tbl_sys_domain d
            where
              cl.int_domain_key = d.int_domain_key and
              d.vch_domain = '${domain}' and
              vch_to in (${dids.reduce(arrayToList, '')}) and
              dtm_starttime BETWEEN TO_DATE('${start}', 'DD-MM-YYYY HH24:MI:SS') and
              TO_DATE('${end}', 'DD-MM-YYYY HH24:MI:SS')
            order by
              dtm_starttime
            desc)
        `)

        result = result.map(item => item.VCH_CALLID)
        let resultado = []

        for (let i = 0; i < result.length; i++) {
          const item = result[i];

          const resultQuery = await connection.raw(`
            select
              int_connectionsequence,
              vch_from,
              vch_to,
              vch_target,
              vch_username,
              (((dtm_endtime) - (dtm_starttime)) * 24 * 60 * 60) as duracao,
              TO_CHAR(dtm_starttime,'DD-MM-YYYY HH24:MI:SS') as inicio,
              TO_CHAR(dtm_endtime,'DD-MM-YYYY HH24:MI:SS') as termino,
              int_status as status,
              --replace(int_status, 0, 'ESTABLISHED') as status,
              int_releasecause as desconexao
              -- replace(replace(replace(int_releasecause, 1, 'BYE (BYE)'), 6, 'TRANSFERED (BYE)'), 8 , 'NORMAL (BYE)') as desconexao
            from
                BASIXBRASTEL.tbl_pbx_systemcalllog
            where
                vch_callid = '${item}'
            order by
                int_connectionsequence
          `)

          console.log(`${i + 1} de ${result.length}`)

          resultado.push([item, resultQuery])
        }

        const usuarios = await getUsersFromDomain({ domain })
        const uras = await getIvrsFromDomain({ domain })

        resultado = resultado.sort((a, b) => {
          let [obj_a] = a[1].filter(item => item.VCH_USERNAME === 'gateway@centrex.brastel.com.br')
          let [obj_b] = b[1].filter(item => item.VCH_USERNAME === 'gateway@centrex.brastel.com.br')
          
          if(obj_a.INICIO < obj_b.INICIO){
            return -1
          }
          if(obj_a.INICIO > obj_b.INICIO){
            return 1
          }
          return 0
        })

        const lista = []
        for (let i = 0; i < resultado.length; i++) {
          const retorno = callAnalyzer(resultado[i][1], usuarios, uras)
          lista.push(retorno)
          // console.log(`${String(retorno.FROM).padEnd(12, ' ')} ${String(retorno.TO).padEnd(13, ' ')} ${String(retorno.INICIO).padStart(20, ' ')} ${String(retorno.DURACAO).padStart(6, ' ')} ${String(retorno.OPCAO).padEnd(15, ' ')} ${retorno.ATENDIDA}`)
        }

        resolve(lista)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new detailCallLogModel()