const CDP = require('chrome-remote-interface')
const EventEmitter = require('events')
const debug = process.env.NODE_ENV !== 'production'

class ChromePipe extends EventEmitter {
  constructor () {
    super()
    this.debugOutput = false
    this.pollingGameFrame = false
    this.clientGameFrame = null
    this.host = 'localhost'
    this.port = '9222'
    this.Requests = {}
  }

  async connectToChrome (data = {}) {
    const oldHost = this.host
    const oldPort = this.port

    if (data.port && data.host) {
      this.port = data.port
      this.host = data.host
    }

    if (this.clientGameFrame !== null) {
      if (this.port !== oldPort || this.host !== oldHost) {
        this.clientGameFrame.off('disconnect')
        this.clientGameFrame.disconnect()
        this.clientGameFrame = null
      } else {
        return this.emit('ConnectedToChrome')
      }
    }

    this.attachToGameFrame()
  }

  async attachToGameFrame () {
    if (this.debugOutput) console.log('attaching to GameFrame', this.pollingGameFrame)
    if (this.pollingGameFrame || this.clientGameFrame !== null) return
    this.pollingGameFrame = true
    try {
      if (!(await this.connectToGameFrame())) {
        setTimeout(this.attachToGameFrame().bind(this), 3000)
      } else {
        this.emit('ConnectedToChrome')
      }
    } catch (Error) {
      if (debug && Error && ['ECONNRESET', 'ECONNREFUSED'].indexOf(Error.code) === -1) {
        console.log(`chrome whisperer kc3: ${JSON.stringify(Error)}`)
      }
      setTimeout(this.attachToGameFrame.bind(this), 3000)
    }
    this.pollingGameFrame = false
  }

  async connectToGameFrame () {
    let gameFrame = (await CDP.List({host: this.host, port: this.port})).filter((e) => {
      return e.type === 'iframe' && e.url.indexOf('/kcs2/index.php?api_root=/kcsapi') !== -1
    })
    if (gameFrame.length !== 1) return false

    let clientGameFrame = await this.connect(gameFrame[0], true)

    if (clientGameFrame === false) return false

    this.clientGameFrame = clientGameFrame
    clientGameFrame.once('disconnect', () => {
      this.clientGameFrame = null
      this.attachToGameFrame()
    })
    return true
  }

  async connect (target, bind = false) {
    try {
      let client = await CDP({host: this.host, port: this.port, target: target})

      let list = [
        client.Page.enable(),
        client.Runtime.enable()
      ]

      if (bind) {
        client.Network.requestWillBeSent(this.beforeSend.bind(this, client))
        client.Network.responseReceived(this.getResponse.bind(this, client))
        client.Network.loadingFinished(this.finishLoading.bind(this, client))
        list.push(client.Network.enable({maxTotalBufferSize: 104857600, maxResourceBufferSize: 104857600}))
      }

      await Promise.all(list)

      return client
    } catch (err) {
      console.error(err)
    }
    return false
  }

  async beforeSend (client, params) {
    if (!/(https?:\/\/\d+\.\d+\.\d+\.\d+\/)/.test(params.request.url)) {
      if (this.debugOutput) console.log(`::sideRequest\t${params.request.url}`)
      return
    }
    this.Requests[params.requestId] = {
      method: params.request.method.toLowerCase(),
      url: params.request.url
    }
    if (this.Requests[params.requestId].method === 'post') {
      if (typeof params.request.postData === 'string') {
        this.Requests[params.requestId].postData = {}
        decodeURIComponent(params.request.postData)
          .split('&')
          .map((a) => {
            this.Requests[params.requestId].postData[a.split('=')[0]] = a.split('=')[1]
          })
      } else {
        this.Requests[params.requestId].postData = Object.assign({}, params.request.postData)
      }
    }
    if (this.debugOutput) console.log(`::requested\t${JSON.stringify(this.Requests[params.requestId])}`)
  }

  async getResponse (client, params) {
    // ignore inline css and scripts.
    if (params.response.url.indexOf('chrome-extension') === 0) {
      return
    }

    if (this.debugOutput) console.log(`::recieved \t${JSON.stringify(params.requestId)}`)
    if (typeof this.Requests[params.requestId] === 'undefined') {
      if (this.debugOutput) console.error(JSON.stringify(params), params)
      return
    }
    this.Requests[params.requestId].mimeType = params.response.mimeType
    if (params.response.mimeType.indexOf('text') === -1) {
      if (this.debugOutput) console.log(`::SendingEvent:ReceivedNonTextMessage: \t${JSON.stringify(this.Requests[params.requestId])}`)
      this.emit('ReceivedNonTextMessage', {type: 'ReceivedNonTextMessage', data: this.Requests[params.requestId]})
      delete this.Requests[params.requestId]
    }
  }

  async finishLoading (client, params) {
    if (this.debugOutput) console.log(`::finished \t${JSON.stringify(params.requestId)}`)
    if (typeof this.Requests[params.requestId] === 'undefined') {
      return
    }

    let response
    try {
      response = await client.Network.getResponseBody({requestId: params.requestId})
    } catch (e) {
      console.error(`Can't get body ${this.Requests[params.requestId].url} ${e}`)
      return delete this.Requests[params.requestId]
    }
    if (typeof response.body === 'string') {
      if (response.body.indexOf('svdata=') > -1) {
        response.body = response.body.substring(7)
      }
      try {
        this.Requests[params.requestId].responseBody = JSON.parse(response.body)
      } catch (e) {
        this.Requests[params.requestId].responseBody = response.body
      }
    } else {
      this.Requests[params.requestId].responseBody = response.body
    }
    if (this.debugOutput) console.log(`::SendingEvent:ReceivedTextMessage: \t${JSON.stringify(this.Requests[params.requestId])}`)
    this.emit('ReceivedTextMessage', {type: 'ReceivedTextMessage', data: this.Requests[params.requestId]})
    delete this.Requests[params.requestId]
  }
}

const chromePipe = new ChromePipe()
export default chromePipe
