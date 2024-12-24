import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { Bullet } from './Bullet.js'
import { fadeOutAndRemoveSprite } from '../app/utils.js'

export class Ship {
  constructor (app, x, y, game) {
    this.app = app
    this.game = game
    this.moveLeft = false
    this.moveRight = false
    this.speed = CONFIG.shipParams.speed
    this.canShot = true
    this.bulletsAmount = CONFIG.shipParams.bulletsAmount

    const shipTexture = Assets.get(CONFIG.assets.ship)
    this.sprite = new Sprite(shipTexture)

    this.sprite.width = CONFIG.shipParams.width
    this.sprite.height = CONFIG.shipParams.height
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.anchor.set(0.5)
    this.app.stage.addChild(this.sprite)

    this.setupControllers()
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
        this.shoot()
        this.canShot = false

        setTimeout(() => this.canShot = true, 300)
      }
    })
  }

  update () {
    if (!this.sprite) return
    const maxRotation = CONFIG.shipParams.maxRotation
    const rotationSpeed = CONFIG.shipParams.rotationSpeed

    if (!this.moveLeft && !this.moveRight) this.sprite.rotation = 0

    if (this.moveLeft) {
      this.sprite.x = Math.max(this.sprite.width / 2,
        this.sprite.x - this.speed)
      this.sprite.rotation = Math.max(-maxRotation,
        this.sprite.rotation - rotationSpeed)
    }

    if (this.moveRight) {
      this.sprite.x = Math.min(CONFIG.screen.width - this.sprite.width / 2,
        this.sprite.x + this.speed)
      this.sprite.rotation = Math.min(maxRotation,
        this.sprite.rotation + rotationSpeed)
    }
  }

  isCanShoot() {
    return !this.canShot || this.game.bulletsLeft <= 0 || !this.sprite
  }

  shoot () {
    if (this.isCanShoot()) return
    this.canShot = false

    setTimeout(() => (this.canShot = true), 300)

    const bullet = new Bullet(
      this.app,
      this.sprite.x - 4,
      this.sprite.y - (this.sprite.height / 2) - 12
    )

    this.game.handleBulletFire(bullet)
  }

  getShipCords () {
    if (!this.sprite) return null

    const bounds = this.sprite.getBounds()
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    }
  }

  destroy () {
    this.sprite.texture = Assets.get(CONFIG.assets.destroyedShip)

    fadeOutAndRemoveSprite(this.sprite, this.app)
    this.sprite = null
  }
}
