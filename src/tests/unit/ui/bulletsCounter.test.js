import { Application } from 'pixi.js'
import { BulletsCounter } from '../../../ui/bulletsCounter/BulletsCounter.js'
import { expect, it, describe, beforeEach } from '@jest/globals'

describe('BulletsCounter', () => {
  let app
  let bulletsCounter

  beforeEach(() => {
    app = new Application()
    bulletsCounter = new BulletsCounter(app, 10, 10)
  })

  it('should initialize correctly', () => {
    expect(bulletsCounter.bulletsLeft).toBe(10)
    expect(bulletsCounter.bulletsAmount).toBe(10)
    expect(bulletsCounter.text.text).toBe('Bullets: 10 / 10')
  })

  it('should updates the number of remaining bullet', () => {
    bulletsCounter.update(8)
    expect(bulletsCounter.bulletsLeft).toBe(8)
    expect(bulletsCounter.text.text).toBe('Bullets: 8 / 10')
  })

  it('method update should not change bullet amount', () => {
    bulletsCounter.update(5)
    expect(bulletsCounter.bulletsAmount).toBe(10)
  })
})
