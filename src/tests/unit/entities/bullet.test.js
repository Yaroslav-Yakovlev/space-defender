import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { Application } from 'pixi.js'
import { Bullet } from '../../../entities/Bullet.js'
import { CONFIG } from '../../../app/config.js'

describe('Bullet', () => {
  let app
  let bullet
  const x = 50
  const y = 50

  beforeEach(() => {
    app = new Application()
    bullet = new Bullet(app, x, y)
    bullet.graphic.height = CONFIG.playerBullet.height
  })

  it('should initialize correctly', () => {
    expect(bullet.app).toBe(app)
    expect(bullet.x).toBe(x)
    expect(bullet.y).toBe(y)
    expect(bullet.graphic).toBeDefined()
    expect(bullet.graphic.rect).
      toHaveBeenCalledWith(0, 0, CONFIG.playerBullet.height, CONFIG.playerBullet.width)
    expect(bullet.graphic.fill).toHaveBeenCalledWith(CONFIG.playerBullet.color)
    expect(bullet.graphic.x).toBe(x)
    expect(bullet.graphic.y).toBe(y)
    expect(app.stage.addChild).toHaveBeenCalledWith(bullet.graphic)
  })

  it('should update position and destroy when out of screen', () => {
    bullet.update()
    expect(bullet.graphic.y).toBe(y - bullet.speed)

    bullet.graphic.y = -bullet.graphic.height

    bullet.update()
    expect(bullet.graphic).toBeNull()
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
