function initGallery() {
    createImgs()
    renderGallery()
    initMemeCollection()
}
function renderGallery() {
    const elGallery = document.querySelector('.gallery-container')
    const searchWords = document.querySelector('.search>input').value
    const imgs = getImgsToRender(searchWords)
    const htmls = imgs.map(img => {
        return `<img data-id=${img.id} onclick="onImgSelect(this)" src=${img.url}>`
    })
    elGallery.innerHTML = htmls.join('')
}
function onImgSelect(elImg) {
    hideGallery()
    setCurrImgId(elImg.dataset.id)
    showEditor()
}
function hideGallery() {
    const elGallery = document.querySelector('.main')
    elGallery.classList.add('hidden')
}
function showEditor() {
    const elEditor = document.querySelector('.editor-container')
    elEditor.classList.remove('hidden')
    initEditor()
}
function showMemes() {
    hideGallery()
    hideEditor()
    const elMeme = document.querySelector('.meme-page')
    elMeme.classList.remove('hidden')
    initMemeCollection()
    renderMemes()
}
function hideEditor() {
    const elMeme = document.querySelector('.editor-container')
    elMeme.classList.add('hidden')
}
function renderMemes() {
    let imgs = getMemesUrls()
    const htmls = imgs.map(img => {
        return `<img src="${img}">`
    })
    const elMeme = document.querySelector('.meme-page')
    elMeme.innerHTML = htmls.join('')
}
function toggleMenu() {
    document.body.classList.toggle('menu-open');
    window.onscroll = function() {
        document.body.classList.remove('menu-open');
    }
}

function onImgInput(ev) {
    loadImageFromInput(ev)
}



