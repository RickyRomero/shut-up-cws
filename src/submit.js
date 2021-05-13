require('dotenv').config()
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const pathConfig = require('./paths.json')

const refreshToken = async () => {
  const tokenUrl = 'https://oauth2.googleapis.com/token'
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', process.env.CWS_REFRESH_TOKEN)
  params.append('client_id', process.env.CWS_CLIENT_ID)
  params.append('client_secret', process.env.CWS_CLIENT_SECRET)

  console.log('Updating access token...')
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params
  })
  const body = await response.json()

  if (!body.access_token) {
    console.error('Failed to refresh the CWS OAuth token.')
    process.exit(1)
  } else {
    console.log('Successfully updated access token.')
    return body.access_token
  }
}

const submitPayload = async accessToken => {
  const payloadPath = path.resolve(__dirname, pathConfig.artifactsDir, 'Shut Up.zip')
  try {
    await fs.access(payloadPath, fs.constants.F_OK)
  } catch (e) {
    console.dir(e)
    console.error("Built file not present for upload. Can't continue.")
    process.exit(1)
  }

  console.log('Uploading payload...')
  const server = 'https://www.googleapis.com'
  const endpoint = `upload/chromewebstore/v1.1/items/${process.env.CWS_ITEM_ID}`
  const response = await fetch(`${server}/${endpoint}`, {
    method: 'PUT',
    body: fs.createReadStream(payloadPath),
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/zip'
    }
  })

  const body = await response.json()
  if (body.uploadState !== 'SUCCESS') {
    console.error('The server failed to process the upload.')
    console.dir(body)
    process.exit(1)
  } else {
    console.log('Uploaded successfully.')
  }
}

const publishRelease = async accessToken => {
  console.log('Publishing the release...')
  const server = 'https://www.googleapis.com'
  const endpoint = `chromewebstore/v1.1/items/${process.env.CWS_ITEM_ID}/publish`
  const response = await fetch(`${server}/${endpoint}`, {
    method: 'POST',
    body: '',
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })

  const body = await response.json()
  const status = body.status[0] || null
  if (status !== 'OK') {
    console.error('The server refused to publish this release.')
    console.dir(body)
    process.exit(1)
  } else {
    console.log('Published successfully.')
  }
}

const submitNewVersion = async () => {
  const accessToken = await refreshToken()
  await submitPayload(accessToken)
  await publishRelease(accessToken)
}

submitNewVersion()
