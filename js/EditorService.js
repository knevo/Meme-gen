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
            posX : 50,
            posY: 60,
            height:0,
            width:0
        },{
            font: DEFAULT_FONT,
            line: 'IS AWESOME!!',
            size: DEFAULT_FONT_SIZE,
            align: 'left',
            fill: DEFAULT_FILL,
            stroke: DEFAULT_STROKE,
            posX : 50,
            posY: 400 ,
            height:0,
            width:0
        }]
    };

}
function initMemeImg() {
    let img = new Image()
    // img.onload = ()=> console.log
    img.src = getImgUrlById(getCurrImgId())
    return img
}
function getTextsToRender(){
    return gMeme.txts
}
function getMemeImg(){
    return gMeme.img
}
function setNewText(text){
    gMeme.txts[gMeme.selectedTxtIdx].line = text
}
function getCurrText(){
    return gMeme.txts[gMeme.selectedTxtIdx]
}
function setCurrTextIdx(){
    gMeme.selectedTxtIdx++
    gMeme.selectedTxtIdx = gMeme.selectedTxtIdx%gMeme.txts.length
}
function setFontSize(dif){
    gMeme.txts[gMeme.selectedTxtIdx].size += dif
    console.log(gMeme.txts[gMeme.selectedTxtIdx].size)
    
}
function setTextYPos(dif){
    gMeme.txts[gMeme.selectedTxtIdx].posY += dif
}
// function getTextIdx(){
//     return gMeme.selectedTxtIdx
// }