import { Text } from 'pixi.js'
import { bulletsCounterStyle } from './bulletsCounterStyle.js'

export class BulletsCounter {
  constructor (app, bulletsLeft, bulletsAmount) {
    this.app = app
    this.bulletsLeft = bulletsLeft
    this.bulletsAmount = bulletsAmount

    this.text = new Text({
      text: `Bullets: ${this.bulletsLeft} / ${this.bulletsAmount}`,
      style: bulletsCounterStyle
    })

    this.text.x = 20
    this.text.y = 20
    this.app.stage.addChild(this.text)
  }

  update (bulletsLeft) {
    this.bulletsLeft = bulletsLeft
    this.text.text = `Bullets: ${this.bulletsLeft} / ${this.bulletsAmount}`
  }
}

