import { Assets, Container, Sprite, Text } from 'pixi.js'
import { buttonStyle } from './buttonStyle.js'
import { CONFIG } from '../../app/config'

export class Button {
  constructor (app) {
    this.app = app
    this.initButton()
  }

  initButton () {
    this.container = new Container()

    this.buttonSprite = new Sprite(Assets.get(CONFIG.assets.button))
    this.buttonSprite.anchor.set(0.5)

    this.text = new Text(CONFIG.button.text, buttonStyle)
    this.text.anchor.set(0.5)

    this.container.addChild(this.buttonSprite)
    this.container.addChild(this.text)

    this.container.x = CONFIG.screen.width / 2
    this.container.y = CONFIG.screen.height / 2
    this.container.width = CONFIG.button.width
    this.container.height = CONFIG.button.height
    this.container.interactive = true
    this.container.buttonMode = true

    this.eventListeners()

    this.app.stage.addChild(this.container)
  }

  eventListeners () {
    this.container.on('pointerover', () => this.onPointOver())
    this.container.on('pointerout', () => this.onPointerOut())
    this.container.on('pointerdown', () => this.onPointerDown())
  }

  onPointOver () {
    this.container.cursor = 'pointer'
    this.buttonSprite.alpha = 0.8
  }

  onPointerOut () {
    this.buttonSprite.alpha = 1
  }

  onPointerDown () {
    let scaleSpeed = 0.09

    const onTick = () => {
      this.container.scale.x -= scaleSpeed
      this.container.scale.y -= scaleSpeed

      const checkScale = () => this.container.scale.x <= 0 || this.container.scale.y <= 0

      if (checkScale()) {
        this.app.stage.removeChild(this.container)
        this.container.destroy()
        this.app.ticker.remove(onTick)
      }
    }
    this.app.ticker.add(onTick)
  }
}
