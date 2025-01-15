import { beforeEach, describe, it, jest, expect } from '@jest/globals'
import { Application } from 'pixi.js'
import { Ship } from '../../../entities/Ship.js'
import { PlayerBullet } from '../../../entities/Bullet.js'
import { CONFIG } from '../../../app/config.js'

jest.useFakeTimers()

describe('Ship', () => {
  let app
  let ship
  let mockGame

  beforeEach(() => {
    app = new Application()
    mockGame = {
      bulletsLeft: 10,
      handleBulletFire: jest.fn()
    }
    ship = new Ship(app, 100, 100, mockGame)
  })

  it('should initialize correctly', () => {
    expect(ship.app).toBe(app)
    expect(ship.sprite).toBeDefined()
    expect(ship.sprite.x).toBe(100)
    expect(ship.sprite.y).toBe(100)
  })

  it('should setup controllers', () => {
    ship.setupControllers()

    const moveLeft = new KeyboardEvent('keydown', { code: 'ArrowLeft' })
    const moveRight = new KeyboardEvent('keydown', { code: 'ArrowRight' })

    ship.keydownHandler(moveLeft)
    expect(ship.moveLeft).toBeTruthy()
    expect(ship.moveRight).toBeFalsy()

    ship.keydownHandler(moveRight)
    expect(ship.moveRight).toBeTruthy()
    expect(ship.moveLeft).toBeFalsy()
  })

  it('should shoot a bullet', () => {
    jest.advanceTimersByTime(CONFIG.game.playerBulletsInterval + 1)
    ship.canShot = true
    ship.shoot()

    expect(mockGame.handleBulletFire).toHaveBeenCalled()
    expect(PlayerBullet).toBeDefined()
  })

  it('should update position and rotation when the ship moving left', () => {
    ship.moveLeft = true

    ship.update()
    expect(ship.sprite.x).toBeLessThan(100)
    expect(ship.sprite.rotation).toBeLessThan(0)
  })

  it('should update position and rotation when the ship moving right', () => {
    ship.moveRight = true

    ship.update()
    expect(ship.sprite.x).toBeGreaterThan(100)
    expect(ship.sprite.rotation).toBeGreaterThan(0)
  })

  it('should destroy the ship',() => {
    ship.destroy()
    jest.advanceTimersByTime(501)
    expect(ship.sprite).toBeNull()
  })

  it('should get ship coordinates', () => {
    const bounds = {
      x: 100,
      y: 100,
      width: 100,
      height: 100
    }

    ship.sprite.getBounds = jest.fn().mockReturnValue(bounds)
    const cords = ship.getShipCords()
    expect(cords).toEqual(bounds)
  })
})
