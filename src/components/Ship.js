import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { Bullet } from './Bullet.js'

export class Ship {
  constructor (app) {
    this.app = app
    this.ship = null
    this.moveLeft = false
    this.moveRight = false
    this.speed = CONFIG.shipParams.speed
    this.height = CONFIG.shipParams.height
    this.width = CONFIG.shipParams.width
    this.bulletsAmount = CONFIG.shipParams.bulletsAmount
    this.bullets = []
    this.canShot = true
  }

  init () {
    const shipTexture = Assets.get(CONFIG.assets.ship)
    this.ship = new Sprite(shipTexture)

    this.ship.width = CONFIG.shipParams.width
    this.ship.height = CONFIG.shipParams.height
    this.ship.x = (CONFIG.screen.width - this.ship.width) / 2
    this.ship.y = CONFIG.screen.height - this.ship.height - 10

    this.app.stage.addChild(this.ship)

    this.setupControllers()

    this.app.ticker.add(() => this.update())
  }

  setupControllers () {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft') this.moveLeft = true
        if (event.code === 'ArrowRight') this.moveRight = true
      }
    )

    window.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowLeft') this.moveLeft = false
      if (event.code === 'ArrowRight') this.moveRight = false
    })

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space' && this.canShot) {
        this.shot()
        this.canShot = false

        setTimeout(() => this.canShot = true, 300)
      }
    })
  }

  update () {
    if (this.moveLeft) {
      this.ship.x = Math.max(0, this.ship.x - this.speed)
    }
    if (this.moveRight) {
      this.ship.x = Math.min(CONFIG.screen.width - this.ship.width,
        this.ship.x + this.speed)
    }
  }

  shot () {
    if (this.bullets.length < this.bulletsAmount) {
      const bullet = new Bullet(this.app,
        this.ship.x + this.ship.width / 2 - 2.5, this.ship.y - 20)
      this.bullets.push(bullet)
    } else {
      console.log('You Lose')
    }
  }
}
