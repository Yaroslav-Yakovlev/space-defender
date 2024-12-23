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
