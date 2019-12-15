'use strict'
let gMeme
function initMeme() {
    gMeme = {
        id: getRandomId(),
        img: initMemeImg(),
        selectedTxtIdx: 0,
        selectedStickerIdx: 0,
        sticks: [],
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
function getStickersToRender(){
    return gMeme.sticks
}
function getMemeImg() {
    return gMeme.img
}
function createLine(fill) {
    return {
        font: DEFAULT_FONT,
        line: 'Hello',
        size: DEFAULT_FONT_SIZE,
        align: 'left',
        fill,
        stroke: DEFAULT_STROKE,
        posX: gMeme.img.width / 2 - 50,
        posY: gMeme.img.height / 2 - 50,
        height: 0,
        width: 0
    }
}
function createSticker(img,posX,posY){
    return {
        img,
        posX,
        posY,
    }
}
function setTextFill(strokeColor) {
    if (gMeme.selectedTxtIdx!==-1) gMeme.txts[gMeme.selectedTxtIdx].fill = strokeColor

}
function setText(text) {
    gMeme.txts[gMeme.selectedTxtIdx].line = text
}
function getCurrText() {
    if (gMeme.selectedTxtIdx===-1){
        return false
    }
    return gMeme.txts[gMeme.selectedTxtIdx]
}

function setFontSize(dif) {
    gMeme.txts[gMeme.selectedTxtIdx].size += dif
}
function setStickerSize(dif){
    gMeme.sticks[gMeme.selectedStickerIdx].img.width += dif*2
    gMeme.sticks[gMeme.selectedStickerIdx].img.height += dif*2
}

function deleteCurrLine() {
    if (gMeme.selectedTxtIdx!==-1){
        gMeme.txts.splice(gMeme.selectedTxtIdx, 1)
        if (gMeme.selectedTxtIdx >= gMeme.txts.length) gMeme.selectedTxtIdx--
        if(isTxtsEmpty()) gMeme.selectedStickerIdx = gMeme.sticks.length-1

    }else if(gMeme.selectedStickerIdx!==-1){
        gMeme.sticks.splice(gMeme.selectedStickerIdx,1)
        if(gMeme.selectedStickerIdx>=gMeme.sticks.length) gMeme.selectedStickerIdx--
        if(isSticksEmpty()) gMeme.selectedTxtIdx = gMeme.txts.length-1
    }
}

function addNewLine(fillColor) {
    gMeme.txts.push(createLine(fillColor))
    gMeme.selectedTxtIdx = gMeme.txts.length - 1
}

function isInTextArea(ev) {
    let clickedTxtIdx = gMeme.txts.findIndex(txt => {
        return (ev.offsetX > txt.posX &&
            ev.offsetX < txt.posX + txt.width &&
            ev.offsetY < txt.posY &&
            ev.offsetY > txt.posY - txt.height)
    })
    if (clickedTxtIdx !== -1) {
        gMeme.selectedTxtIdx = clickedTxtIdx
        gMeme.selectedStickerIdx = -1
        return true
    } else return false
}

function isTxtsEmpty(){
    if (!gMeme.txts.length) return true
    return false
}
function isSticksEmpty(){
    if (!gMeme.sticks.length) return true
    else return false
}
function isInStickerArea(ev){
    let clickedSticker = gMeme.sticks.findIndex(sticker=>{
        return (ev.offsetX > sticker.posX &&
            ev.offsetX < sticker.posX + sticker.img.width &&
            ev.offsetY > sticker.posY &&
            ev.offsetY < sticker.posY + sticker.img.height)
    })
    if (clickedSticker != -1) {
        gMeme.selectedTxtIdx=-1
        gMeme.selectedStickerIdx = clickedSticker
        return true
    } else return false
}

function addSticker(img,posX,posY){
    gMeme.sticks.push(createSticker(img,posX,posY))
    gMeme.selectedStickerIdx = gMeme.sticks.length-1
    gMeme.selectedTxtIdx=-1
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
function dragSticker(ev){
    let sticker = gMeme.sticks[gMeme.selectedStickerIdx]
    sticker.posX = ev.offsetX - sticker.img.width / 2
    sticker.posY = ev.offsetY - sticker.img.height / 2
}
function saveMeme() {
    saveToStorage(`meme${gStorageMemeIdx}`, gCanvas.toDataURL('image/jpeg'))
    gStorageMemeIdx++
    saveToStorage('memeIdx', gStorageMemeIdx)
}
