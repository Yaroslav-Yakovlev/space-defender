import { Assets, Container, Sprite } from 'pixi.js'
import { CONFIG } from '../../app/config.js'

export class BossHP {
  constructor(app, boss, maxHP = 4) {
    this.app = app
    this.boss = boss
    this.maxHP = maxHP
    this.currentHP = maxHP
    this.hpIcons = new Container()

    for (let i = 0; i < this.maxHP; i++) {
      const hpIcon = new Sprite(Assets.get(CONFIG.assets.bossHP))
      hpIcon.width = 20
      hpIcon.height = 20
      hpIcon.x = i * 20
      this.hpIcons.addChild(hpIcon)
    }

    this.hpIcons.x = this.boss.sprite.x - this.hpIcons.width / 2
    this.hpIcons.y = this.boss.sprite.y - 85

    this.app.stage.addChild(this.hpIcons)
  }

  updateHP(newHP) {
    this.currentHP = newHP
    this.hpIcons.children.forEach((icon, index) => {
      icon.visible = index < this.currentHP
    })

    this.hpIcons.x = this.boss.sprite.x - this.hpIcons.width / 2
    this.hpIcons.y = this.boss.sprite.y - 40
  }

  destroy () {
    this.hpIcons.destroy({ children: true })
  }
}
