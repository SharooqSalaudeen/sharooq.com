const axios = require('axios')
var crypto = require('crypto')

const apiRoot = 'https://us19.api.mailchimp.com/3.0/lists/7b1593a11a/members/'

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
        username: 'sharooqs',
        password: '2dd51d39f411e2fa92cd2589ae5ac79c-us19',
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
