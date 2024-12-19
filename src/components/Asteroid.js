import { Assets, Sprite } from 'pixi.js'
import { CONFIG } from '../app/config.js'

export class Asteroid {
  constructor (app) {
    this.app = app
    this.asteroid = null
    this.speed = Math.random() * (CONFIG.asteroidParams.maxSpeed - CONFIG.asteroidParams.minSpeed) + CONFIG.asteroidParams.minSpeed
    this.rotationSpeed = Math.random() * 0.1 - 0.03;
  }

  init() {
    const asteroidTexture = Assets.get(CONFIG.assets.asteroid)
    this.asteroid = new Sprite(asteroidTexture)

    this.asteroid.width = CONFIG.asteroidParams.width
    this.asteroid.height = CONFIG.asteroidParams.height
    this.asteroid.x = Math.random() * (CONFIG.screen.height - this.asteroid.width)
    this.asteroid.y = -this.asteroid.height
    this.asteroid.anchor.set(0.5)
    this.app.stage.addChild(this.asteroid)

    this.app.ticker.add(this.update, this)
  }

  update() {
    this.asteroid.y += this.speed
    this.asteroid.rotation += this.rotationSpeed

    if(this.asteroid.y > this.app.screen.height + this.asteroid.height) {
      this.destroy()
    }
  }

  destroy() {
    this.app.ticker.remove(this.update, this)
    this.app.stage.removeChild(this.asteroid)
    this.asteroid.destroy()
    this.asteroid = null
  }
}
