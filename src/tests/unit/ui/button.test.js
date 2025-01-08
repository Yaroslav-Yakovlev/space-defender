import { beforeEach, describe, it, jest, expect } from '@jest/globals'
import { Application } from 'pixi.js'
import { Button } from '../../../ui/button/Button.js'

describe('Button', () => {
  let app
  let mockGame

  beforeEach(() => {
    app = new Application()
    mockGame = {
      startGame: jest.fn(),
      resetGame: jest.fn()
    }
  })

  it('should initialize correctly', () => {
    const button = new Button(app, 'Start Game', mockGame)

    expect(button.resultMessageText).toBe('Start Game')
    expect(button.isDestroyed).toBeFalsy()
    expect(button.container.addChild).toHaveBeenCalledTimes(2)
  })

  it('should restart game on click when player lose', () => {
    const button = new Button(app, 'You Lose!', mockGame)

    button.handleGameAction()
    expect(mockGame.resetGame).toHaveBeenCalled()
  })

  it('should have correct text button when player lose', () => {
    const button = new Button(app, 'You Lose!', mockGame)
    const buttonText = button.createButtonText().text.text

    expect(buttonText).toBe('Try Again !')
  })

  it('should have correct text button when player win', () => {
    const button = new Button(app, 'You Win!', mockGame)
    const buttonText = button.createButtonText().text.text

    expect(buttonText).toBe('Next Level !')
  })
})
