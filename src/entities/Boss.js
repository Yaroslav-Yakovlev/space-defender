import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'

export class Boss {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.canShot = true

    this.sprite = new Sprite(Assets.get(CONFIG.assets.boss))
    this.sprite.width = CONFIG.bossParams.width
    this.sprite.height = CONFIG.bossParams.height
    this.sprite.x = 600
    this.sprite.y = 100
    this.sprite.anchor.set(0.5)

    this.app.stage.addChild(this.sprite)
  }
}
