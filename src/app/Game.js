import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../entities/Ship.js'
import { Asteroid } from '../entities/Asteroid.js'
import { BulletsCounter } from '../ui/bulletsCounter/BulletsCounter.js'
import { CountDownTimer } from '../ui/countDownTimer/CountDownTimer.js'
import { Button } from '../ui/button/Button.js'
import { ResultMessage } from '../ui/resultMessage/ResultMessage.js'
import { gameStyles } from '../styles/gameStyles.js'
import { Boss } from '../entities/Boss.js'

export class Game {
  constructor () {
    this.asteroids = []
    this.playerBullets = []
    this.bossBullets = []
    this.asteroidsInterval = CONFIG.game.asteroidsInterval
    this.asteroidAmound = CONFIG.game.asteroidAmount
    this.playerBulletsLeft = CONFIG.game.playerBulletsAmount
    this.bulletsAmount = CONFIG.game.playerBulletsAmount
    this.gameDuration = CONFIG.game.gameDuration
    this.desrtoyedAsteroids = 0
    this.playerShipX = CONFIG.screen.width / 2
    this.playerShipY = CONFIG.screen.height - CONFIG.PlayerShipParams.height
    this.isGameRunning = false
    this.gameResultMessage = ''
    this.isBossLevel = false
    this.lastAsteroidSpawnTime = 0
  }

  async setup () {
    this.app = new Application()

    await this.app.init(gameStyles)
    document.body.appendChild(this.app.canvas)

    await assetsLoader()

    this.loadBackground()
    this.checkCollisions()
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
    this.asteroidSpawner()
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

    this.desrtoyedAsteroids = 0
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
        if (this.leftTimeGame === 0 && this.desrtoyedAsteroids <
          this.asteroidAmound) {
          this.endGameAndMessage('youLose')
        }
      })
    this.timer.start()
  }

  createBulletsCounter () {
    this.bulletsCounter = new BulletsCounter(this.app, this.playerBulletsLeft,
      this.bulletsAmount)
  }

  asteroidSpawner () {
    if (this.isBossLevel) return
    const currentTime = performance.now()

    if (currentTime - this.lastAsteroidSpawnTime > this.asteroidsInterval) {
      if (this.asteroids.length < this.asteroidAmound) {
        this.asteroids.push(new Asteroid(this.app, this))
      }
      this.lastAsteroidSpawnTime = currentTime
    }
  }

  handleBulletFire (bullet) {
    if (this.playerBulletsLeft) {
      this.playerBullets.push(bullet)
      this.playerBulletsLeft--
      this.bulletsCounter.update(this.playerBulletsLeft)
    }
  }

  isColliding (sprite1, sprite2) {
    if (!sprite1 || !sprite2) return false

    return (
      sprite1.x < sprite2.x + sprite2.width &&
      sprite1.x + sprite2.width > sprite2.x &&
      sprite1.y < sprite2.y + sprite2.height &&
      sprite1.y + sprite1.height > sprite2.y
    )
  }

  checkCollisions () {
    this.playerBullets.forEach((bullet) => {
      this.asteroids.forEach((asteroid) => {
        if (this.isColliding(bullet.getBulletCords(),
          asteroid.getAsteroidCords())) {
          this.desrtoyedAsteroids++

          bullet.destroy()
          asteroid.destroy()
        }
      })

      if (this.boss &&
        this.isColliding(bullet.getBulletCords(), this.boss.getBossCoords())) {
        bullet.destroy()
        this.boss.takeDamage()
      }
    })

    if (this.desrtoyedAsteroids === this.asteroidAmound) {
      this.endGameAndMessage('youWin')
    }
  }

  checkBulletsCollision () {
    this.playerBullets.forEach((playerBullet) => {
      this.bossBullets.forEach((bossBullet) => {
        if (this.isColliding(playerBullet.getBulletCords(),
          bossBullet.getBulletCords())) {
          playerBullet.destroy()
          bossBullet.destroy()
        }
      })
    })
    if (this.playerBulletsLeft === 0 && this.boss) {
      this.endGameAndMessage('youLose')
      this.boss.stopShooting()
    }
  }

  checkShipCollision () {
    this.asteroids.forEach((asteroid) => {
      if (this.isColliding(this.playerShip.getShipCords(),
        asteroid.getAsteroidCords())) {
        this.playerShip.destroy()

        this.endGameAndMessage('youLose')
      }
    })
  }

  checkBossBulletCollisions () {
    this.bossBullets.forEach((bullet) => {
      if (this.isColliding(bullet.getBulletCords(),
        this.playerShip.getShipCords())) {
        bullet.destroy()
        this.playerShip.destroy()
        this.boss.stopShooting()
        this.endGameAndMessage('youLose')
      }
    })
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

    this.asteroids.forEach((a) => a.update())
    this.playerBullets.forEach((b) => b.update())
    this.bossBullets.forEach((b) => b.update())

    this.asteroidSpawner()

    if (this.isBossLevel) this.boss.update()

    this.checkCollisions()
    this.checkShipCollision()
    this.checkBulletsCollision()
    this.checkBossBulletCollisions()
  }
}

(async () => {
  const game = new Game()
  await game.setup()
})()
