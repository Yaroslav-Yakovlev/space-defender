import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../entities/Ship.js'
import { Asteroid } from '../entities/Asteroid'
import { BulletsCounter } from '../ui/bulletsCounter/BulletsCounter'
import { CountDownTimer } from '../ui/countDownTimer/CountDownTimer'
import { Button } from '../ui/button/Button'
import { ResultMessage } from '../ui/resultMessage/ResultMessage'

export class Game {
  constructor () {
    this.asteroids = []
    this.bullets = []
    this.asteroidsInterval = CONFIG.game.asteroidsInterval
    this.asteroidAmound = CONFIG.game.asteroidAmount
    this.bulletsLeft = CONFIG.game.bulletsAmount
    this.bulletsAmount = CONFIG.game.bulletsAmount
    this.gameDuration = CONFIG.game.gameDuration
    this.desrtoyedAsteroids = 0
    this.shipX = CONFIG.screen.width / 2
    this.shipY = CONFIG.screen.height - CONFIG.shipParams.height
    this.isGameRunning = false
    this.gameResult = ''
  }

  async init () {
    this.app = new Application()
    await this.app.init({
      width: CONFIG.screen.width,
      height: CONFIG.screen.height,
      background: 0x000000
    })

    document.body.appendChild(this.app.canvas)

    await assetsLoader()

    this.loadBackground()
    this.checkCollisions()
    this.createStarButton()

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

  createStarButton () {
    new Button(this.app, CONFIG.button.startGameText,this)
  }

  startGame () {
    if (this.isGameRunning) return

    this.clearAsteroidSpawner()

    this.isGameRunning = true
    this.app.stage.removeChildren()
    this.loadBackground()
    this.loadShip()
    this.createBulletsCounter()
    this.createCountDownTimer()
    this.asteroidSpawner()
  }

  showGameResult () {
    this.isGameRunning = false
    this.clearAsteroidSpawner()
    let resultText = CONFIG.resultMessage.messageText[this.gameResult]
    new ResultMessage(this.app, resultText)

    new Button(this.app, resultText, this)

    setTimeout(() => {
      this.app.ticker.stop()
    }, 100)
  }

  loadShip () {
    this.ship = new Ship(this.app, this.shipX, this.shipY, this)
  }

  createCountDownTimer () {
    this.timer = new CountDownTimer(this.app, this.gameDuration, (remainingTime) => {
      this.leftTimeGame = remainingTime
      if(this.leftTimeGame === 0 && this.desrtoyedAsteroids < this.asteroidAmound) {
        this.gameResult = 'youLose'
        this.showGameResult()
      }
    })
    this.timer.start()
  }

  createBulletsCounter () {
    this.bulletsCounter = new BulletsCounter(this.app, this.bulletsLeft, this.bulletsAmount)
  }

  asteroidSpawner () {
   this.asteroidSpawnInterval = setInterval(() => {
      if (this.asteroids.length < this.asteroidAmound) {
        this.asteroid = new Asteroid(this.app, this)
        this.asteroids.push(this.asteroid)
      }
    }, this.asteroidsInterval)
  }

  clearAsteroidSpawner() {
    if(this.asteroidSpawnInterval) {
      clearInterval(this.asteroidSpawnInterval)
      this.asteroidsInterval = null
    }
  }

  handleBulletFire (bullet) {
    if (this.bulletsLeft) {
      this.bullets.push(bullet)
      this.bulletsLeft--
      this.bulletsCounter.update(this.bulletsLeft)
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
    this.bullets.forEach((bullet) => {
      this.asteroids.forEach((asteroid) => {
        if (this.isColliding(bullet.getBulletCords(), asteroid.getAsteroidCords())) {
          this.desrtoyedAsteroids ++
          bullet.destroy()
          asteroid.destroy()
        }
      })
    })
    if(this.desrtoyedAsteroids === this.asteroidAmound) {
      this.gameResult = 'youWin'
      this.showGameResult()
    }
  }

  checkShipCollision () {
    this.asteroids.forEach((asteroid) => {
      if (this.isColliding(this.ship.getShipCords(),
        asteroid.getAsteroidCords())) {
        this.ship.destroy()
        this.gameResult = 'youLose'
        this.showGameResult()
      }
    })
  }

  gameLoop () {
    this.ship.update()
    this.asteroids.forEach(a => a.update())
    this.bullets.forEach((b) => b.update())

    this.checkCollisions()
    this.checkShipCollision()
  }
}

(async () => {
  const game = new Game()
  await game.init()
})()

