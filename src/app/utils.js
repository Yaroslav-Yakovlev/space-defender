import { Assets, Sprite } from 'pixi.js'

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

export function fadeIn (app, target, speed = 0.06) {
  if (!target) return

  const ticker = app.ticker.add(() => {
    if (target.alpha < 1) {
      target.alpha += speed
    } else {
      target.alpha = 1
      app.ticker.remove(ticker)
    }
  })
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

export function createSprite ({
  textureKey,
  width,
  height,
  x,
  y,
  anchorSet = 0.5,
  app = null
}) {
  const texture = Assets.get(textureKey)
  const sprite = new Sprite(texture)

  sprite.x = x
  sprite.y = y
  sprite.width = width
  sprite.height = height
  sprite.anchor.set(anchorSet)

  if (app) {
    app.stage.addChild(sprite)
  }

  return sprite
}
