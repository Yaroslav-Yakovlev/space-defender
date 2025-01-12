import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { BossHP } from '../ui/bossHP/BossHP.js'

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
  }

  takeDamage () {
    if (this.hp > 0) {
      this.hp--
      this.phBar.updateHP(this.hp)
    }

    if (this.hp === 0) {
      this.die()
    }
  }

  die() {
    console.log('Boss Die')
    this.sprite.destroy()
    this.phBar.destroy()
  }
}
