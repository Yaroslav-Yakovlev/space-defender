import ship from '../assets/images/playerShip1_orange.png'
import asteroid from '../assets/images/meteorBrown_big3.png'
import destroyedAsteroid from '../assets/images/destroyed meteor.png'
import destroyedShip from '../assets/images/playerShip1_damage3.png'
import background from '../assets/images/background.png'
import button from '../assets/ui/buttonYellow.png'
import boss from '../assets/images/enemyBlack1.png'
import bossHP from '../assets/images/powerupRed_bolt.png'
import destroyedBossShip from '../assets/images/playerShip3_damage3.png'

export const CONFIG = {
  screen: {
    width: 1280,
    height: 720
  },
  game: {
    asteroidsInterval: 1700,
    bossBulletsInterval: 2000,
    playerBulletsInterval: 500,
    asteroidAmount: 10,
    playerBulletsAmount: 10,
    gameDuration: 60
  },
  resultMessage: {
    border: {
      width: 500,
      height: 150,
      radius: 16,
      borderColor: 0xffffff
    },
    messageText: {
      youWin: 'You Win!',
      youLose: 'You Lose!'
    }
  },
  button: {
    width: 250,
    height: 50,
    startGameText: 'Start Game',
    restartGameText: 'Try Again !',
    nextLevelText: 'Next Level !'
  },
  assets: {
    background: background,
    ship: ship,
    asteroid: asteroid,
    destroyedAsteroid: destroyedAsteroid,
    destroyedShip: destroyedShip,
    button: button,
    boss: boss,
    bossHP: bossHP,
    destroyedBossShip: destroyedBossShip
  },
  PlayerShipParams: {
    width: 70,
    height: 70,
    speed: 6,
    maxRotation: 0.2,
    rotationSpeed: 0.05
  },
  bossShipParams: {
    width: 120,
    height: 120,
    hp: 4
  },
  playerBullet: {
    height: 8,
    width: 16,
    color: 0x05bff2,
    speed: 6
  },
  bossBullet: {
    height: 12,
    width: 20,
    color: 0xFF0000,
    speed: 12
  },
  asteroidParams: {
    height: 80,
    width: 80,
    minSpeed: 4,
    maxSpeed: 6,
    rotationSpeed: Math.random() * 0.1 - 0.03,
    getAsteroidSpeed () {
      return Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    }
  }
}
