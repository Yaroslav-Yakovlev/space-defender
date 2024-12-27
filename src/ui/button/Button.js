import { Assets, Container, Sprite, Text } from 'pixi.js'
import { buttonStyle } from './buttonStyle.js'
import { CONFIG } from '../../app/config.js'

export class Button {
  constructor (app) {
    this.app = app
    this.initButton()
    this.isDestroyed = false
  }

  initButton () {
    this.container = new Container()

    this.container.addChild(this.createButtonSprite())
    this.container.addChild(this.createButtonText())

    this.container.x = CONFIG.screen.width / 2
    this.container.y = CONFIG.screen.height / 2
    this.container.width = CONFIG.button.width
    this.container.height = CONFIG.button.height
    this.container.interactive = true
    this.container.buttonMode = true

    this.eventListeners()
    this.addKeyboardListener()

    this.app.stage.addChild(this.container)
  }

  createButtonSprite() {
    this.buttonSprite = new Sprite(Assets.get(CONFIG.assets.button))
    this.buttonSprite.anchor.set(0.5)

    return this.buttonSprite
  }

  createButtonText() {
    const text = new Text(CONFIG.button.text, buttonStyle)
    text.anchor.set(0.5)

    return text
  }

  eventListeners () {
    this.container.on('pointerover', () => this.onPointerOver())
    this.container.on('pointerout', () => this.onPointerOut())
    this.container.on('pointerdown', () => this.onPointerDown())
  }

  addKeyboardListener () {
    this.keyHandler = (event) => {
      if (event.key === 'Enter') this.onPointerDown()
    }
    window.addEventListener('keydown', this.keyHandler)
  }

  removeKeyboardListener () {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler)
    }
  }

  onPointerOver () {
    this.container.cursor = 'pointer'
    this.buttonSprite.alpha = 0.8
  }

  onPointerOut () {
    this.buttonSprite.alpha = 1
  }

  onPointerDown () {
    if (this.isDestroyed) return
    let scaleSpeed = 0.09

    const onTick = () => {
      this.container.scale.x -= scaleSpeed
      this.container.scale.y -= scaleSpeed

      const checkScale = () =>
        this.container.scale.x <= 0 || this.container.scale.y <= 0

      if (checkScale()) {
        this.app.stage.removeChild(this.container)
        this.container.destroy({ children: true })
        this.app.ticker.remove(onTick)
        this.removeKeyboardListener()
        this.container.removeAllListeners()
        this.isDestroyed = true
      }
    }
    this.app.ticker.add(onTick)
  }
}
