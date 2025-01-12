import { Assets } from 'pixi.js'
import background from './images/background.png'
import ship from './images/playerShip1_orange.png'
import asteroid from './images/meteorBrown_big3.png'
import destroyedAsteroid from './images/destroyed meteor.png'
import destroyedShip from './images/playerShip1_damage3.png'
import button from './ui/buttonYellow.png'
import boss from './images/enemyBlack1.png'

export async function assetsLoader () {
  const assets = [
    { name: 'background', src: background },
    { name: 'ship', src: ship },
    { name: 'asteroid', src: asteroid },
    { name: 'destroyed asteroid', src: destroyedAsteroid },
    { name: 'destroyed ship', src: destroyedShip },
    { name: 'button', src: button },
    { name: 'boss', src: boss }
  ]

  try {
    await Assets.load(assets)
  } catch (err) {
    console.error('Error loading assets:', err.message)
  }
}
