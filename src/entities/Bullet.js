import { Graphics } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { getBoundCords } from '../app/utils.js'

export class Bullet {
  constructor (app, x, y) {
    this.app = app
    this.x = x
    this.y = y

    this.graphic = new Graphics()
    this.graphic.rect(0, 0, CONFIG.bullet.height, CONFIG.bullet.width)
    this.graphic.fill(CONFIG.bullet.color)
    this.graphic.x = this.x
    this.graphic.y = this.y
    this.speed = CONFIG.bullet.speed

    this.app.stage.addChild(this.graphic)
  }

  update () {
    if (!this.graphic) return
    this.graphic.y -= this.speed
    if (this.graphic.y + this.graphic.height < 0) {
      this.destroy()
    }
  }

  getBulletCords () {
    return getBoundCords(this.graphic)
  }

  destroy () {
    if (!this.graphic) return
    this.app.ticker.remove(this.update, this)
    this.app.stage.removeChild(this.graphic)
    this.graphic.destroy()
    this.graphic = null
  }
}
