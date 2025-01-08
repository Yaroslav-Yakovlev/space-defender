import { describe, expect, it } from '@jest/globals'
import { Application } from 'pixi.js'
import { ResultMessage } from '../../../ui/resultMessage/ResultMessage.js'

describe('ResultMessage', () => {
  const app = new Application()

  it('should create text correctly', () => {
    const resultMessage = new ResultMessage(app, 'You Win!')
    const text = resultMessage.createText()
    expect(text.text).toBe('You Win!')
  })
})
