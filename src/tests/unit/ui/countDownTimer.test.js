import { jest, describe, it, beforeEach, expect } from '@jest/globals'
import { Application } from 'pixi.js'
import { CountDownTimer } from '../../../ui/countDownTimer/CountDownTimer.js'

jest.useFakeTimers()

describe('CountDownTimer', () => {
  let app
  let timer
  let duration = 10
  const onTimeChange = jest.fn()

  beforeEach(() => {
    app = new Application()
    timer = new CountDownTimer(app, duration, onTimeChange)
  })

  it('should initialize correctly', () => {
    expect(timer.remainingTime).toBe(duration)
    expect(timer.timerText.text).toBe(`Time left: ${duration}`)
  })

  it('should start countdown and update text', () => {
    timer.start()
    jest.advanceTimersByTime(1000)

    expect(timer.remainingTime).toBe(duration - 1)
    expect(timer.timerText.text).toBe(`Time left: ${duration--}`)
  })

  it('should have correct text when time is up', () => {
    timer.start()
    jest.advanceTimersByTime(10000)

    expect(timer.remainingTime).toBe(0)
    expect(timer.timerText.text).toBe(`Time's up!`)
  })

  it('should reset countdown', () => {
    timer.start()
    jest.advanceTimersByTime(3000)
    timer.reset()

    expect(timer.remainingTime).toBe(duration)
    expect(timer.timerText.text).toBe(`Time left: ${duration}`)
  })
})
