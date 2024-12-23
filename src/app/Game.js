import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../components/Ship.js'
import { Asteroid } from '../components/Asteroid'

export class Game {
  constructor () {
    this.asteroids = []
    this.bullets = []
    this.asteroidsInterval = 2000
    this.asteroidAmound = 10
    this.bulletsAmount = 10
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
    this.asteroidSpawner()
    this.checkCollisions()
    this.app.ticker.add(() => this.gameLoop())
  }

  loadBackground () {
    const texture = Assets.get(CONFIG.assets.background)
    const background = new Sprite(texture)

    background.width = CONFIG.screen.width
    background.height = CONFIG.screen.height

    this.app.stage.addChild(background)
  }

  loadShip () {
    this.ship = new Ship(this.app, this.shipX, this.shipY, this)
  }

  asteroidSpawner () {
    setInterval(() => {
      if (this.asteroids.length + 1 < this.asteroidAmound) {
        this.asteroid = new Asteroid(this.app)
        this.asteroids.push(this.asteroid)
      }
    }, this.asteroidsInterval)
  }

  addBullets (bullet) {
    this.bullets.push(bullet)
  }

  isColliding (sprite1, sprite2) {
    if (!sprite1 || !sprite2) return false

    const bounds1 = sprite1
    const bounds2 = sprite2

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds2.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
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
        this.endGame()
      }
    })
  }

  endGame () {
    setTimeout(() => {
      alert('Game Over, You Lose')
      this.app.ticker.stop()
    }, 1000)
  }

  gameLoop () {
    this.ship.update()
    this.asteroids.forEach(a => a.update())
    this.ship.update()
    this.bullets.forEach((b) => b.update())

    this.checkCollisions()
    this.checkShipCollision()
  }
}

(async () => {
  const game = new Game()
  await game.init()
})()

