import background from '../assets/images/black.png'
import ship from '../assets/images/playerShip1_orange.png'

export const CONFIG = {
  screen: {
    width: 1280,
    height: 720
  },
  assets: {
    background: background,
    ship: ship
  },
  shipParams: {
    width: 70,
    height: 70,
    speed: 10,
    bulletsAmount: 10
  },
  bullet: {
    height: 8,
    width: 16,
    color: 0x05bff2,
    speed: 10
  }
}
