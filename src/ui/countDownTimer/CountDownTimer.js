import { Text } from 'pixi.js'
import { CountDownTimerStyle } from './countDownStyle.js'

export class CountDownTimer {
  constructor (app, duration, onTimeChange) {
    this.app = app
    this.remainingTime = duration
    this.initialDuration = duration
    this.onTimeChange = onTimeChange
    this.interval = null

    this.timerText = this.createText()

    this.timerText.x = app.screen.width - this.timerText.width - 20
    this.timerText.y = 20

    this.app.stage.addChild(this.timerText)
  }

  createText () {
    return new Text(`Time left: ${this.remainingTime}`,
      CountDownTimerStyle)
  }

  start () {
    if (this.interval) return
    this.interval = setInterval(() => {
      this.timerText.text = `Time left: ${this.remainingTime--}`
      if (this.onTimeChange) {
        this.onTimeChange(this.remainingTime)
      }
      if (this.remainingTime === 0) {
        this.timerText.text = `Time's up!`
        clearInterval(this.interval)
      }
    }, 1000)
  }

  reset () {
    this.stop()
    this.remainingTime = this.initialDuration
    this.timerText.text = `Time left: ${this.remainingTime}`
  }

  stop () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}
