require('dotenv').config()
const axios = require('axios')
var crypto = require('crypto')

const apiRoot = process.env.MAILCHIMP_API_ROOT

exports.handler = async (event, context) => {
  try {
    // const email = event.queryStringParameters.email
    const body = JSON.parse(event.body)
    const { email } = body
    if (!email) {
      return {
        statusCode: 500,
        body: 'email query paramter required',
      }
    }

    // https://gist.github.com/kitek/1579117
    let emailhash = crypto.createHash('md5').update(email).digest('hex')

    return axios({
      method: 'put',
      url: apiRoot + emailhash,
      data: {
        email_address: email,
        status: 'subscribed',
      },
      auth: {
        username: process.env.MAILCHIMP_USERNAME,
        password: process.env.MAILCHIMP_API_KEY,
      },
    })
      .then((res) => {
        return {
          statusCode: 200,
          body: JSON.stringify(res.data),
        }
      })
      .catch((err) => {
        console.log('returning from here', err.response.data.detail)
        return { statusCode: 500, body: JSON.stringify(err.response.data) }
      })
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
