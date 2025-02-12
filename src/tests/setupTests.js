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
      },
      init: jest.fn(),
      canvas: {}
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
    Graphics: jest.fn(() => ({
      rect: jest.fn(),
      roundRect: jest.fn(),
      stroke: jest.fn().mockReturnThis(),
      fill: jest.fn(),
      destroy: jest.fn()
    })),
    Sprite: jest.fn(() => ({
      anchor: { set: jest.fn() },
      alpha: 1,
      rotation: 0
    })),
    Text: jest.fn((props) => ({
      text: props.text,
      anchor: { set: jest.fn() }
    })),
    Assets: {
      load: jest.fn(),
      get: jest.fn()
    }
  }
})

global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
