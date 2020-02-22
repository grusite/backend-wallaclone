const nodemailer = require('nodemailer')
const debug = require('debug')('app:mail')
const dns = require('dns')
const { validate } = require('email-validator')
const { InvalidData } = require('../lib/exceptionPool')
const _ = require('lodash')
const fs = require('fs-extra')
const { resolve } = require('path')

const getTemplate = name => _.template(fs.readFileSync(resolve(__dirname, `../templates/${name}`)))
const confirmEmailHtmlTpl = getTemplate('confirmEmail.html')
const confirmEmailTextTpl = getTemplate('confirmEmail.txt')
const changePasswordHtmlTpl = getTemplate('changePassword.html')
const changePasswordTextTpl = getTemplate('changePassword.txt')

const frontUrl = process.env.FRONT_URL
const sender = 'noreply@wallaclone.es'
let transport

// const mailgunAuth = {
//   host: 'smtp.mailgun.org',
//   port: 587,
//   auth: {
//     user: 'postmaster@sandbox936b980a9e524ec9832f494e614802cf.mailgun.org',
//     pass: process.env.MAILGUN_PASSWD,
//   },
// }

const sendGridAuth = {
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_PASSWD,
  },
}

const mailtrapAuth = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '15c99d2a395ec1',
    pass: process.env.MAILTRAP_PASSWD,
  },
}

async function loadTransport() {
  transport =
    process.env.NODE_ENV === 'development'
      ? nodemailer.createTransport(mailtrapAuth)
      : nodemailer.createTransport(sendGridAuth)
  require('debug')('root:mail')('transport', process.env.NODE_ENV)
}

async function sendVerifyMail(email, token) {
  const url = `${frontUrl}/confirm/${token}`
  debug('send-verify', email)
  const message = {
    from: sender,
    to: email,
    subject: 'Email confirmation - Wallaclone',
    text: confirmEmailTextTpl({ url }),
    html: confirmEmailHtmlTpl({ url }),
  }

  const res = await transport.sendMail(message)
  return res
}
async function sendForgotPasswordMail(email, token) {
  const url = `${frontUrl}/change-password/${token}`

  debug('send-forgot', email)
  const message = {
    from: sender,
    to: email,
    subject: 'Change password - Wallaclone',
    text: changePasswordTextTpl({ url }),
    html: changePasswordHtmlTpl({ url }),
  }

  const res = await transport.sendMail(message)
  return res
}

async function validateEmail(email) {
  if (!validate(email))
    throw new InvalidData({
      reason: 'invalidEmailFormat',
      message: 'Invalid email format',
    })
  const [, domain] = email.split('@')
  return new Promise((resolve, reject) => {
    dns.resolve(domain, 'MX', (err, addresses) => {
      if (err) return reject(new InvalidData(err.message))
      if (!addresses || !addresses.length)
        return reject(
          new InvalidData({
            reason: 'noMXRecords',
            message: 'No MX records for domain',
          })
        )
      resolve()
    })
  })
}

module.exports = {
  sendVerifyMail,
  loadTransport,
  validateEmail,
  sendForgotPasswordMail,
}
