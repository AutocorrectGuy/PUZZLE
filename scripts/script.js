import { Game } from '/scripts/Game.js'

// const puzzleImage = 'https://art.pixilart.com/sr2ccb4a8a5dd4c.png'
const puzzleImage = './assets/ai_generated_image.png'

/**@type{HTMLCanvasElement} */
const canvas = document.getElementsByTagName('canvas')[0]

// dynamic height for canvas element
// const padding = 48
// const toolbarHeight = document.getElementById('tool-bar').clientHeight
// canvas.width = document.body.clientWidth - padding
// canvas.height = document.body.clientHeight - padding - toolbarHeight
canvas.width = 800
canvas.height = 600

/**@type{CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

/**@type{HTMLImageElement} */
const puzzleImg = new Image()

puzzleImg.src = puzzleImage
puzzleImg.onload = () => {
  console.log('image loaded')
  ctx.fillStyle = '#0C0C20'
  ctx.strokeStyle = '#0C0C20'
  ctx.font = '40px Arial';
  ctx.lineWidth = 8
  ctx.imageSmoothingEnabled = false
  const game = new Game(canvas, ctx, puzzleImg)
  game.run()
}
puzzleImg.onerror = () => console.error('Failed to load image')
