import { Text } from 'pixi.js'
import { CountDownTimerStyle } from './countDownStyle.js'

export class CountDownTimer {
  constructor (app, duration) {
    this.app = app
    this.remainingTime = duration
    this.interval = null

    this.timerText = new Text(`Time left: ${this.remainingTime}`, CountDownTimerStyle)

    this.timerText.x = app.screen.width - this.timerText.width - 20
    this.timerText.y = 20

    this.app.stage.addChild(this.timerText)
  }

  start() {
    if(this.interval) return
    this.interval = setInterval(() => {
      this.remainingTime --
      this.timerText.text = `Time left: ${this.remainingTime}`
      if(this.remainingTime === 0) {
        this.timerText.text = `Time's up!`
        clearInterval(this.interval)
      }
    }, 1000)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

}
