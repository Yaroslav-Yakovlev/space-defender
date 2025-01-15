import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { destroyEntity, getBoundCords } from '../app/utils.js'
import { PlayerBullet } from './Bullet.js'

export class Ship {
  constructor (app, x, y, game) {
    this.app = app
    this.game = game
    this.moveLeft = false
    this.moveRight = false
    this.speed = CONFIG.shipParams.speed
    this.canShot = true
    this.bulletsAmount = CONFIG.shipParams.bulletsAmount
    this.playerBulletsInterval = CONFIG.game.playerBulletsInterval
    this.lastShotTime = 0

    this.sprite = new Sprite(Assets.get(CONFIG.assets.ship))
    this.sprite.width = CONFIG.shipParams.width
    this.sprite.height = CONFIG.shipParams.height
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.anchor.set(0.5)
    this.app.stage.addChild(this.sprite)

    this.setupControllers()
  }

  setupControllers () {
    if (this.keydownHandler) return
    this.keydownHandler = (event) => {
      if (event.code === 'ArrowLeft') {
        this.moveLeft = true
        this.moveRight = false
      }
      if (event.code === 'ArrowRight') {
        this.moveRight = true
        this.moveLeft = false
      }
      if (event.code === 'Space' && this.canShot) {
        this.shoot()
        this.canShot = false
        setTimeout(() => (this.canShot = true), 300)
      }
    }

    this.keyupHandler = (event) => {
      if (event.code === 'ArrowLeft') this.moveLeft = false
      if (event.code === 'ArrowRight') this.moveRight = false
    }

    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)
  }

  removeControllers () {
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
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

  canShoot () {
    return this.game.bulletsLeft <= 0 || !this.sprite
  }

  shoot () {
    if (this.canShoot()) return

    const currentTime = performance.now()
    if (currentTime - this.lastShotTime > this.playerBulletsInterval) {
      const bullet = new PlayerBullet(
        this.app,
        this.sprite.x - 4,
        this.sprite.y - (this.sprite.height / 2) - 12,
        CONFIG.playerBullet
      )
      this.game.handleBulletFire(bullet)
    }
    this.lastShotTime = currentTime
  }

  getShipCords () {
    return getBoundCords(this.sprite)
  }

  destroy () {
    this.removeControllers()
    destroyEntity(this.sprite, this.app, CONFIG.assets.destroyedShip,
      () => this.sprite = null)
  }
}
