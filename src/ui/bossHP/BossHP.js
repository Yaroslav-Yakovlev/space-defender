import { Assets, Container, Sprite } from 'pixi.js'
import { CONFIG } from '../../app/config.js'

export class BossHP {
  constructor (app, boss, maxHP) {
    this.app = app
    this.boss = boss
    this.maxHP = maxHP
    this.currentHP = maxHP
    this.hpIcons = new Container()

    for (let i = 0; i < this.maxHP; i++) {
      const hpIcon = new Sprite(Assets.get(CONFIG.assets.bossHP))
      hpIcon.width = CONFIG.bossHP.width
      hpIcon.height = CONFIG.bossHP.height
      hpIcon.x = i * CONFIG.bossHP.x
      this.hpIcons.addChild(hpIcon)
    }

    this.updatePosition()
    this.app.stage.addChild(this.hpIcons)
  }

  updateHP (newHP) {
    this.currentHP = newHP

    if (this.hpIcons.children.length === 0) return

    this.hpIcons.children.forEach((icon, index) => {
      icon.visible = index < this.currentHP
    })
  }

  updatePosition () {
    if (!this.hpIcons) return

    const sprite = this.boss.sprite
    if (sprite) {
      this.hpIcons.x = sprite.x - this.hpIcons.width / 2
      this.hpIcons.y = sprite.height / 2 - 45
    }
  }

  destroy () {
    if (this.hpIcons) {
      this.hpIcons.destroy({ children: true })
      this.hpIcons = null
    }
  }
}
