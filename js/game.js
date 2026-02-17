'use strict'

const WALL = '&#8251;'
const FOOD = '&middot;'
const SUPER_FOOD = `<div class="super-food"></div>`
const EMPTY = ' '
const LOSE_LOGO = `<img src="img/game-over-logo.png" alt="">`
const WIN_LOGO = `<img src="img/win-logo.png" alt="">`

const gIntervals = {}
const gTimeouts = {}

const gBoardSize = 10

var gGame
var gBoard

function init() {
    // create model: board + game
    gGame = createGame()
    gBoard = buildBoard()

    gGame.foodCount = getFoodCount() - 1   // -1 because of the cell where pacman is

    // render: board
    renderBoard(gBoard, '.board-container')
    activateSuperFoodAnimation()
    renderScore()

    // create model: pacman
    createPacman(gBoard)
    // render: board
    renderCell(gPacman.pos, getPacmanHTML())

    // create model: pacman
    createCherry()
    // render cherry every 15 seconds in a random plae 
    gIntervals.addCherryInterval = setInterval(addCherry, 15000)

    // create model: ghosts
    createGhosts(gGhostCount)
    gGame.isOn = true
}

function createGame() {
    const game = {
        boardSize: gBoardSize,
        score: 0,
        isOn: false,
        isWin: false,
        foodCount: null
    }
    return game
}

function buildBoard() {
    const size = gGame.boardSize
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            } else if ((i === 1 && j === 1) ||
                (i === size - 2 && j === 1) ||
                (i === 1 && j === size - 2) ||
                (i === size - 2 && j === size - 2)) {
                board[i][j] = SUPER_FOOD
            }
        }
    }
    return board
}

function updateScore(diff) {
    // update model
    gGame.score += diff

    renderScore()
}

function activateSuperMode() {
    // Model
    gPacman.isSuper = true

    // Change the appearance of all ghosts
    renderGhosts()

    gTimeouts.superModeTimeout = setTimeout(deactivateSuperMode, 5000)
}

function deactivateSuperMode() {
    gPacman.isSuper = false

    recoverGhosts()
    renderGhosts()

    clearInterval(gIntervals.ghostsInterval)
    gIntervals.ghostsInterval = setInterval(moveGhosts, 500)
}

function gameOver() {
    gGame.isOn = false
    const elGameOverModal = document.querySelector('.game-over')
    const elGameOverMessage = elGameOverModal.querySelector('div')

    elGameOverMessage.innerHTML = gGame.isWin ? WIN_LOGO : LOSE_LOGO
    elGameOverModal.style.display = 'block'

}

function onRestart() {
    // Clear model
    removeCherry()
    clearTimeouts()
    clearIntervals()
    gLiveGhosts = []
    gDeadGhosts = []

    // Hide modal
    const gameOverModal = document.querySelector('.game-over')
    gameOverModal.style.display = 'none'

    // Initialize game
    init()
}

function renderScore() {
    const elScore = document.querySelector('.score span')
    elScore.innerText = gGame.score
}

function activateSuperFoodAnimation() {
    fadeInGlow()
}

function fadeInGlow() {
    const elSuperFoods = document.querySelectorAll('.super-food')
    for (var i = 0; i < elSuperFoods.length; i++) {
        elSuperFoods[i].style.backgroundColor = 'rgba(250, 231, 125, 1)'
        elSuperFoods[i].style.opacity = '1.0'
    }
    gTimeouts.superFoodGlowTimeout = setTimeout(fadeOutGlow, 1000)
}

function fadeOutGlow() {
    const elSuperFoods = document.querySelectorAll('.super-food')
    for (var i = 0; i < elSuperFoods.length; i++) {
        elSuperFoods[i].style.backgroundColor = 'gold'
        elSuperFoods[i].style.opacity = '0.2'
    }
    gTimeouts.superFoodGlowTimeout = setTimeout(fadeInGlow, 1000)
}