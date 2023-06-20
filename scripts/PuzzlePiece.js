export class PuzzlePiece {
  /**
   * @param {{
   * ctx: CanvasRenderingContext2D
   * img: CanvasImageSource
   * sx: number
   * sy: number
   * sw: number
   * sh: number
   * dx: number
   * dy: number
   * dw: number
   * dh: number
   * }} params
   */
  constructor({ ctx, pieceIndex, img, sx, sy, sw, sh, dx, dy, dw, dh }) {
    ;(this.ctx = ctx),
      (this.img = img),
      (this.pieceIndex = pieceIndex),
      (this.sx = sx),
      (this.sy = sy),
      (this.sw = sw),
      (this.sh = sh),
      (this.dx = dx),
      (this.dy = dy),
      (this.dw = dw),
      (this.dh = dh),
      (this.originalX = this.dx),
      (this.originalY = this.dy)
  }

  resetPosition = () => {
    this.dx = this.originalX
    this.dy = this.originalY
  }

  setPosition = ({ x, y }) => {
    this.dx = x
    this.dy = y
  }

  draw = () => {
    this.ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh)
    this.ctx.strokeRect(this.dx, this.dy, this.dw, this.dh)
  }
}
