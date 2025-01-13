import { Assets } from 'pixi.js'

export function fadeOutAndRemoveSprite (sprite, app) {
  if (!sprite) return
  let fadeSpeed = 0.02

  const fadeTicker = () => {
    sprite.alpha -= fadeSpeed

    if (sprite.alpha <= 0) {
      app.stage.removeChild(sprite)
      sprite.destroy()
      app.ticker.remove(fadeOutAndRemoveSprite)
    }
  }

  app.ticker.add(fadeTicker)
}

export function getBoundCords (sprite) {
  if (!sprite) return null
  const bounds = sprite.getBounds()

  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  }
}

export function destroyEntity (sprite, app, destroyedTexture, onRemove) {
  if (!sprite) return

  sprite.texture = Assets.get(destroyedTexture)
  fadeOutAndRemoveSprite(sprite, app)

  setTimeout(() => {
    if (onRemove) onRemove()
  }, 500)
}
