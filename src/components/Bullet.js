import { Graphics } from 'pixi.js'
import { CONFIG } from '../app/config.js'

export class Bullet {
  constructor (app, x, y) {
    this.app = app
    this.bullet = new Graphics()
    this.bullet.rect(0, 0, CONFIG.bullet.height, CONFIG.bullet.width)
    this.bullet.fill(CONFIG.bullet.color)

    this.bullet.x = x
    this.bullet.y = y
    this.speed = CONFIG.bullet.speed

    this.app.stage.addChild(this.bullet)

    this.app.ticker.add(this.update, this)
  }

  update () {
    this.bullet.y -= this.speed

    if (this.bullet.y + this.bullet.height < 0) {
      this.destroy()
    }
  }

  destroy () {
    this.app.ticker.remove(this.update, this)
    this.app.stage.removeChild(this.bullet)
    this.bullet.destroy()
    this.bullet = null
  }
}
