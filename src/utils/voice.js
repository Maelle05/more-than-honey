import EventEmitter from '../webgl/utils/EventEmitter'

export class AudioClass extends EventEmitter{
  constructor(url) {
    super()

    this.url = url
    this.contexteAudio = new AudioContext()
    this.yodelBuffer = null
    this.source = null
    this.isInit = false
    this.gainNode = null

    this.type = 'audio'

    this.init()
  }

  init() {
    this.gainNode = this.contexteAudio.createGain()
    this.gainNode.connect(this.contexteAudio.destination)

    window.fetch(this.url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.contexteAudio.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.yodelBuffer = audioBuffer
        this.isInit = true
        this.trigger(`soundLoad`)
      })
  }

  start() {
    if (this.isInit === true) {
      this.source = this.contexteAudio.createBufferSource()
      this.source.buffer = this.yodelBuffer
      if(this.gainNode)
      this.source.connect(this.gainNode)


      this.source.start()
      this.gainNode.gain.setValueAtTime(0.01, this.contexteAudio.currentTime)

      this.gainNode.gain.exponentialRampToValueAtTime(1, this.contexteAudio.currentTime + 0.3)

    }
  }

  stop() {
    if (this.isInit === true) {

      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.contexteAudio.currentTime)

      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.contexteAudio.currentTime + 1)

      setTimeout(
        () => { 
          if (this.source) {
            this.source.stop() 
          }
        }
        , 2000
      )
    }
  }
}