import { Assets } from 'pixi.js'
import background from '../assets/black.png'

export async function assetsLoader () {
  const assets = [
    { name: 'background', src: background }
  ]

  try {
    await Assets.load(assets)
  } catch (err) {
    console.error('Error loading assets:', err.message)
  }
}
