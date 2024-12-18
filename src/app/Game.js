import { Application, Assets, Sprite } from 'pixi.js'
import { CONFIG } from './config.js'
import { assetsLoader } from '../assets/assetsLoader.js'
import { Ship } from '../components/Ship.js'

export class Game {
  constructor () {
    this.app = null
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

}

(async () => {
  const game = new Game()
  await game.init()
})()
