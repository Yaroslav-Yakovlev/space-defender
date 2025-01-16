import { Container, Graphics, Text } from 'pixi.js'
import { resultMessageStyle } from './resultMessageStyle.js'
import { CONFIG } from '../../app/config.js'
import { fadeIn } from '../../app/utils.js'

export class ResultMessage {
  constructor (app, messageText) {
    this.app = app
    this.messageText = messageText

    this.createContainer()
    fadeIn(this.app, this.container)
  }

  createContainer () {
    this.container = new Container()
    this.container.alpha = 0

    this.container.addChild(this.createBorder())
    this.container.addChild(this.createText())

    this.container.x = CONFIG.screen.width / 2
    this.container.y = CONFIG.screen.height / 2

    this.app.stage.addChild(this.container)
  }

  createBorder () {
    const borderWidth = CONFIG.resultMessage.border.width
    const borderHeight = CONFIG.resultMessage.border.height
    const borderRadius = CONFIG.resultMessage.border.radius

    const graphic = new Graphics()
    graphic.roundRect(
      -borderWidth / 2,
      (borderHeight / 2) - borderHeight,
      borderWidth,
      borderHeight,
      borderRadius
    )
    graphic.stroke({ width: 4, color: CONFIG.resultMessage.border.borderColor })

    return graphic
  }

  createText () {
    const text = new Text({
      text: this.messageText,
      style: resultMessageStyle
    })
    text.anchor.set(0.5)

    return text
  }
}
