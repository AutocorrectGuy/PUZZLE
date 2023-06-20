export class CanvasManager {
  constructor({ img, canvas, ctx }) {
    /** @type {HTMLImageElement} */
    this.img = img
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx
  }

  getScaledImgSizes = (xPieces = 1, yPieces = 1, i = 0, j = 0) => {
    // s = scale
    let sX = this.img.width / this.canvas.width
    let sY = this.img.height / this.canvas.height
    if (sX > sY) {
      sY = (1 / sX) * sY
      sX = 1
    } else if (sX < sY) {
      sX = (1 / sY) * sX
      sY = 1
    } else {
      sX = 1
      sY = 1
    }

    // Some scaling stuff
    const uSize = this.img.width / xPieces
    const vSize = this.img.height / yPieces
    const boardWidth = this.canvas.width * sX
    const boardHeight = this.canvas.height * sY
    const imgSize = {}
    imgSize.x = boardWidth / xPieces
    imgSize.y = boardHeight / yPieces

    return {
      sx: i * uSize,
      sy: j * vSize,
      sw: uSize,
      sh: vSize,
      dx: i * imgSize.x + (this.canvas.width - boardWidth) / 2,
      dy: j * imgSize.y,
      dw: imgSize.x,
      dh: imgSize.y,
    }
  }
}
