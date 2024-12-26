import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../components/Ship.js'
import { Asteroid } from '../components/Asteroid'
import { BulletsCounter } from '../ui/bulletsCounter/BulletsCounter'
import { CountDownTimer } from '../ui/countDownTimer/CountDownTimer'
import { Button } from '../ui/button/Button'

export class Game {
  constructor () {
    this.asteroids = []
    this.bullets = []
    this.asteroidsInterval = CONFIG.game.asteroidsInterval
    this.asteroidAmound = CONFIG.game.asteroidAmount
    this.bulletsLeft = CONFIG.game.bulletsAmount
    this.bulletsAmount = CONFIG.game.bulletsAmount
    this.gameDuration = CONFIG.game.gameDuration
    this.shipX = CONFIG.screen.width / 2
    this.shipY = CONFIG.screen.height - CONFIG.shipParams.height
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
    this.loadShip()
    this.createBulletsCounter()
    this.asteroidSpawner()
    this.checkCollisions()
    this.createCountDownTimer()
    this.createButton()

    this.app.ticker.add(() => this.gameLoop())
  }

  loadBackground () {
    const texture = Assets.get(CONFIG.assets.background)
    const background = new Sprite(texture)

    background.width = CONFIG.screen.width
    background.height = CONFIG.screen.height

    this.app.stage.addChild(background)
  }

  createButton () {
    new Button(this.app)
  }

  loadShip () {
    this.ship = new Ship(this.app, this.shipX, this.shipY, this)
  }

  createCountDownTimer () {
    this.timer = new CountDownTimer(this.app, this.gameDuration)
    this.timer.start()
  }

  createBulletsCounter () {
    this.bulletsCounter = new BulletsCounter(this.app, this.bulletsLeft, this.bulletsAmount)
  }

  asteroidSpawner () {
    setInterval(() => {
      if (this.asteroids.length < this.asteroidAmound) {
        this.asteroid = new Asteroid(this.app)
        this.asteroids.push(this.asteroid)
      }
    }, this.asteroidsInterval)
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
        if (this.isColliding(bullet.getBulletCords(),
          asteroid.getAsteroidCords())) {
          bullet.destroy()
          asteroid.destroy()
        }
      })
    })
  }

  checkShipCollision () {
    this.asteroids.forEach((asteroid) => {
      if (this.isColliding(this.ship.getShipCords(),
        asteroid.getAsteroidCords())) {
        this.ship.destroy()
        // this.endGame()
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

