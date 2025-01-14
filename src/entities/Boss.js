import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { BossHP } from '../ui/bossHP/BossHP.js'
import { destroyEntity, getBoundCords } from '../app/utils.js'
import { BossBullet } from './Bullet.js'

export class Boss {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.canShot = true
    this.hp = CONFIG.bossShipParams.hp

    this.sprite = new Sprite(Assets.get(CONFIG.assets.boss))
    this.sprite.width = CONFIG.bossShipParams.width
    this.sprite.height = CONFIG.bossShipParams.height
    this.sprite.x = 500
    this.sprite.y = 100
    this.sprite.anchor.set(0.5)

    this.app.stage.addChild(this.sprite)

    this.phBar = new BossHP(this.app, this, this.hp)

    this.lastShotTime = 0
    this.app.ticker.add(this.handleShooting.bind(this))
  }

  takeDamage () {
    if (this.hp > 0) {
      this.hp--
      this.phBar.updateHP(this.hp)
    }

    if (this.hp === 0) {
      this.destroy()
      this.game.endGameAndMessage('youWin')
    }
  }

  shoot () {
    new BossBullet(
      this.app,
      this.sprite.x - 4,
      this.sprite.y + this.sprite.height / 2,
      CONFIG.bossBullet
    )
  }

  handleShooting () {
    const currentTime = performance.now()
    if (currentTime - this.lastShotTime > 2000) {
      this.shoot()
      this.lastShotTime = currentTime
    }
  }

  getBossCoords () {
    return getBoundCords(this.sprite)
  }

  destroy () {
    destroyEntity(this.sprite, this.app, CONFIG.assets.destroyedBossShip,
      () => this.sprite = null
    )
  }

  isDead () {
    return this.hp <= 0
  }
}
