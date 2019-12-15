const IMGS_DIR = './img/meme-imgs/'
let gImgs = []
let gCurrImgId
let gStorageMemeIdx;
let gMemeStorageUrls;

function createImg(url, keywords) {
    return {
        id: getRandomId(),
        url,
        keywords
    }
}
function initMemeCollection() {
    gMemeStorageUrls = []
    gStorageMemeIdx = loadFromStorage('memeIdx', 0)
    for (let i = 0; i <= gStorageMemeIdx; i++) {
        gMemeStorageUrls.push(loadFromStorage(`meme${i}`, ''))
    }
}
function createImgs() {
    gImgs.push(createImg(`${IMGS_DIR}000.jpg`, ['music']))
    gImgs.push(createImg(`${IMGS_DIR}001.jpg`, ['success', 'baby']))
    gImgs.push(createImg(`${IMGS_DIR}002.jpg`, 'meme'))
    gImgs.push(createImg(`${IMGS_DIR}003.jpg`, ['politics']))
    gImgs.push(createImg(`${IMGS_DIR}004.jpg`, ['dogs', 'cute']))
    gImgs.push(createImg(`${IMGS_DIR}005.jpg`, ['baby', 'dog', 'cute', 'puppy']))
    gImgs.push(createImg(`${IMGS_DIR}006.jpg`, ['cat', 'sleep', 'cute']))
    gImgs.push(createImg(`${IMGS_DIR}007.jpg`, ['evil', 'baby', 'plan']))
    gImgs.push(createImg(`${IMGS_DIR}008.jpg`, ['you']))
    gImgs.push(createImg(`${IMGS_DIR}009.jpg`, ['why']))
    gImgs.push(createImg(`${IMGS_DIR}010.jpg`, ['explain']))
    gImgs.push(createImg(`${IMGS_DIR}011.jpg`, ['fake', 'quotes']))
    gImgs.push(createImg(`${IMGS_DIR}012.jpg`, ['meme', 'happy', 'africa', 'kids']))
    gImgs.push(createImg(`${IMGS_DIR}013.jpg`, ['politics', 'trump']))
    gImgs.push(createImg(`${IMGS_DIR}014.jpg`, ['kid', 'lecture']))
    gImgs.push(createImg(`${IMGS_DIR}015.jpg`, ['dog', 'yoga']))
    gImgs.push(createImg(`${IMGS_DIR}016.jpg`, ['politics', 'obama', 'happy']))
    gImgs.push(createImg(`${IMGS_DIR}017.jpg`, ['men', 'kissing']))
    gImgs.push(createImg(`${IMGS_DIR}018.jpg`, ['salute', 'cheers', 'celeb']))
    gImgs.push(createImg(`${IMGS_DIR}019.jpg`, ['toy', 'sotry', 'all', 'yours']))
    gImgs.push(createImg(`${IMGS_DIR}020.jpg`, ['matrix']))
    gImgs.push(createImg(`${IMGS_DIR}021.jpg`, ['precise', 'celeb']))
    gImgs.push(createImg(`${IMGS_DIR}022.jpg`, ['oprah', 'happy']))
    gImgs.push(createImg(`${IMGS_DIR}023.jpg`, ['facepalm', 'cry',]))
    gImgs.push(createImg(`${IMGS_DIR}024.jpg`, ['putin', 'politics']))
}
function getImgsToRender(keywords) {
    const filtered = gImgs.filter((img) => {
        return (img.keywords.toString().indexOf(keywords) >= 0);
    })
    return filtered
}

function setCurrImgId(imgId) {
    gCurrImgId = imgId
}
function getCurrImgId() {
    return gCurrImgId
}
function getImgUrlById(imgId) {
    let img = gImgs.find(img => img.id === imgId)
    return img.url
}
function getMemesUrls() {
    return gMemeStorageUrls
}
