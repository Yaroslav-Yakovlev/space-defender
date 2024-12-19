import { Assets } from 'pixi.js'
import background from './images/black.png'
import ship from './images/playerShip1_orange.png'
import asteroid from './images/meteorBrown_big3.png'

export async function assetsLoader () {
  const assets = [
    { name: 'background', src: background },
    { name: 'ship', src: ship },
    { name: 'asteroid', src: asteroid }
  ]

  try {
    await Assets.load(assets)
  } catch (err) {
    console.error('Error loading assets:', err.message)
  }
}
