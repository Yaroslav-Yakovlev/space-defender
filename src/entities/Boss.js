import { CONFIG } from '../app/config.js'
import { BossHP } from '../ui/bossHP/BossHP.js'
import { createSprite, destroyEntity, getBoundCords } from '../app/utils.js'
import { BossBullet } from './Bullet.js'

export class Boss {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.hp = CONFIG.bossShipParams.hp
    this.bossBulletsInterval = CONFIG.game.bossBulletsInterval

    const x =  Math.random() * (1200 - 100) + 100

    this.sprite = createSprite({
      textureKey: CONFIG.assets.boss,
      x,
      y: CONFIG.bossShipParams.y,
      width: CONFIG.bossShipParams.width,
      height: CONFIG.bossShipParams.height,
      anchorSet: 0.5,
      app: this.app
    })

    this.phBar = new BossHP(this.app, this, this.hp)

    this.isMoving = false
    this.direction = 1
    this.speed = 2
    this.lastShotTime = 0
    this.isShooting = true

    this.startMoving()

    this.app.ticker.add(() => {
      if (this.isShooting) this.shooting()
    })
  }

  takeDamage () {
    if (this.hp > 0) {
      this.hp--
      this.phBar.updateHP(this.hp)
    }

    if (this.hp === 0) {
      this.game.endGameAndMessage('youWin')
      this.destroy()
    }
  }

  startMoving () {
    if (!this.sprite) return

    this.movementInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        this.isMoving = true
        this.direction = Math.random() > 0.5 ? 1 : -1
        this.speed = Math.random() * 8 + 4

        setTimeout(() => this.isMoving = false, Math.random() * 300 + 400)
      }
    }, Math.random() * 500 + 400)
  }

  clearMovementInterval () {
    if (this.movementInterval) {
      clearInterval(this.movementInterval)
      this.movementInterval = null
    }
  }

  clearShooting () {
    if (this.shootingTicker) {
      this.app.ticker.remove(this.shootingTicker)
      this.shootingTicker = null
    }
  }

  update () {
    if (!this.sprite) return

    this.shooting()

    if (this.isMoving) {
      this.moveSprite()
    }
    this.phBar.updatePosition()
  }

  moveSprite () {
    if (this.isMoving) {
      const spriteWidth = this.sprite.width
      const screenWidth = CONFIG.screen.width

      this.sprite.x += this.direction * this.speed

      if (this.sprite.x < spriteWidth) {
        this.sprite.x = spriteWidth
        this.direction += 1
      }
      if (this.sprite.x > screenWidth - spriteWidth * 2) {
        this.sprite.x = screenWidth - spriteWidth * 2
        this.direction += -1
      }
    }
  }

  shooting () {
    if (!this.sprite) return null

    const currentTime = performance.now()
    if (currentTime - this.lastShotTime > this.bossBulletsInterval) {
      const bullet = new BossBullet(
        this.app,
        this.sprite.x - 6,
        this.sprite.y + this.sprite.height / 2,
        CONFIG.bossBullet
      )
      this.game.bossBullets.push(bullet)
      this.lastShotTime = currentTime
    }
  }

  stopShooting () {
    this.isShooting = false
    this.clearMovementInterval()
    this.clearShooting()
  }

  getBossCoords () {
    return getBoundCords(this.sprite)
  }

  destroy () {
    this.isMoving = false
    this.startMoving()
    this.clearShooting()

    destroyEntity(
      this.sprite,
      this.app,
      CONFIG.assets.destroyedBossShip,
      this.sprite = null
    )
    this.phBar.destroy()
    this.clearMovementInterval()
  }

  isDead () {
    return this.hp <= 0
  }
}
