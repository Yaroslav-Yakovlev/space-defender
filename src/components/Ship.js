import { Sprite, Assets } from 'pixi.js'
import { CONFIG } from '../app/config.js'

export class Ship {
  constructor (app) {
    this.app = app
    this.sprite = null
    this.speed = CONFIG.shipParams.speed
    this.moveLeft = false
    this.moveRight = false
  }

  init () {
    const shipTexture = Assets.get(CONFIG.assets.ship)
    this.sprite = new Sprite(shipTexture)

    this.sprite.width = CONFIG.shipParams.width
    this.sprite.height = CONFIG.shipParams.height
    this.sprite.x = (CONFIG.screen.width - this.sprite.width) / 2
    this.sprite.y = CONFIG.screen.height - this.sprite.height - 10

    this.app.stage.addChild(this.sprite)

    this.setupControllers()

    this.app.ticker.add(() => this.update())
  }

  setupControllers () {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft') this.moveLeft = true
        if (event.code === 'ArrowRight') this.moveRight = true
      }
    )

    window.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowLeft') this.moveLeft = false
      if (event.code === 'ArrowRight') this.moveRight = false
    })
  }

  update () {
    if (this.moveLeft) {
      this.sprite.x = Math.max(0, this.sprite.x - this.speed)
    }
    if (this.moveRight) {
      this.sprite.x = Math.min(CONFIG.screen.width - this.sprite.width,
        this.sprite.x + this.speed)
    }
  }
}
