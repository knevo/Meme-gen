const IMGS_DIR = './img/meme-square/'
let gImgs = []
var gKeywords = { 'happy': 12, 'funny puk': 1 }
let gCurrImgId

function createImg(url, keywords) {
    return {
        id: getRandomId(),
        url,
        keywords: []
    }
}
function createImgs() {
    for(let i=0;i<18;i++){
        gImgs.push(createImg(`${IMGS_DIR}${(i<10)? '00':'0'}${i}.jpg`,'meme'))
    }
}
function getImgsToRender() {
    return gImgs
}
function setCurrImgId(imgId){
    gCurrImgId = imgId
}
function getCurrImgId(){
    return gCurrImgId
}
function getImgUrlById(imgId){
   let img = gImgs.find(img=> img.id === imgId)
   return img.url
}