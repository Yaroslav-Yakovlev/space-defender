import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { Application } from 'pixi.js'
import { Bullet } from '../../../entities/Bullet.js'

describe('Bullet', () => {
  let app
  let bullet
  let mockConfig
  const x = 50
  const y = 50

  beforeEach(() => {
    app = new Application()

    mockConfig = {
      width: 10,
      height: 10,
      color: 'test',
      speed: 5
    }

    bullet = new Bullet(app, x, y, mockConfig)
  })

  it('should initialize correctly', () => {
    expect(bullet.app).toBe(app)
    expect(bullet.x).toBe(x)
    expect(bullet.y).toBe(y)
    expect(bullet.graphic).toBeDefined()
    expect(bullet.graphic.rect).
      toHaveBeenCalledWith(0, 0, mockConfig.height, mockConfig.width)
    expect(bullet.graphic.fill).toHaveBeenCalledWith(mockConfig.color)
    expect(bullet.graphic.x).toBe(x)
    expect(bullet.graphic.y).toBe(y)
    expect(app.stage.addChild).toHaveBeenCalledWith(bullet.graphic)
  })

  it('should update position', () => {
    bullet.graphic.y = 100
    bullet.update()
    expect(bullet.graphic.y).toBe(100 - mockConfig.speed)
  })

  it('should get bullet coordinate', () => {
    const bounds = {
      x: 50,
      y: 50,
      width: 16,
      height: 8
    }

    bullet.graphic.getBounds = jest.fn().mockReturnValue(bounds)
    const coords = bullet.getBulletCords()

    expect(coords).toEqual(bounds)
  })

  it('should destroy bullet', () => {
    const graphic = bullet.graphic

    bullet.destroy()

    expect(app.ticker.remove).toHaveBeenCalledWith(bullet.update, bullet)
    expect(app.stage.removeChild).toHaveBeenCalledWith(expect.any(Object))
    expect(graphic.destroy).toHaveBeenCalled()
    expect(bullet.graphic).toBeNull()
  })
})
