import { BulletsCounter } from '../ui/bulletsCounter/BulletsCounter.js'
import { CountDownTimer } from '../ui/countDownTimer/CountDownTimer.js'
import { CONFIG } from './config.js'
import { ResultMessage } from '../ui/resultMessage/ResultMessage.js'
import { Button } from '../ui/button/Button.js'

export class UIManager {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.gameDuration = CONFIG.game.gameDuration
  }

  createBulletsCounter () {
    const { app, playerBulletsLeft, bulletsAmount } = this.game
    this.bulletsCounter = new BulletsCounter(app, playerBulletsLeft,
      bulletsAmount)
  }

  updateBulletsCounter () {
    this.bulletsCounter.update(this.game.playerBulletsLeft)
  }

  createCountDownTimer () {
    const {
      app,
      destroyedAsteroids,
      asteroidAmount,
      endGameAndMessage
    } = this.game
    this.timer = new CountDownTimer(app, this.gameDuration,
      (remainingTime) => {
        if (remainingTime === 0 && destroyedAsteroids <
          asteroidAmount) {
          endGameAndMessage('youLose')
        }
      })
    this.timer.start()
  }

  resetTimer () {
    if (this.timer) {
      this.timer.reset()
    }
  }

  stopTimer () {
    if (this.timer) {
      this.timer.stop()
    }
  }

  showGameResultMessage () {
    const { app, gameResultMessage } = this.game
    this.game.showCursor()
    this.game.isGameRunning = false
    let resultText = CONFIG.resultMessage.messageText[gameResultMessage]

    if (this.game.isBossLevel) {
      new ResultMessage(app, resultText)
    } else {
      new ResultMessage(app, resultText)
      new Button(app, resultText, this.game)
    }
  }
}
