require('dotenv').config()
const did = require('./model/didModel')

const executar = async () => {
  const result = await did.getDidsFromDomain({ domain: 'cloud.cloudcom.com.br' })
}

executar()