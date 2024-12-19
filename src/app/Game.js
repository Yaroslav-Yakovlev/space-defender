import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../components/Ship.js'
import { Asteroid } from '../components/Asteroid'

export class Game {
  constructor () {
    this.app = null
    this.asteroids = []
    this.asteroidsInterval = 2000
    this.asteroidAmound = 10
  }

  async init () {
    this.app = new Application()

    await this.app.init({
      width: CONFIG.screen.width,
      height: CONFIG.screen.height,
      background: 0x000000
    })

    document.body.appendChild(this.app.canvas)

    await assetsLoader()

    this.loadBackground()
    this.loadShip()
    this.loadAsteroids()
    this.asteroidSpawner()
  }

  loadBackground () {
    const texture = Assets.get(CONFIG.assets.background)
    const background = new Sprite(texture)

    background.width = CONFIG.screen.width
    background.height = CONFIG.screen.height

    this.app.stage.addChild(background)
  }

  loadShip () {
    this.ship = new Ship(this.app)
    this.ship.init()
  }

  loadAsteroids() {
    this.asteroid = new Asteroid(this.app)
    this.asteroid.init()
  }

  asteroidSpawner() {
    setInterval(() => {
      if(this.asteroids.length + 1 < this.asteroidAmound) {
        const asteroid = new Asteroid(this.app)
        asteroid.init()
        this.asteroids.push(asteroid)
      }
    }, this.asteroidsInterval)
  }
}

(async () => {
  const game = new Game()
  await game.init()
})()
