import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach
} from '@jest/globals'
import { Application } from 'pixi.js'
import { BossHP } from '../../../ui/bossHP/BossHP.js'

describe('BossHP', () => {
  let app
  let boss
  let bossHP

  beforeEach(() => {
    app = new Application()
    boss = {
      sprite: {
        x: 100,
        height: 50
      }
    }
    bossHP = new BossHP(app, boss, 4)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct properties ', () => {
    expect(bossHP.app).toBe(app)
    expect(bossHP.boss).toBe(boss)
    expect(bossHP.maxHP).toBe(4)
    expect(bossHP.currentHP).toBe(4)
    expect(bossHP.hpIcons.addChild).toHaveBeenCalledTimes(4)
    expect(app.stage.addChild).toHaveBeenCalledWith(bossHP.hpIcons)
  })

  it('should update position hpIcons based on the boss', () => {
    bossHP.updatePosition()
    expect(bossHP.hpIcons.x).toBe(100 - bossHP.hpIcons.width / 2)
    expect(bossHP.hpIcons.y).toBe(boss.sprite.height / 2 - 45)
  })

  it('should destroy hpIcons container', () => {
    bossHP.destroy()
    expect(bossHP.hpIcons).toBeNull()
  })
})
