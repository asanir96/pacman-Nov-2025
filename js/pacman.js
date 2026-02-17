'use strict'

const PACMAN = '☺️'
var gPacman

function createPacman(board) {
    // TODO: initialize gPacman...
    gPacman = {
        pos: { i: 5, j: 5 },
        isSuper: false,
        faceDirection: 'right',
        isDead: false,
    }
    board[gPacman.pos.i][gPacman.pos.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return

    // TODO: use getNextPos(), nextCell
    const currPos = gPacman.pos
    const nextPos = getNextPos(ev)
    if (!nextPos) return

    const nextCell = gBoard[nextPos.i][nextPos.j]

    // TODO: return if cannot move
    if (nextCell === WALL) return

    // TODO: hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (!gPacman.isSuper) {
            pacmanEaten()
            gameOver()
            return
        } else {
            eatGhost(nextPos)
        }
    }

    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return

        eatFood(true)
    }

    if (nextCell === FOOD) eatFood(false)

    if (nextCell === CHERRY) eatCherry(nextPos)


    // TODO: moving from current pos:
    // TODO: update the model
    gBoard[currPos.i][currPos.j] = EMPTY

    // TODO: update the DOM
    renderCell(currPos, EMPTY)

    // TODO: Move the pacman to new pos:
    // TODO: update the model
    changeDirection(ev)
    gPacman.pos = nextPos
    gBoard[gPacman.pos.i][gPacman.pos.j] = PACMAN

    // TODO: update the DOM
    renderCell(gPacman.pos, getPacmanHTML())
}

function getNextPos(ev) {
    var nextPos = { i: gPacman.pos.i, j: gPacman.pos.j }
    // TODO: figure out nextPos
    switch (ev.key) {
        case 'ArrowUp':
            nextPos.i--
            break;

        case 'ArrowDown':
            nextPos.i++
            break;

        case 'ArrowLeft':
            nextPos.j--
            break;

        case 'ArrowRight':
            nextPos.j++
            break;

        default:
            return null
    }
    return nextPos
}

function changeDirection(ev) {
    const currDir = gPacman.faceDirection
    // TODO: figure out nextPos
    switch (ev.key) {
        case 'ArrowUp':
            gPacman.faceDirection = 'up'
            break;

        case 'ArrowDown':
            gPacman.faceDirection = 'down'
            break;

        case 'ArrowLeft':
            gPacman.faceDirection = 'left'
            break;

        case 'ArrowRight':
            gPacman.faceDirection = 'right'
            break;

        default:
            return null
    }

}

function eatGhost(nextPos) {
    const ghostIdx = getGhostIdxByPos(nextPos, gLiveGhosts)
    const ghost = gLiveGhosts[ghostIdx]

    const nextCellContent = ghost.currCellContent

    // Update model: ghosts
    gLiveGhosts.splice(ghostIdx, 1)
    gDeadGhosts.push(ghost)

    if (nextCellContent === FOOD) {
        gGame.foodCount--
        if (gGame.foodCount === 0) activateWin()
    }
}

function pacmanEaten() {
    // Update pacman 
    gPacman.isDead = true

    // Update board
    gBoard[gPacman.pos.i][gPacman.pos.j] = EMPTY

    // Display eaten animation 
    var elPacman = document.querySelector('.pacman')
    elPacman.style.backgroundColor = 'red'
    elPacman.style.opacity = '0.0'
}

function getPacmanHTML() {
    var pacmanHTML

    if (gPacman.isDead) pacmanHTML = `<div class = "pacman dead"></div>`
    else pacmanHTML = `<div class = "pacman ${gPacman.faceDirection}"></div>`

    return pacmanHTML
}

function eatCherry() {
    clearTimeout(gTimeouts.removeCherryTimeout)
    updateScore(10)

    if (gCherry.currCellContent === FOOD) {
        gGame.foodCount--
        if (gGame.foodCount === 0) activateWin()
    }
}

function eatFood(isSuper) {
    gGame.foodCount--
    updateScore(1)

    if (isSuper) activateSuperMode()

    if (gGame.foodCount === 0) activateWin()
}

function activateWin() {
    gGame.isWin = true
    gameOver()
}