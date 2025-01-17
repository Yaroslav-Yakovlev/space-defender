import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../entities/Ship.js'
import { BulletsCounter } from '../ui/bulletsCounter/BulletsCounter.js'
import { CountDownTimer } from '../ui/countDownTimer/CountDownTimer.js'
import { Button } from '../ui/button/Button.js'
import { ResultMessage } from '../ui/resultMessage/ResultMessage.js'
import { gameStyles } from '../styles/gameStyles.js'
import { Boss } from '../entities/Boss.js'
import { CollisionManager } from './CollisionManager.js'
import { AsteroidSpawner } from './AsteroidSpawner.js'

export class Game {
  constructor () {
    this.playerBullets = []
    this.bossBullets = []
    this.asteroids = []
    this.isGameRunning = false
    this.collisionManager = new CollisionManager(this)
    this.asteroidSpawner = new AsteroidSpawner(this)
    this.asteroidAmount = CONFIG.game.asteroidAmount
    this.playerBulletsLeft = CONFIG.game.playerBulletsAmount
    this.bulletsAmount = CONFIG.game.playerBulletsAmount
    this.gameDuration = CONFIG.game.gameDuration
    this.destroyedAsteroids = 0
    this.playerShipX = CONFIG.screen.width / 2
    this.playerShipY = CONFIG.screen.height - CONFIG.PlayerShipParams.height
    this.gameResultMessage = ''
    this.isBossLevel = false
  }

  async setup () {
    this.app = new Application()

    await this.app.init(gameStyles)
    document.body.appendChild(this.app.canvas)

    await assetsLoader()

    this.loadBackground()
    this.createStartButton()

    this.app.ticker.add(() => {
      if (this.isGameRunning) this.gameLoop()
    })
  }

  loadBackground () {
    const background = new Sprite(Assets.get(CONFIG.assets.background))
    background.width = CONFIG.screen.width
    background.height = CONFIG.screen.height

    this.app.stage.addChild(background)
  }

  createStartButton () {
    new Button(this.app, CONFIG.button.startGameText, this)
  }

  startGame () {
    if (this.isGameRunning) return

    this.hideCursor()
    this.isGameRunning = true
    this.app.stage.removeChildren()

    this.loadBackground()
    this.loadShip()
    this.createBulletsCounter()
    this.createCountDownTimer()
  }

  resetGame () {
    if (this.timer) this.timer.reset()

    this.asteroids.forEach((asteroid) => asteroid.destroy())
    this.playerBullets.forEach((bullet) => bullet.destroy())
    this.bossBullets.forEach((bullet) => bullet.destroy())

    this.asteroids = []
    this.playerBullets = []
    this.bossBullets = []

    this.playerBulletsLeft = CONFIG.game.playerBulletsAmount

    this.destroyedAsteroids = 0
    this.gameResultMessage = ''

    this.app.stage.removeChildren()
    this.loadBackground()
    this.createStartButton()
  }

  levelWithBoss () {
    this.resetGame()
    this.hideCursor()

    this.loadBackground()
    this.loadBoss()
    this.loadShip()
    this.createBulletsCounter()
    this.createCountDownTimer()

    this.isGameRunning = true
    this.isBossLevel = true
  }

  loadBoss () {
    if (this.boss) {
      this.boss.destroy()
    }
    this.boss = new Boss(this.app, this)
  }

  hideCursor () {
    this.app.canvas.style.cursor = 'none'
  }

  showCursor () {
    this.app.canvas.style.cursor = 'default'
  }

  showGameResultMessage () {
    this.showCursor()
    this.isGameRunning = false
    let resultText = CONFIG.resultMessage.messageText[this.gameResultMessage]

    if (this.isBossLevel) {
      new ResultMessage(this.app, resultText)
    } else {
      new ResultMessage(this.app, resultText)
      new Button(this.app, resultText, this)
    }
  }

  loadShip () {
    if (this.playerShip) this.playerShip.removeControllers()
    this.playerShip = new Ship(this.app, this.playerShipX, this.playerShipY,
      this)
    this.playerShip.setupControllers()
  }

  createCountDownTimer () {
    this.timer = new CountDownTimer(this.app, this.gameDuration,
      (remainingTime) => {
        this.leftTimeGame = remainingTime
        if (this.leftTimeGame === 0 && this.destroyedAsteroids <
          this.asteroidAmount) {
          this.endGameAndMessage('youLose')
        }
      })
    this.timer.start()
  }

  createBulletsCounter () {
    this.bulletsCounter = new BulletsCounter(this.app, this.playerBulletsLeft,
      this.bulletsAmount)
  }

  handleBulletFire (bullet) {
    if (this.playerBulletsLeft) {
      this.playerBullets.push(bullet)
      this.playerBulletsLeft--
      this.bulletsCounter.update(this.playerBulletsLeft)
    }
  }

  endGameAndMessage (text) {
    this.gameResultMessage = text
    this.timer.stop()
    this.timer.reset()
    this.showGameResultMessage()
    this.isGameRunning = false
  }

  gameLoop () {
    if (this.playerShip) this.playerShip.update()

    this.collisionManager.update()
    this.asteroids.forEach((a) => a.update())
    this.playerBullets.forEach((b) => b.update())
    this.bossBullets.forEach((b) => b.update())

    this.asteroidSpawner.update()

    if (this.isBossLevel) this.boss.update()

  }
}

(async () => {
  const game = new Game()
  await game.setup()
})()
