import { CanvasManager } from '/scripts/CanvasManager.js'

export class BackgroundBoard extends CanvasManager {
  constructor({ img, canvas, ctx }) {
    super({ img, canvas, ctx })
    this.pos = Object.values(this.getScaledImgSizes())
  }
  draw = () => {
    this.ctx.drawImage(this.img, ...this.pos)
  }
}
