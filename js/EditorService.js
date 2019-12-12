let gMeme

function initMeme() {
    gMeme = {
        id: getRandomId(),
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
            line: 'IS Awesome',
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
    img.onload = () => {
        gMeme.txts[0].posX = gMeme.img.width * 0.1
        gMeme.txts[0].posY = gMeme.img.height * 0.2
        gMeme.txts[1].posX = gMeme.img.width * 0.1
        gMeme.txts[1].posY = gMeme.img.height * 0.8
        renderCanvas()
    }
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
        posX: gMeme.img.width / 2 - 50,
        posY: gMeme.img.height / 2 - 50,
        height: 0,
        width: 0
    }
}
function setTextFill(strokeColor) {
    gMeme.txts[gMeme.selectedTxtIdx].fill = strokeColor
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

function setTextMeasure(height, width, textIdx) {
    gMeme.txts[textIdx].height = height
    gMeme.txts[textIdx].width = width
}

function dragText(ev) {
    let text = gMeme.txts[gMeme.selectedTxtIdx]
    text.posX = ev.offsetX - text.width / 2
    text.posY = ev.offsetY + text.height / 2
}

function saveMeme() {
    saveToStorage(`meme${gStorageMemeIdx}`, gCanvas.toDataURL('image/jpeg'))
    gStorageMemeIdx++
    saveToStorage('memeIdx', gStorageMemeIdx)
}