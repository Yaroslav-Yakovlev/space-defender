import { jest } from '@jest/globals'
import 'jest-canvas-mock'

jest.mock('pixi.js', () => {
  const originalModule = jest.requireActual('pixi.js')

  return {
    __esModule: true,
    ...originalModule,
    Application: jest.fn(() => ({
      stage: {
        addChild: jest.fn(),
        removeChild: jest.fn()
      },
      ticker: {
        start: jest.fn(),
        add: jest.fn(),
        remove: jest.fn()
      },
      screen: {
        width: 1280,
        height: 720
      }
    })),
    Container: jest.fn(() => ({
      addChild: jest.fn(),
      removeChild: jest.fn(),
      destroy: jest.fn(),
      interactive: true,
      buttonMode: true,
      cursor: 'default',
      on: jest.fn()
    })),
    Sprite: jest.fn(() => ({
      anchor: { set: jest.fn() },
      alpha: 1
    })),
    Text: jest.fn((text) => ({
      text: text,
      anchor: { set: jest.fn() }
    })),
    Assets: {
      get: jest.fn()
    }
  }
})

global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

global.document = {
  createElement: jest.fn().mockReturnValue({
    getContext: jest.fn().mockReturnValue({
      fillRect: jest.fn(),
      setTransform: jest.fn(),
      fillText: jest.fn(),
      stroke: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      fill: jest.fn(),
      transform: jest.fn(),
      rect: jest.fn()
    })
  })
}

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
