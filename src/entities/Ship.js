import { CONFIG } from '../app/config.js'
import { createSprite, destroyEntity, getBoundCords } from '../app/utils.js'
import { PlayerBullet } from './Bullet.js'

export class Ship {
  constructor (app, x, y, game) {
    this.app = app
    this.game = game
    this.x = x
    this.y = y
    this.moveLeft = false
    this.moveRight = false
    this.speed = CONFIG.PlayerShipParams.speed
    this.canShot = true
    this.bulletsAmount = CONFIG.PlayerShipParams.bulletsAmount
    this.playerBulletsInterval = CONFIG.game.playerBulletsInterval
    this.lastShotTime = 0

    this.sprite = createSprite({
      textureKey: CONFIG.assets.ship,
      x,
      y,
      width: CONFIG.PlayerShipParams.width,
      height: CONFIG.PlayerShipParams.height,
      anchorSet: 0.5,
      app: this.app
    })

    this.setupControllers()
  }

  setupControllers () {
    if (this.keydownHandler) return

    this.keydownHandler = (event) => this.handleKeyDown(event)
    this.keyupHandler = (event) => this.handleKeyUp(event)

    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)
  }

  handleKeyDown (event) {
    switch (event.code) {
      case 'ArrowLeft':
        this.moveLeft = true
        this.moveRight = false
        break
      case 'ArrowRight':
        this.moveRight = true
        this.moveLeft = false
        break
      case 'Space':
        if (this.canShot) {
          this.shoot()
          this.canShot = false

          setTimeout(() => (this.canShot = true),
            CONFIG.PlayerShipParams.shootCooldown)
        }
        break
    }
  }

  handleKeyUp (event) {
    if (event.code === 'ArrowLeft') this.moveLeft = false
    if (event.code === 'ArrowRight') this.moveRight = false
  }

  update () {
    if (!this.sprite) return

    this.updatePosition()
    this.updateRotation()
  }

  updatePosition () {
    if (this.moveLeft) {
      this.sprite.x = Math.max(this.sprite.width / 2,
        this.sprite.x - this.speed)
    } else if (this.moveRight) {
      this.sprite.x = Math.min(CONFIG.screen.width - this.sprite.width / 2,
        this.sprite.x + this.speed)
    }
  }

  updateRotation () {
    const { maxRotation, rotationSpeed } = CONFIG.PlayerShipParams

    if (this.moveLeft) {
      this.sprite.rotation = Math.max(-maxRotation,
        this.sprite.rotation - rotationSpeed)
    } else if (this.moveRight) {
      this.sprite.rotation = Math.min(maxRotation,
        this.sprite.rotation + rotationSpeed)
    } else {
      this.sprite.rotation = 0
    }
  }

  canShoot () {
    return this.game.playerBulletsLeft === 0 || !this.sprite ||
      !this.game.isGameRunning
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

  removeControllers () {
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
  }
}
