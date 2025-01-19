import { CONFIG } from '../app/config.js'
import { createSprite, destroyEntity, getBoundCords } from '../app/utils.js'

export class Asteroid {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.rotationSpeed = CONFIG.asteroidParams.rotationSpeed
    this.speed = CONFIG.asteroidParams.getAsteroidSpeed()

    const width = CONFIG.asteroidParams.width
    const height = CONFIG.asteroidParams.height
    const x = Math.random() * (CONFIG.screen.width - width) + width / 2
    const y = -height

    this.sprite = createSprite({
      textureKey: CONFIG.assets.asteroid,
      x,
      y,
      width,
      height,
      anchorSet: 0.5,
      app: this.app
    })
  }

  update () {
    if (!this.sprite) return
    this.sprite.y += this.speed / 2
    this.sprite.rotation += this.rotationSpeed

    if (this.sprite.y > this.app.screen.height + this.sprite.height) {
      this.destroy()
      this.game.endGameAndMessage('youLose')
    }
  }

  getAsteroidCords () {
    return getBoundCords(this.sprite)
  }

  destroy () {
    destroyEntity(this.sprite, this.app, CONFIG.assets.destroyedAsteroid,
      () => this.sprite = null
    )
  }
}
