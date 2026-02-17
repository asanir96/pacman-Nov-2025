'use strict'
const CHERRY = '🍒'

var gCherry

function createCherry() {
    gCherry = {
        pos: null,
        currCellContent: null
    }
}

function addCherry() {
    const randPos = getRandomEmptyPos()

    //Update model
    gCherry.currCellContent = gBoard[randPos.i][randPos.j]
    gCherry.pos = randPos

    gBoard[randPos.i][randPos.j] = CHERRY
    renderCell(randPos, CHERRY)
    gTimeouts.removeCherryTimeout = setTimeout(removeCherry, 10000, randPos)
}

function removeCherry() {
    if (!gCherry.pos) return

    const currPos = gCherry.pos

    gBoard[currPos.i][currPos.j] = gCherry.currCellContent

    gCherry.pos = null
    gCherry.currCellContent = null


    renderCell(currPos, gBoard[currPos.i][currPos.j])
}