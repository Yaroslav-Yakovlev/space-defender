import { Assets, Sprite } from 'pixi.js'
import { CONFIG } from '../app/config.js'
import { destroyEntity, getBoundCords } from '../app/utils.js'

export class Asteroid {
  constructor (app, game) {
    this.app = app
    this.game = game
    this.rotationSpeed = CONFIG.asteroidParams.rotationSpeed
    this.speed = CONFIG.asteroidParams.getAsteroidSpeed()

    this.sprite = new Sprite(Assets.get(CONFIG.assets.asteroid))
    this.sprite.width = CONFIG.asteroidParams.width
    this.sprite.height = CONFIG.asteroidParams.height
    this.sprite.x = Math.random() * (CONFIG.screen.width - this.sprite.width) +
      this.sprite.width / 2
    this.sprite.y = -this.sprite.height
    this.sprite.anchor.set(0.5)

    this.app.stage.addChild(this.sprite)
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
