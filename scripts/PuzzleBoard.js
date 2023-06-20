import { PuzzlePiece } from '/scripts/PuzzlePiece.js'
import { CanvasManager } from '/scripts/CanvasManager.js'

/**
 * PuzzleBoard
 * @param {{
 * ctx: CanvasRenderingContext2D
 * canvas: HTMLCanvasElement
 * img: HTMLImageElement
 * xPieces: number
 * yPieces: number
 * }} params
 */
export class PuzzleBoard extends CanvasManager {
  constructor({ img, canvas, ctx, xPieces, yPieces }) {
    super({ img, canvas, ctx })
    /** @type {PuzzlePiece[]} */
    this.pieces = []
    /** @type {number[]} */
    this.pieceOrder = []
    /** @type {number[]} */
    this.solvedPieces = []
    this.xPieces = xPieces
    this.yPieces = yPieces
  }

  createPuzzlePieces = (xPieces, yPieces) => {
    this.pieces = []
    this.pieceOrder = []
    this.solvedPieces = []
    for (let i = 0; i < xPieces; i++) {
      for (let j = 0; j < yPieces; j++) {
        this.pieces.push(
          new PuzzlePiece({
            ctx: this.ctx,
            img: this.img,
            pieceIndex: j + i * yPieces,
            ...this.getScaledImgSizes(xPieces, yPieces, i, j),
          })
        )
        this.pieceOrder.push(this.pieces.length - 1)
      }
    }
  }

  drawBoard = () => {
    this.pieceOrder.forEach((index) => this.pieces[index].draw())
  }

  resetBoard = () => {
    this.pieces.forEach((piece) => piece.resetPosition())
    this.pieceOrder = [...Array(this.pieces.length).keys()]
  }

  shuffleBoard = () => {
    const { dw, dh } = this.getScaledImgSizes(this.xPieces, this.yPieces)
    this.pieces.forEach((piece) =>
      piece.setPosition({
        x: Math.random() * (this.canvas.width - dw),
        y: Math.random() * (this.canvas.height - dh),
      })
    )
  }
}
