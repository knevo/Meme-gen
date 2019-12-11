function initGallery() {
    createImgs()
    renderGallery()
}
function renderGallery() {
    const elGallery = document.querySelector('.gallery-container')
    const imgs = getImgsToRender()
    const htmls = imgs.map(img => {
        return `<img data-id=${img.id} onclick="onImgSelect(this)" src=${img.url}>`
    })
    elGallery.innerHTML = htmls.join('')
}
function onImgSelect(elImg) {
    hideGallery()
    let imgId = elImg.dataset.id
    setCurrImgId(imgId)
    showEditor()
}
function hideGallery() {
    const elGallery = document.querySelector('.main')
    elGallery.classList.add('hidden')
}
function showEditor() {
    const elEditor = document.querySelector('.editor-container')
    elEditor.classList.add('visible')
    initEditor()
}