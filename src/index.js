require('dotenv').config()
const did = require('./model/didModel')
const group = require('./model/groupModel')
const ivr = require('./model/ivrModel')
const user = require('./model/userModel')
const trunk = require('./model/trunkModel')
const DCallLog = require('./model/detailCallLogModel')

const executar = async () => {
  // const didList = await did.getDidsFromDomain({ domain: 'cloud.cloudcom.com.br' })
  // const groupList = await group.getGroupsFromDomain({ domain: 'cloud.cloudcom.com.br' })
  // const ivrList = await ivr.getIvrsFromDomain({ domain: 'cloud.cloudcom.com.br' })
  // const userList = await user.getUsersFromDomain({ domain: 'cloud.cloudcom.com.br' })
  // const trunkList = await trunk.getTrunksFromDomain({ domain: 'cloud.cloudcom.com.br' })
  
  const callLogConciliado = await DCallLog.getCallLogFromDomain({
    domain: 'crtsp.cloudcom.com.br',
    start: '01-04-2020 00:00:00',
    end: '01-04-2020 09:00:00',
    dids: ['551135801000']
  })

  // console.log(trunkList)
  process.exit(0)
}

executar()