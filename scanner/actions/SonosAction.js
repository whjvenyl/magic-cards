const fetch = require('node-fetch')
const base64 = require('base-64')
const Action = require('./Action')

class SonosAction extends Action {
  process() {
    const contentConfig = this.config[this.card.type] || {}

    const setRepeat = () => {
      if (contentConfig.repeat) {
        this.repeat(contentConfig.repeat)
      }
    }

    if (contentConfig.shuffle) {
      this.shuffle(contentConfig.shuffle)
        .then(this.queueAndPlay())
        .then(setRepeat())
    } else {
      this.queueAndPlay().then(setRepeat())
    }
  }

  async queueAndPlay() {
    // this.clearQueue()
    // .then(this.request(this.card.uri))
    // .then(this.play())
    this.request(this.card.uri)
  }

  async clearQueue() {
    return this.request('clearqueue')
  }

  async play() {
    return this.request('play')
  }

  async shuffle(mode) {
    return this.request(`shuffle/${mode}`)
  }

  async repeat(mode) {
    return this.request(`repeat/${mode}`)
  }

  async request(path) {
    const room = encodeURIComponent(this.config.room)
    const baseURL = `http://${this.config.host}:${this.config.port}/${room}/${path}`

    let headers = {}
    if (this.config.username && this.config.password) {
      headers['Authorization'] =
        'Basic ' + base64.encode(this.config.username + ':' + this.config.password)
    }

    return fetch(baseURL, {
      method: 'GET',
      headers: headers,
    })
      .then(res => res.text())
      .then(body => console.log(body))
      .catch(error => console.log(error))
  }
}

module.exports = SonosAction
