import {
  jest,
  describe,
  beforeEach,
  it,
  expect,
  afterEach
} from '@jest/globals'
import { Boss } from '../../../entities/Boss.js'
import { Application } from 'pixi.js'
import { CONFIG } from '../../../app/config.js'

jest.mock('../../../ui/bossHP/BossHP.js', () => ({
  BossHP: jest.fn().mockImplementation(() => ({
    updateHP: jest.fn(),
    updatePosition: jest.fn(),
    destroy: jest.fn()
  }))
}))

describe('Boss', () => {
  let app
  let mockGame
  let boss

  beforeEach(() => {
    app = new Application()
    mockGame = {
      endGameAndMessage: jest.fn(),
      bossBullets: []
    }

    boss = new Boss(app, mockGame)
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should initialize with correct properties', () => {
    expect(boss.app).toBe(app)
    expect(boss.game).toBe(mockGame)
    expect(boss.hp).toBe(CONFIG.bossShipParams.hp)
    expect(boss.sprite).toBeDefined()
    expect(boss.phBar).toBeDefined()
  })

  it('should decrease HP and destroy when HP is 0', () => {
    boss.hp = 1
    boss.takeDamage()

    expect(boss.hp).toBe(0)
    expect(boss.phBar.updateHP).toHaveBeenCalledWith(0)
    expect(mockGame.endGameAndMessage).toHaveBeenCalledWith('youWin')
    expect(boss.sprite).toBeNull()
  })

  it('should stop movement and shooting on destroy', () => {
    boss.destroy()

    expect(boss.isMoving).toBeFalsy()
    expect(boss.phBar.destroy).toHaveBeenCalled()
  })

  it('should correctly identify if boss is dead', () => {
    boss.hp = 0
    expect(boss.isDead()).toBeTruthy()

    boss.hp = 1
    expect(boss.isDead()).toBeFalsy()
  })
})
