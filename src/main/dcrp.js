const DiscordRPC = require('discord-rpc')
// https://discordapp.com/developers/docs/topics/oauth2
const scopes = ['rpc', 'rpc.api']

class DiscrodRichPresence {
  constructor () {
    console.log(`DRP construct`)
    this.startTimestamp = null
    this.client = null
    this.clientId = '567645505534820353'
    // this.clientSecret = 'abcdefg....'
    this.clientSecret = ''
    this.redirectUri = 'https://discordapp.com/api/oauth2/authorize?client_id=567645505534820353&redirect_uri=http%3A%2F%2Fkc3beholder.org&response_type=code&scope=rpc%20rpc.api'
  }

  async start () {
    console.log(`DRP start`)
    this.startTimestamp = new Date()
    DiscordRPC.register(this.clientId)
    this.client = new DiscordRPC.Client({transport: 'ipc'})
    this.client.clientId = this.clientId
    this.client.on('ready', async () => {
      console.log('DRP Ready Logged in as', this.client.application.name)
      console.log('DRP Ready2 Authed for user', this.client.user.username)
      this.update()
      setInterval(this.update.bind(this), 15 * 1000)
    })

    this.client.on('error', (e) => {
      console.log(`DRP ERROR`, e)
    })

    // Log in to RPC with client id
    await this.client.login({
      clientId: this.clientId,
      scopes,
      redirectUri: this.redirectUri,
      clientSecret: this.clientSecret
    })
  }

  async update () {
    console.log(`DRP update`)
    try {
      const setAct = await this.client.setActivity({
        details: `is he in KC3K2?`,
        state: `chilling in port`,
        largeImageKey: '10cm',
        instance: false,
        startTimestamp: this.startTimestamp
      })
      console.log(`RESPONSE`, setAct)
    } catch (e) {
      console.log(e)
    }
  }
}

const DRP = new DiscrodRichPresence()
export default DRP
