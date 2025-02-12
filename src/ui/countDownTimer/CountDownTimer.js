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

    this.timerText.x = app.screen.width - this.timerText.width - 5
    this.timerText.y = 5

    this.app.stage.addChild(this.timerText)
  }

  createText () {
    return new Text({
      text: `Time left: ${this.remainingTime}`,
      style: CountDownTimerStyle
    })
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
  }

  stop () {
    this.timerText.text = `Time left: ${this.remainingTime}`
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}
