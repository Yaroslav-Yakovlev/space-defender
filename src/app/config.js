import background from '../assets/images/black.png'
import ship from '../assets/images/playerShip1_orange.png'
import asteroid from '../assets/images/meteorBrown_big3.png'

export const CONFIG = {
  screen: {
    width: 1280,
    height: 720
  },
  assets: {
    background: background,
    ship: ship,
    asteroid: asteroid
  },
  shipParams: {
    width: 70,
    height: 70,
    speed: 7,
    bulletsAmount: 10,
    maxRotation: 0.2,
    rotationSpeed: 0.05
  },
  bullet: {
    height: 8,
    width: 16,
    color: 0x05bff2,
    speed: 6
  },
  asteroidParams: {
    height: 80,
    width: 80,
    minSpeed: 2,
    maxSpeed: 5,
    rotationSpeed: Math.random() * 0.1 - 0.03,
    getAsteroidSpeed () {
      return Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    }
  }
}
