const modules = require('../modules')
const client = require('./client')
const constants = require('./constants')

let recipients

const setPrivateRecipients = (line) => {
  recipients = line.split(' ')
  if (recipients.length > 6) {
    return resolve('You can only send a private message to up to 7 recipients')
  }
  client.setPrivateMode()
}

const sendPrivateMessage = (msg) => new Promise((resolve, reject) => {
  return modules.private(msg, recipients).catch(() => reject(new Error('Could not send private message')))
})

const sendPublicMessage = (msg) => new Promise((resolve, reject) => {
  return modules.post(msg).catch(() => reject(new Error('Failed to post message')))
})

module.exports = {
  sendMessage: (line) => new Promise((resolve, reject) => {
    // if we send a private message
    if (client.isPrivateMode()) {
      return sendPrivateMessage(line)
    } else if (line[0] === '@') {
      return setPrivateRecipients(line)
    }
    return sendPublicMessage(line)
  })
}