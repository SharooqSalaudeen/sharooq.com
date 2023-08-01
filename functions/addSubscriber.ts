import { Handler } from '@netlify/functions'

// const mailchimp = require('@mailchimp/mailchimp_marketing')

const axios = require('axios')
const listId = '7b1593a11a'
const apiKey = '2dd51d39f411e2fa92cd2589ae5ac79c-us19'
// mailchimp.setConfig({
//   apiKey: '2dd51d39f411e2fa92cd2589ae5ac79c-us19',
//   server: 'us19',
// })

const handler: Handler = async (event, context) => {
  const body = JSON.parse(event.body!)
  const { email } = body
  console.log('email *****', email)

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide an email address.' }),
    }
  }

  try {
    const payload = {
      email,
      status: 'subscribed',
    }
    // const response = await mailchimp.lists.addListMember(listId, {
    //   email_address: email,
    //   status: 'subscribed',
    // })

    // const { data } = await axios.post(`https://us19.api.mailchimp.com/3.0/lists/${listId}/members`, payload, {
    //   headers: {
    //     Authorization: `Basic ${apiKey}`,
    //   },
    // })

    const { data } = await axios.post(` https://us19.api.mailchimp.com/3.0/ping`, payload, {
      headers: {
        Authorization: `Basic ${apiKey}`,
      },
    })

    // const response = await mailchimp.ping.get()
    // console.log(response)

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

export { handler }
