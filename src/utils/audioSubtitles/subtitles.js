import text from '@/utils/audioSubtitles/subtitles.json'

export class SlideSubtitle {
  constructor(slideStep) {
    this.voice = text[slideStep]
    this.finish = false
    this.numSentences = 0
    this.duration = 0
    this.step = 0
    this.containerSubtitle = document.querySelector('.subtitles--wrapper')
    this.textSubtitle = document.createElement('p')
    this.play = true
  }

  init() {
    if (this.containerSubtitle) {
      this.containerSubtitle.appendChild(this.textSubtitle)
    }
    this.step = 0
    this.play = true
    this.finish = false
    this.durationVoice()
    this.getNewSentence(this.play)
    this.textSubtitle.classList.remove('u-hidden')
  }

  getNewSentence(play) {
    this.textSubtitle.innerHTML = this.voice[this.step].text
    const duration = play ? this.voice[this.step].duration * 1000 : 0
    this.finish = false
    setTimeout(() => {
      if (this.voice[this.step + 1] && play === true) {
        this.step++
        this.getNewSentence(this.play)
      } else {
        this.finish = true
        this.textSubtitle.innerHTML = ''
        this.textSubtitle.classList.add('u-hidden')
        this.step = 0
      }
    }, duration)
  }

  durationVoice() {
    let durationVoice = 0
    let numS = 0

    this.voice.forEach(sentence => {
      numS++
      durationVoice = durationVoice + sentence.duration
    })

    this.numSentences = numS
    this.duration = durationVoice
  }

  getDuration() {
    return this.duration * 1000
  }

  isFinish() {
    if (this.finish === true) {
      return true
    } else {
      return false
    }
  }

  stop() {
    this.play = false
    this.finish = false
    this.step = 0
    this.getNewSentence(this.play)
  }
}