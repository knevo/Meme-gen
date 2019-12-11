let gMeme

function initMeme() {
    gMeme = {
        img: initMemeImg(),
        selectedTxtIdx: 0,
        txts: [{
            font: DEFAULT_FONT,
            line: 'Example Meme',
            size: DEFAULT_FONT_SIZE,
            align: 'left',
            fill: DEFAULT_FILL,
            stroke: DEFAULT_STROKE,
            posX: 50,
            posY: 60,
            height: 0,
            width: 0
        }, {
            font: DEFAULT_FONT,
            line: 'a',
            size: DEFAULT_FONT_SIZE,
            align: 'left',
            fill: DEFAULT_FILL,
            stroke: DEFAULT_STROKE,
            posX: 50,
            posY: 400,
            height: 0,
            width: 0
        }]
    };

}
function initMemeImg() {
    let img = new Image()
    img.src = getImgUrlById(getCurrImgId())
    return img
}
function getTextsToRender() {
    return gMeme.txts
}
function getMemeImg() {
    return gMeme.img
}
function createLine() {
    return {
        font: DEFAULT_FONT,
        line: 'Hello',
        size: DEFAULT_FONT_SIZE,
        align: 'left',
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        posX: 250,
        posY: 250,
        height: 0,
        width: 0
    }
}
function setText(text) {
    gMeme.txts[gMeme.selectedTxtIdx].line = text
}
function getCurrText() {
    return gMeme.txts[gMeme.selectedTxtIdx]
}
function setCurrTextIdx() {
    gMeme.selectedTxtIdx++
    gMeme.selectedTxtIdx = gMeme.selectedTxtIdx % gMeme.txts.length
}
function setFontSize(dif) {
    gMeme.txts[gMeme.selectedTxtIdx].size += dif

}
function setTextYPos(dif) {
    gMeme.txts[gMeme.selectedTxtIdx].posY += dif
}
function deleteCurrLine() {
    gMeme.txts.splice(gMeme.selectedTxtIdx, 1)
    if (gMeme.selectedTxtIdx >= gMeme.txts.length) gMeme.selectedTxtIdx--
}
function addNewLine() {
    gMeme.txts.push(createLine())
    gMeme.selectedTxtIdx = gMeme.txts.length - 1
}
function isInTextArea(ev) {
    let clickedTxtIdx = gMeme.txts.findIndex(txt => {
        return (ev.offsetX > txt.posX &&
            ev.offsetX < txt.posX + txt.width &&
            ev.offsetY < txt.posY &&
            ev.offsetY > txt.posY - txt.height)
    })
    if (clickedTxtIdx != -1) {
        gMeme.selectedTxtIdx = clickedTxtIdx
        return true
    } else return false

}
function changePos(ev) {
    let text = gMeme.txts[gMeme.selectedTxtIdx]
    text.posX = ev.offsetX - text.width / 2
    text.posY = ev.offsetY + text.height /2
}
// function getTextIdx(){
//     return gMeme.selectedTxtIdx
// }