import { Graphics } from 'pixi.js'
import { getBoundCords } from '../app/utils.js'

export class Bullet {
  constructor (app, x, y, config) {
    this.app = app
    this.x = x
    this.y = y
    this.config = config

    this.graphic = new Graphics()
    this.graphic.rect(0, 0, this.config.height, this.config.width)
    this.graphic.fill(this.config.color)
    this.graphic.x = this.x
    this.graphic.y = this.y
    this.speed = this.config.speed

    this.app.stage.addChild(this.graphic)

    this.update = this.update.bind(this)
    this.app.ticker.add(this.update)
  }

  update () {
    if (!this.graphic) return
    this.graphic.y -= this.config.speed
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


export class PlayerBullet extends Bullet {
  constructor (app, x, y, config) {
    super(app, x, y, config)
    this.graphic.fill(config.color)
  }
}

export class BossBullet extends Bullet {
  constructor (app, x, y, config) {
    super(app, x, y, config)
    this.graphic.fill(config.color)
  }

  update () {
    if (!this.graphic) return

    this.graphic.y += this.config.speed

    if (this.graphic.y > this.app.screen.height) {
      this.destroy()
    }
  }
}
