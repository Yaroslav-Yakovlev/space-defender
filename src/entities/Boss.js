import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { BossHP } from '../ui/bossHP/BossHP.js'
import { destroyEntity, getBoundCords } from '../app/utils.js'
import { BossBullet } from './Bullet.js'

export class Boss {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.hp = CONFIG.bossShipParams.hp
    this.bossBulletsInterval = CONFIG.game.bossBulletsInterval

    this.sprite = new Sprite(Assets.get(CONFIG.assets.boss))
    this.sprite.width = CONFIG.bossShipParams.width
    this.sprite.height = CONFIG.bossShipParams.height
    this.sprite.x = 500
    this.sprite.y = 100
    this.sprite.anchor.set(0.5)

    this.app.stage.addChild(this.sprite)

    this.phBar = new BossHP(this.app, this, this.hp)

    this.isMoving = false
    this.direction = 1
    this.speed = 2
    this.lastShotTime = 0

    this.startMoving()

    this.app.ticker.add(() => this.shooting())
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
      new BossBullet(
        this.app,
        this.sprite.x - 6,
        this.sprite.y + this.sprite.height / 2,
        CONFIG.bossBullet
      )
      this.lastShotTime = currentTime
    }
  }

  getBossCoords () {
    return getBoundCords(this.sprite)
  }

  destroy () {
    this.isMoving = false
    destroyEntity(
      this.sprite,
      this.app,
      CONFIG.assets.destroyedBossShip,
      () => this.sprite = null
    )
    this.clearMovementInterval()
  }

  isDead () {
    return this.hp <= 0
  }
}
