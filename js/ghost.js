'use strict'

const GHOST = '👻'


var gLiveGhosts = []
var gDeadGhosts = []
var gGhostCount = 3
var gInitialPos = { i: 3, j: 3 }
var gGhostsInterval

function createGhosts(count) {
    const initialCellContent = gBoard[gInitialPos.i][gInitialPos.j]
    
    // Create mode: ghosts
    for (var i = 0; i < count; i++) {
        createGhost(gBoard, initialCellContent)
    }

    // rendering ghosts
    renderGhosts()
    
    // Moving ghosts
    gIntervals.ghostsInterval = setInterval(moveGhosts, 500)
}

function createGhost(board, initialCell) {
    // ghost are created with a pre-determined initial position
    const ghost = {
        pos: gInitialPos,
        color: getRandomColor(),
        currCellContent: initialCell
    }
    findAltGhostInitPos(ghost, board) // if the initial position cell is not an allowed cell, then they are created with alternative position 


    // Update model: Add the ghost to the live ghosts array
    gLiveGhosts.push(ghost)

    // Update model: board
    board[ghost.pos.i][ghost.pos.j] = GHOST

}

function moveGhosts() {
    // TODO: loop through alive ghosts
    for (var i = 0; i < gLiveGhosts.length; i++) {
        handleGhostMovement(gLiveGhosts[i])
    }
}

function handleGhostMovement(ghost) {
    // TODO: figure out moveDiff, nextPos, nextCell
    var diff = getMoveDiff()
    var nextPos = {
        i: ghost.pos.i + diff.i,
        j: ghost.pos.j + diff.j,
    }
    var nextCell = gBoard[nextPos.i][nextPos.j]

    // for simplicity, ghosts allow to move only to allowed cells - cells with empty or regular food
    while (!isAllowedCell(nextCell)) {
        diff = getMoveDiff()
        nextPos = {
            i: ghost.pos.i + diff.i,
            j: ghost.pos.j + diff.j,
        }
        nextCell = gBoard[nextPos.i][nextPos.j]
    }
    // TODO: hitting a pacman? check if super mode
    if (nextCell === PACMAN) {
        // If pacman is super, or the game is over with pacman wins, the ghost should not move to his location
        if (gPacman.isSuper || gGame.isWin) {
            return

        } else {
            // If pacman is not super, he gets eaten and the game is over

            // Hold rendering for pacman eaten animation
            clearInterval(gIntervals.ghostsInterval)

            // Pacman is eaten 
            pacmanEaten()

            // After a second, rendering the eating ghost in the pacman location, and resuming ghost movement
            setTimeout(() => {
                moveGhost(ghost, nextPos, EMPTY)
                gIntervals.ghostsInterval = setInterval(moveGhosts, 500)
            }, 1000, ghost, nextPos, nextCell)

            // Ending the game
            gameOver()
            return
        }
    }

    // Moving the ghost 
    moveGhost(ghost, nextPos, nextCell)

    // console.table(gBoard)
}

function moveGhost(ghost, nextPos, nextCell) {

    // TODO: moving from current pos:
    // TODO: update the model (restore prev cell contents)
    gBoard[ghost.pos.i][ghost.pos.j] = ghost.currCellContent

    // TODO: update the DOM
    renderCell(ghost.pos, ghost.currCellContent)

    // TODO: Move the ghost to new pos:
    // TODO: update the model (save cell contents so we can restore later)
    ghost.pos = nextPos
    ghost.currCellContent = nextCell

    gBoard[ghost.pos.i][ghost.pos.j] = GHOST

    // TODO: update the DOM
    renderCell(ghost.pos, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    var ghostHTML = `<div class="ghost-container" style="background-color: ${ghost.color};"></div>`
    if (gPacman.isSuper) ghostHTML = `<div class="ghost-container scared"></div>`
    return ghostHTML
}


function recoverGhosts() {
    const initialCellContent = gBoard[gInitialPos.i][gInitialPos.j]

    while (gDeadGhosts.length != 0) {
        // Update model: dead ghosts
        var ghost = gDeadGhosts.splice(0, 1)[0]

        // Update model: ghost
        ghost.pos = gInitialPos
        ghost.currCellContent = initialCellContent
        findAltGhostInitPos(ghost, gBoard)

        // Update model: ghosts
        gLiveGhosts.push(ghost)

        // Update model: board
        gBoard[ghost.pos.i][ghost.pos.j] = GHOST
    }
    for (var x = 0; x < gLiveGhosts.length; x++) {
        var pos = gLiveGhosts[x].pos
        console.log(`gLiveGhosts[${x}].pos`, pos)
        console.log(`gBoard[gLiveGhosts[${x}].i][gLiveGhosts[${x}].j]`, gBoard[pos.i][pos.j])

    }
}

function ghostEaten(ghost) {
    gBoard[ghost.pos.i][ghost.pos.j] = ghost.currCellContent
    gLiveGhosts.splice()
    ghost.isDead = true

    const cellClassName = `.cell-${ghost.pos.i}-${ghost.pos.j}`
    const elCell = document.querySelector(cellClassName)

    const elGhost = elCell.querySelector('.ghost-container')
    elGhost.style.opacity = '0.0'

}

function findAltGhostInitPos(ghost, board) {
    while (!isAllowedCell(ghost.currCellContent)){
        ghost.pos = getRandomEmptyPos()
        ghost.currCellContent = board[ghost.pos.i][ghost.pos.j]
    }

    // if (ghost.currCellContent === PACMAN || ghost.currCellContent === GHOST) {
    // }
}

function getNextCell() {
    // TODO: figure out moveDiff, nextPos, nextCell
    const diff = getMoveDiff()
    const nextPos = {
        i: ghost.pos.i + diff.i,
        j: ghost.pos.j + diff.j,
    }
    const nextCell = gBoard[nextPos.i][nextPos.j]
}

function isAllowedCell(cell) {
    return (cell === FOOD || cell === EMPTY)
}

function renderGhosts() {
    for (var i = 0; i < gLiveGhosts.length; i++) {
        renderCell(gLiveGhosts[i].pos, getGhostHTML(gLiveGhosts[i]))
    }
}