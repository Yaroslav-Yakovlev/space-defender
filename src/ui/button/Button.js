import { Assets, Container, Sprite, Text } from 'pixi.js'
import { buttonStyle } from './buttonStyle.js'
import { CONFIG } from '../../app/config.js'
import { fadeIn } from '../../app/utils.js'

export class Button {
  constructor (app, resultMessageText, game) {
    this.app = app
    this.game = game
    this.resultMessageText = resultMessageText
    this.isDestroyed = false
    this.initButton()
  }

  isRestartOrNextLevelButton () {
    return (
      this.resultMessageText === CONFIG.resultMessage.messageText.youLose ||
      this.resultMessageText === CONFIG.resultMessage.messageText.youWin
    )
  }

  initButton () {
    this.container = new Container()
    this.container.alpha = 0
    this.container.addChild(this.createButtonSprite())
    this.container.addChild(this.createButtonText())

    this.container.x = CONFIG.screen.width / 2
    this.container.y = this.isRestartOrNextLevelButton()
      ? CONFIG.screen.height / 2 + 200
      : CONFIG.screen.height / 2
    this.container.width = CONFIG.button.width
    this.container.height = CONFIG.button.height
    this.container.interactive = true
    this.container.buttonMode = true

    this.eventListeners()
    this.addKeyboardListener()

    this.app.stage.addChild(this.container)

    fadeIn(this.app, this.container)
  }

  createButtonSprite () {
    this.buttonSprite = new Sprite(Assets.get(CONFIG.assets.button))
    this.buttonSprite.anchor.set(0.5)

    return this.buttonSprite
  }

  createButtonText () {
    const textMap = {
      [CONFIG.button.startGameText]: CONFIG.button.startGameText,
      [CONFIG.resultMessage.messageText.youLose]: CONFIG.button.restartGameText,
      [CONFIG.resultMessage.messageText.youWin]: CONFIG.button.nextLevelText
    }

    const textContent = textMap[this.resultMessageText] ||
      this.resultMessageText

    const buttonText = new Text({ text: textContent, style: buttonStyle })
    buttonText.anchor.set(0.5)

    return buttonText
  }

  eventListeners () {
    this.container.on('pointerover', () => this.onPointerOver())
    this.container.on('pointerout', () => this.onPointerOut())
    this.container.on('pointerdown', () => this.onPointerDown())
  }

  addKeyboardListener () {
    this.keyHandler = (event) => {
      if (event.code === 'Enter') this.onPointerDown()
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

    this.animationButton(() => {
      this.removeContainer()
      this.handleGameAction()
    })
  }

  animationButton (callback) {
    if (!this.container) return
    this.app.ticker.start()

    let scaleSpeed = 0.09
    this.onTick = () => {
      this.container.scale.x -= scaleSpeed
      this.container.scale.y -= scaleSpeed

      const checkScale = () => this.container.scale.x <= 0 ||
        this.container.scale.y <= 0

      if (checkScale()) {
        callback()
      }
    }
    this.app.ticker.add(this.onTick)
  }

  handleGameAction () {
    if (this.resultMessageText === CONFIG.resultMessage.messageText.youLose) {
      if (this.game.isBossLevel) {
        this.game.restartBossLevel()
      } else {
        this.game.resetGame()
      }
    } else if (this.resultMessageText ===
      CONFIG.resultMessage.messageText.youWin) {
      this.game.levelWithBoss()
    } else {
      this.game.startGame()
    }
  }

  removeContainer () {
    this.app.stage.removeChild(this.container)
    this.container.destroy({ children: true })
    this.app.ticker.remove(this.onTick)
    this.removeKeyboardListener()
    this.container.removeAllListeners()
    this.isDestroyed = true
  }
}
