import { Assets, Sprite } from 'pixi.js'
import { CONFIG } from '../app/config.js'

export class Asteroid {
  constructor (app) {
    this.app = app
    this.rotationSpeed = CONFIG.asteroidParams.rotationSpeed
    this.speed = CONFIG.asteroidParams.getAsteroidSpeed()

    this.asteroidTexture = Assets.get(CONFIG.assets.asteroid)
    this.sprite = new Sprite(this.asteroidTexture)
    this.sprite.width = CONFIG.asteroidParams.width
    this.sprite.height = CONFIG.asteroidParams.height
    this.sprite.x = Math.random() * (CONFIG.screen.width - this.sprite.width)
    this.sprite.y = -this.sprite.height
    this.sprite.anchor.set(0.5)

    this.app.stage.addChild(this.sprite)
  }

  update() {
    if (!this.sprite) return
    this.sprite.y += this.speed / 2
    this.sprite.rotation += this.rotationSpeed

    if(this.sprite.y > this.app.screen.height + this.sprite.height) {
      this.destroy()
    }
  }

  getAsteroidCords() {
    if (!this.sprite) return
    const bounds = this.sprite.getBounds()

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    }
  }

  destroy() {
    // this.app.ticker.remove(this.update, this)
    this.app.stage.removeChild(this.sprite)
    this.sprite.destroy()
    this.sprite = null
  }
}
