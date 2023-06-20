import { PuzzleBoard } from '/scripts/PuzzleBoard.js'
import { BackgroundBoard } from '/scripts/BackgroundBoard.js'
import { CanvasManager } from '/scripts/CanvasManager.js'
import { PuzzlePiece } from '/scripts/PuzzlePiece.js'

export class Game extends CanvasManager {
  constructor(canvas, ctx, img) {
    super({ img, canvas, ctx })

    // game state
    this.gameStarted = false
    this.points = 0

    // Delta time setup
    this.currTime = performance.now()
    this.lastTime = performance.now()
    this.dt = 0
    this.FPS = 60
    this.FRAME_DURATION = 1000 / this.FPS

    // Main board setup
    /** @type {BackgroundBoard} */
    this.backgroundBoard = new BackgroundBoard({ img, canvas, ctx })
    /** @type {number} */
    this.xPieces = document.getElementById('count-x').value
    /** @type {number} */
    this.yPieces = document.getElementById('count-y').value
    /** @type {PuzzleBoard} */
    this.puzzleBoard = new PuzzleBoard({ img, canvas, ctx, xPieces: this.xPieces, yPieces: this.yPieces })

    // Piece controlling mouse listeners
    /** @type {PuzzlePiece | null} */
    this.selectedPiece = null
    this.mouseDragOffset = { x: null, y: null }
    this.pieceDropOffsetPx = 20

    // toolbar variables
    this.isHoldingTipsBtn = false

    // toolbar buttons
    this.resignBtn = document.getElementById('resign')
    this.startGameBtn = document.getElementById('start-game')
    this.countXBtn = document.getElementById('count-x')
    this.countYBtn = document.getElementById('count-y')
    this.tipsBtn = document.getElementById('tips')
    this.pointsDiv = document.getElementById('points')

    // new game screen
    this.newGameText = 'Puzles spēle'
    this.newGameTextPos = {
      x: this.canvas.width / 2 - this.ctx.measureText(this.newGameText).width / 2,
      y: this.canvas.height / 2,
    }
    this.initEventListeners()
  }

  initEventListeners = () => {
    // Pieces controlling ev listeners
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e))
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e))
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp())

    // Toolbar button ev listener initialisation
    this.resignBtn.addEventListener('click', () => this.handleResignGame())
    this.startGameBtn.addEventListener('click', () => this.handleStartGame())
    this.countXBtn.addEventListener('input', (e) => {
      this.xPieces = e.target.value
      this.initBoard()
    })
    this.countYBtn.addEventListener('input', (e) => {
      this.yPieces = e.target.value
      this.initBoard()
    })
    this.tipsBtn.addEventListener('mousedown', () => this.handleTipsDown())
  }

  initBoard = () => {
    this.puzzleBoard.resetBoard()
    this.puzzleBoard.createPuzzlePieces(this.xPieces, this.yPieces)
  }

  resetBoard = () => {
    this.puzzleBoard.createPuzzlePieces(this.xPieces, this.yPieces)
    this.puzzleBoard.shuffleBoard()
  }

  pieceProperlyPlaced = () =>
    this.selectedPiece.dx < this.selectedPiece.originalX + this.pieceDropOffsetPx &&
    this.selectedPiece.dx > this.selectedPiece.originalX - this.pieceDropOffsetPx &&
    this.selectedPiece.dy < this.selectedPiece.originalY + this.pieceDropOffsetPx &&
    this.selectedPiece.dy > this.selectedPiece.originalY - this.pieceDropOffsetPx

  /**@param {MouseEvent} e*/
  handleMouseDown = (e) => {
    if (!this.gameStarted) return
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // reversed order ensures that we click on the topmost piece first
    for (let i = this.puzzleBoard.pieceOrder.length - 1; i >= 0; i--) {
      const piece = this.puzzleBoard.pieces[i]

      if (x >= piece.dx && x <= piece.dx + piece.dw && y >= piece.dy && y <= piece.dy + piece.dh) {
        // Prevent selecting a piece if it's placed correctly
        if (this.puzzleBoard.solvedPieces.includes(piece.pieceIndex)) {
          continue
        }

        this.selectedPiece = piece
        // delete old index of piece. Search it before removing
        this.puzzleBoard.pieceOrder.splice(this.puzzleBoard.pieceOrder.indexOf(i), 1)
        // push new piece index
        this.puzzleBoard.pieceOrder.push(i)
        this.mouseDragOffset = { x: x - this.selectedPiece.dx, y: y - this.selectedPiece.dy }
        break
      }
    }
  }

  /**@param {MouseEvent} e*/
  handleMouseMove = (e) => {
    if (!this.gameStarted) return
    if (!this.selectedPiece) return

    // get global mouse position, subtract left offset of canvas element
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // update the piece position
    this.selectedPiece.dx = x - this.mouseDragOffset.x
    this.selectedPiece.dy = y - this.mouseDragOffset.y

    if (this.pieceProperlyPlaced()) {
      // drop the piece in position (while still dragging)
      this.selectedPiece.dx = this.selectedPiece.originalX
      this.selectedPiece.dy = this.selectedPiece.originalY
    }
  }

  /**@param {MouseEvent} e*/
  handleMouseUp = () => {
    if (!this.gameStarted) return
    if (!this.selectedPiece) return

    /** @type {PuzzlePiece} */
    const piece = this.selectedPiece
    const correct = piece.dx === piece.originalX && piece.dy === piece.originalY

    if (correct) {
      if (!this.puzzleBoard.solvedPieces.includes(piece.pieceIndex)) {
        this.puzzleBoard.solvedPieces.push(piece.pieceIndex)
        this.puzzleBoard.pieceOrder.splice(this.puzzleBoard.pieceOrder.indexOf(piece.pieceIndex), 1)
        this.puzzleBoard.pieceOrder.unshift(piece.pieceIndex)
        this.pointsDiv.innerText = ++this.points
      }
    } else {
      const indexToDelete = this.puzzleBoard.solvedPieces.indexOf(piece.pieceIndex)
      if (indexToDelete !== -1) {
        this.puzzleBoard.solvedPieces.splice(indexToDelete, 1)
      }
    }

    // win state
    if (this.puzzleBoard.solvedPieces.length === this.puzzleBoard.pieceOrder.length) {
      this.gameStarted = false
      this.resignBtn.style.display = 'none'
      this.pointsDiv.parentNode.style.display = 'none'
      this.countXBtn.parentNode.style.display = 'flex'
      this.countYBtn.parentNode.style.display = 'flex'
      setTimeout(() => {
        const points = this.points.toString()
        alert(
          `Supper! Jūs salikāt puzli un ieguvāt ${this.points} punktu${points[points.length - 1] === '1' ? '' : 's'}!`
        )
      }, 100)
    }
    this.selectedPiece = null
  }

  gameLoop = () => {
    this.currTime = performance.now()
    this.dt += this.currTime - this.lastTime
    this.lastTime = this.currTime
    if (this.dt >= this.FRAME_DURATION) {
      this.dt -= this.FRAME_DURATION
      this.ctx.fillStyle = '#0C0C20'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      
      if (this.isHoldingTipsBtn) {
        this.ctx.globalAlpha = 1
        this.backgroundBoard.draw()
      } else {
        this.ctx.globalAlpha = 0.1
        this.backgroundBoard.draw()
        this.ctx.globalAlpha = 1
        this.puzzleBoard.drawBoard()
      }
      if (!this.gameStarted) {
        this.ctx.fillStyle = 'rgba(0,0,0, 0.8)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillText(this.newGameText, this.newGameTextPos.x, this.newGameTextPos.y)
      }
    }
    requestAnimationFrame(() => this.gameLoop())
  }

  handleStartGame = () => {
    this.resetBoard()
    this.countXBtn.parentNode.style.display = 'none'
    this.countYBtn.parentNode.style.display = 'none'
    this.resignBtn.style.display = 'block'
    this.tipsBtn.style.display = 'block'
    this.pointsDiv.parentNode.style.display = 'flex'
    this.gameStarted = true
    this.points = 0
  }

  handleResignGame = () => {
    this.puzzleBoard.resetBoard()
    this.countXBtn.parentNode.style.display = 'flex'
    this.countYBtn.parentNode.style.display = 'flex'
    this.resignBtn.style.display = 'none'
    this.tipsBtn.style.display = 'none'
    this.pointsDiv.parentNode.style.display = 'none'
    this.gameStarted = false
  }

  handleTipsDown = () => {
    this.isHoldingTipsBtn = true
    // handle click release oustide the window
    window.addEventListener('mouseup', () => this.handleTipsUp())
  }

  handleTipsUp = () => {
    this.isHoldingTipsBtn = false
    window.removeEventListener('mouseup', () => this.handleTipsUp())
  }

  run = () => {
    this.resignBtn.style.display = 'none'
    this.tipsBtn.style.display = 'none'
    this.pointsDiv.parentNode.style.display = 'none'
    this.initBoard()
    this.gameLoop()
  }
}
