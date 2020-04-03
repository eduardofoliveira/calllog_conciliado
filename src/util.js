const callAnalyzer = (calllog, usuarios, uras) => {
  calllog = calllog.map(item => {
    if (item.STATUS === 0) {
      item.STATUS = 'ESTABLISHED'
    }
    if (item.STATUS === 3) {
      item.STATUS = 'UNANSWERED'
    }
    if (item.STATUS === 8) {
      item.STATUS = 'CANCELED'
    }
    if (item.STATUS === 99) {
      item.STATUS = 'UNDEFINED'
    }

    if (item.DESCONEXAO === 1) {
      item.DESCONEXAO = 'BYE (BYE)'
    }
    if (item.DESCONEXAO === 2) {
      item.DESCONEXAO = 'CANCELED (CANCELED)'
    }
    if (item.DESCONEXAO === 5) {
      item.DESCONEXAO = 'FORWARDED (UNDEFINED)'
    }
    if (item.DESCONEXAO === 6) {
      item.DESCONEXAO = 'TRANSFERED (BYE)'
    }
    if (item.DESCONEXAO === 8) {
      item.DESCONEXAO = 'NORMAL (BYE)'
    }
    if (item.DESCONEXAO === 99) {
      item.DESCONEXAO = 'UNDEFINED'
    }
    if (item.DESCONEXAO === 408) {
      item.DESCONEXAO = 'TIMEOUT (CANCELED)'
    }
    if (item.DESCONEXAO === 481) {
      item.DESCONEXAO = 'Call/Transaction Does Not Exist'
    }
    if (item.DESCONEXAO === 500) {
      item.DESCONEXAO = 'SERVER INTERNAL ERROR (SERVER INTERNAL ERROR)'
    }
    return item
  })

  detalhes = calllog.filter(item => item.VCH_USERNAME === 'gateway@centrex.brastel.com.br')

  const INICIO = detalhes[0].INICIO
  const FROM = detalhes[0].VCH_FROM
  const TO = detalhes[0].VCH_TO
  const OPCAO = calllog[calllog.length - 1].VCH_TARGET
  const DURACAO = Math.ceil(detalhes[0].DURACAO)

  const ATENDERAM = calllog.filter(item => item.STATUS === 'ESTABLISHED' && item.VCH_USERNAME !== 'gateway@centrex.brastel.com.br')
  
  const NAO_ATENDERAM = calllog.filter(item => item.STATUS !== 'ESTABLISHED' && item.VCH_USERNAME !== 'gateway@centrex.brastel.com.br').map(item => {
    let obj = {
      INT_CONNECTIONSEQUENCE: item.INT_CONNECTIONSEQUENCE,
      USUARIO: item.VCH_TO,
      TEMP_CHAMANDO: Math.ceil(item.DURACAO),
      STATUS: item.STATUS,
      DESCONEXAO: item.DESCONEXAO
    }
    
    return obj
  })

  const URAS = ATENDERAM.filter(item => {
    if(uras.includes(item.VCH_TO)){
      return true
    }
  }).map(item => {
    const obj = {
      INT_CONNECTIONSEQUENCE: item.INT_CONNECTIONSEQUENCE,
      URA: item.VCH_TO,
      DURACAO: Math.ceil(item.DURACAO),
      INICIO: item.INICIO,
      TERMINO: item.TERMINO,
      STATUS: item.STATUS,
      DESCONEXAO: item.DESCONEXAO
    }
    return obj
  })

  let CHAMADA_ATENDIDA = ATENDERAM.map(item => item.VCH_TO).map(item => usuarios.includes(item)).reduce((atendida, item) => {
    if(atendida){
      return atendida
    }else{
      if(item === true){
        return atendida = true
      }
    }
  }, false)

  if(CHAMADA_ATENDIDA){
    CHAMADA_ATENDIDA  = 'SIM'
  }else{
    CHAMADA_ATENDIDA  = 'NÃO'
  }
  if(OPCAO === 'IVR_Fora' || OPCAO === 'IVR_Fora_Covid'){
    CHAMADA_ATENDIDA = 'Horario Noturno'
  }

  const RAMAIS_ATENDERAM = ATENDERAM.filter(item => {
    if(usuarios.includes(item.VCH_TARGET)){
      return true
    }
  }).map(item => {
    const obj = {
      INT_CONNECTIONSEQUENCE: item.INT_CONNECTIONSEQUENCE,
      USUARIO: item.VCH_TO,
      DURACAO: item.DURACAO,
      INICIO: item.INICIO,
      TERMINO: item.TERMINO,
      STATUS: item.STATUS,
      DESCONEXAO: item.DESCONEXAO
    }
    return obj
  })

  if(RAMAIS_ATENDERAM.length > 0 && CHAMADA_ATENDIDA !== 'Horario Noturno'){
    CHAMADA_ATENDIDA = 'SIM'
  }

  return {
    FROM,
    TO,
    INICIO,
    DURACAO,
    OPCAO,
    ATENDIDA: CHAMADA_ATENDIDA,
    URAS,
    NAO_ATENDERAM,
    RAMAIS_ATENDERAM,
    calllog
  }
}

module.exports = {
  callAnalyzer
}