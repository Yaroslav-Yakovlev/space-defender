export class CollisionManager {
  constructor (game) {
    this.game = game
  }

  isColliding (sprite1, sprite2) {
    if (!sprite1 || !sprite2) return false

    return (
      sprite1.x < sprite2.x + sprite2.width &&
      sprite1.x + sprite2.width > sprite2.x &&
      sprite1.y < sprite2.y + sprite2.height &&
      sprite1.y + sprite1.height > sprite2.y
    )
  }

  checkPlayerBulletsAsteroidsCollisions () {
    const { playerBullets, asteroids } = this.game
    if (!playerBullets || !asteroids) return

    playerBullets.forEach((bullet) => {
      asteroids.forEach((asteroid) => {
        if (this.isColliding(bullet.getBulletCords(),
          asteroid.getAsteroidCords())) {
          this.game.destroyedAsteroids++

          bullet.destroy()
          asteroid.destroy()
        }
      })

      if (this.game.destroyedAsteroids === this.game.asteroidAmound) {
        this.game.endGameAndMessage('youWin')
      }
    })
  }

  checkPlayerShipAsteroidsCollision () {
    const { playerShip, asteroids } = this.game

    asteroids.forEach((asteroid) => {
      if (this.isColliding(playerShip.getShipCords(),
        asteroid.getAsteroidCords())) {
        playerShip.destroy()

        this.game.endGameAndMessage('youLose')
      }
    })
  }

  checkPlayerBulletsBossCollisions () {
    const { playerBullets, boss } = this.game

    if (!boss) return

    playerBullets.forEach((bullet) => {
      if (this.isColliding(bullet.getBulletCords(), boss.getBossCoords())) {
        bullet.destroy()
        boss.takeDamage()
      }
    })
  }

  checkPlayerBulletsBossBulletsCollisions () {
    const { playerBullets, bossBullets } = this.game

    playerBullets.forEach((playerBullet) => {
      bossBullets.forEach((bossBullet) => {
        if (this.isColliding(playerBullet.getBulletCords(),
          bossBullet.getBulletCords())) {
          bossBullet.destroy()
          playerBullet.destroy()
        }
      })

      if (this.game.playerBulletsLeft === 0 && this.game.boss) {
        this.game.endGameAndMessage('youLose')
        this.game.boss.stopShooting()
      }
    })
  }

  checkBossBulletsPlayerShipCollision () {
    const { bossBullets, playerShip, boss } = this.game

    bossBullets.forEach((bullet) => {
      if (this.isColliding(bullet.getBulletCords(),
        playerShip.getShipCords())) {
        bullet.destroy()
        playerShip.destroy()
        boss.stopShooting()

        this.game.endGameAndMessage('youLose')
      }
    })
  }

  update () {
    this.checkPlayerBulletsAsteroidsCollisions()
    this.checkPlayerShipAsteroidsCollision()
    this.checkPlayerBulletsBossCollisions()
    this.checkPlayerBulletsBossBulletsCollisions()
    this.checkBossBulletsPlayerShipCollision()
  }
}
