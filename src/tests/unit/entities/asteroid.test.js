import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { Application } from 'pixi.js'
import { Asteroid } from '../../../entities/Asteroid.js'
import { CONFIG } from '../../../app/config.js'

jest.useFakeTimers()

describe('Asteroid', () => {
  let app
  let asteroid
  let mockGame

  beforeEach(() => {
    app = new Application()
    mockGame = {
      gameResult: '',
      showGameResult: jest.fn()
    }

    asteroid = new Asteroid(app, mockGame)
  })

  it('should initialize correctly', () => {
    expect(asteroid.app).toBe(app)
    expect(asteroid.sprite).toBeDefined()
    expect(asteroid.sprite.width).toBe(CONFIG.asteroidParams.width)
    expect(asteroid.sprite.height).toBe(CONFIG.asteroidParams.height)
    expect(asteroid.sprite.anchor.set).toHaveBeenCalledWith(0.5)
    expect(app.stage.addChild).toHaveBeenCalledWith(asteroid.sprite)
  })

  it('should update position and rotation', () => {
    asteroid.update()

    expect(asteroid.sprite.y).toBeGreaterThan(-asteroid.sprite.height)
    expect(asteroid.sprite.rotation).toBeGreaterThan(0)
  })

  it('should destroy asteroid when out of screen', () => {
    asteroid.sprite.y = app.screen.height + asteroid.sprite.height + 1

    asteroid.update()
    jest.advanceTimersByTime(501)

    expect(asteroid.sprite).toBeNull()
    expect(mockGame.gameResult).toBe('youLose')
    expect(mockGame.showGameResult).toHaveBeenCalled()
  })

  it('should get asteroid coordinate', () => {
    const bounds = {
      x: 100,
      y: 100,
      width: 100,
      height: 100
    }

    asteroid.sprite.getBounds = jest.fn().mockReturnValue(bounds)
    const cords = asteroid.getAsteroidCords()
    expect(cords).toEqual(bounds)
  })
})
