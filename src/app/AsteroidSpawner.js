import { CONFIG } from './config.js'
import { Asteroid } from '../entities/Asteroid.js'

export class AsteroidSpawner {
  constructor (game) {
    this.game = game
    this.asteroidsInterval = CONFIG.game.asteroidsInterval
    this.lastAsteroidSpawnTime = 0
  }

  asteroidSpawner () {
    if (this.game.isBossLevel) return

    const currentTime = performance.now()
    const { asteroids, asteroidAmount } = this.game

    if (currentTime - this.lastAsteroidSpawnTime > this.asteroidsInterval) {
      if (asteroids.length < asteroidAmount) {
        asteroids.push(new Asteroid(this.game.app, this.game))
      }
      this.lastAsteroidSpawnTime = currentTime
    }
  }

  update () {
    this.asteroidSpawner()
  }
}
