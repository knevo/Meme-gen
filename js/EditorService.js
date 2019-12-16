'use strict'
let gMeme
let gDiff
function initMeme() {
    gMeme = {
        id: getRandomId(),
        imgSrc:'',
        selectedIdx: 0,
        elements: [{
            font: DEFAULT_FONT,
            line: 'Example Meme',
            size: DEFAULT_FONT_SIZE,
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
            fill: DEFAULT_FILL,
            stroke: DEFAULT_STROKE,
            posX: 50,
            posY: 400,
            height: 0,
            width: 0
        }]
    };
}

function getElementsToRender() {
    return gMeme.elements
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
function createSticker(img, posX, posY, height, width) {
    return {
        img,
        posX,
        posY,
        height,
        width
    }
}
function setTextFill(strokeColor) {
    if (gMeme.selectedIdx !== -1) gMeme.elements[gMeme.selectedIdx].fill = strokeColor

}
function setMemeImgSrc(imgSrc){
    gMeme.imgSrc = imgSrc
}
function setText(text) {
    gMeme.elements[gMeme.selectedIdx].line = text
}
function getCurrElement() {
    if (gMeme.selectedIdx===-1){
        return false
    }
    return gMeme.elements[gMeme.selectedIdx]
}

function setFontSize(dif) {
    gMeme.elements[gMeme.selectedIdx].size += dif
}
function setStickerSize(dif) {
    let selected =  gMeme.elements[gMeme.selectedIdx]
    selected.img.width += dif * 2
    selected.img.height += dif * 2
    selected.width += dif*2
    selected.height += dif*2
}

function deleteCurrLine() {
        gMeme.elements.splice(gMeme.selectedIdx, 1)
        if (gMeme.selectedIdx >= gMeme.elements.length) gMeme.selectedIdx--
}

function addNewLine(fillColor) {
    gMeme.elements.push(createLine(fillColor))
    gMeme.selectedIdx = gMeme.elements.length - 1
}

function selectAndCheckIfElement(offsetX, offsetY) {
    let clickedElementIdx = gMeme.elements.findIndex(element => {
        return (offsetX >= element.posX &&
            offsetX <= element.posX + element.width &&
            offsetY <= ((element.img)? element.posY+element.height:element.posY) &&
            offsetY >= ((element.img)? element.posY:element.posY - element.height))
    })
    if (clickedElementIdx !== -1) {
        gMeme.selectedIdx = clickedElementIdx
        gDiff = offsetX - gMeme.elements[gMeme.selectedIdx].posX
        return true
    } else return false
}

function addSticker(img, posX, posY, height, width) {
    gMeme.elements.push(createSticker(img, posX, posY, height, width))
    gMeme.selectedIdx = gMeme.elements.length - 1
}

function setTextMeasure(height, width, textIdx) {
    gMeme.elements[textIdx].height = height
    gMeme.elements[textIdx].width = width
}
function bringToFront(){
    let fronted = gMeme.elements.splice(gMeme.selectedIdx,1)
    gMeme.elements.push(fronted[0])
    gMeme.selectedIdx = gMeme.elements.length-1
}

function dragElement(offsetX, offsetY) {
    let element = gMeme.elements[gMeme.selectedIdx]
    element.posX = offsetX - gDiff
    element.posY = offsetY + ((element.img)? -element.height / 2 : element.height/2)
}

function saveMeme(canvasUrl) {
    saveToStorage(`meme${gStorageMemeIdx}`, canvasUrl)
    gStorageMemeIdx++
    saveToStorage('memeIdx', gStorageMemeIdx)
}

