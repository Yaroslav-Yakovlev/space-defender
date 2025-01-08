import { Container, Graphics, Text } from 'pixi.js'
import { resultMessageStyle } from './resultMessageStyle.js'
import { CONFIG } from '../../app/config.js'

export class ResultMessage {
  constructor (app, messageText) {
    this.app = app
    this.messageText = messageText

    this.initText()
  }

  initText () {
    this.container = new Container()

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

    return new Graphics().roundRect(
      -borderWidth / 2,
      (borderHeight / 2) - borderHeight,
      borderWidth,
      borderHeight,
      borderRadius
    ).stroke({ width: 4, color: CONFIG.resultMessage.border.borderColor })
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
