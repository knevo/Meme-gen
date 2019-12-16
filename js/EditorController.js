const DEFAULT_FONT = "Impact"
const DEFAULT_FONT_SIZE = 60
const DEFAULT_FILL = 'white'
const DEFAULT_STROKE = 'black'
const MAX_STICKER_WIDTH = 150
const MAX_STICKER_HEIGHT = 200
let maxImgWidth = 500
let gElImg;
let gCanvas, gCtx;
let gMouseisDown = false;

function initEditor() {
    initMeme()
    
    gElImg = initMemeImg()
    initCanvas()
    drawMemeImg()
    renderTools()
    handleClick()
    handleTouch()
    handleStickerDrag()
    renderCanvas()
}

function initCanvas() {
    gCanvas = document.createElement('canvas')
    gCtx = gCanvas.getContext('2d')
    resizeCanvas()
    document.querySelector('.canvas-container').appendChild(gCanvas)
}
function initMemeImg() {
    let img = new Image()
    img.onload = () => {
        gMeme.elements[0].posX = gElImg.width * 0.1
        gMeme.elements[0].posY = gElImg.height * 0.2
        gMeme.elements[1].posX = gElImg.width * 0.1
        gMeme.elements[1].posY = gElImg.height * 0.8
        renderCanvas()
    }
    img.src = getImgUrlById(getCurrImgId())
    setMemeImgSrc(img.src)
    return img
}

function onSetFill() {
    let fillColor = document.getElementById('palette').value
    document.querySelector('.icon.palette').style.fill = fillColor
    gCtx.fillStyle = fillColor
    setTextFill(fillColor)
    renderCanvas()
}

function resizeCanvas() {
    maxImgWidth = (document.body.clientWidth < 500) ? document.body.clientWidth - 20 : maxImgWidth
    let newRatio = calcAspectRatio(gElImg.width, gElImg.height, maxImgWidth, 500);
    gElImg.width = newRatio.width
    gElImg.height = newRatio.height
    gCanvas.width = gElImg.width
    gCanvas.height = gElImg.height
    setDefaults()
}

function drawMemeImg() {
    gCtx.drawImage(gElImg, 0, 0, gCanvas.width, gCanvas.height)
}

function renderCanvas(isDownload=false) {
    gCtx.save()
    drawMemeImg()
    let elements = getElementsToRender()

    elements.forEach((element, i) => {
        if (!element.img) {
            gCtx.font = `${element.size}px ${element.font}`;
            let measure = gCtx.measureText(element.line)
            setTextMeasure(measure.actualBoundingBoxAscent, measure.width, i)
        }

        if (getCurrElement() === element && !isDownload) markElement()

        if (!element.img) {
            gCtx.fillStyle = element.fill
            gCtx.strokeStyle = element.stroke
            handleOutOfBound(element)
            gCtx.strokeText(element.line, element.posX, element.posY);
            gCtx.fillText(element.line, element.posX, element.posY);


        } else gCtx.drawImage(element.img, element.posX, element.posY, element.width, element.height)
    })
    gCtx.restore()
}

function handleOutOfBound(text) {
    if (text.posX + text.width > gCanvas.width && !gMouseisDown) setFontSize(-5)
}

function onTextChange(elInput) {
    let newText = elInput.value
    setText(newText)
    renderCanvas()
}

function setDefaults() {
    gCtx.font = `${DEFAULT_FONT_SIZE}px ${DEFAULT_FONT}`
    gCtx.fillStyle = DEFAULT_FILL
    gCtx.strokeStyle = DEFAULT_STROKE
    gCtx.lineWidth = 10
    gCtx.lineJoin = "round";
    gCtx.miterLimit = 5;
    gCtx.shadowOffsetX = 2;
    gCtx.shadowOffsetY = 2;
    gCtx.shadowColor = "black";
}

function renderTools() {
    const input = document.querySelector('.text-input')
    let currElement = getCurrElement()

    if (currElement.img) {
        input.value = 'sticker selected'
        input.disabled = true
    } else if (!currElement) {
        input.value = 'Add new line'
        input.disabled = true
    } else {
        input.disabled = false
        input.value = currElement.line
    }
}

function markElement() {
    gCtx.save()
    let currText = getCurrElement()
    gCtx.beginPath()
    gCtx.fillStyle = 'rgba(36, 35, 35, 0.34)';
    gCtx.lineWidth = 3
    gCtx.rect(currText.posX - 10, currText.posY + ((currText.img) ? 0 : (- currText.height - 10)), currText.width + 20, currText.height + 25);
    gCtx.stroke()
    gCtx.fill()
    gCtx.restore()
}

function calcPosOffset(x, y, dir) {
    canvasRect = gCanvas.getBoundingClientRect();
    canvasLeft = canvasRect.left;
    canvasTop = canvasRect.top;
    return { offsetX: x + canvasLeft * dir, offsetY: y + canvasTop * dir }
}

function onChangeFontSize(elSize) {
    if (!getCurrElement()) return
    let dif = +elSize.dataset.val
    if (!getCurrElement().img) setFontSize(dif)
    else setStickerSize(dif)
    renderCanvas()
}

function onLineDelete() {
    deleteCurrLine()
    renderCanvas()
    renderTools()
}

function onLineAdd() {
    addNewLine(gCtx.fillStyle)
    renderCanvas()
    renderTools()
}

function onForward() {
    bringToFront()
    renderCanvas()
}

function handleClick() {
    gCanvas.onmousedown = (ev) => {
        if (selectAndCheckIfElement(ev.offsetX, ev.offsetY)) {
            gMouseisDown = true
            renderTools()
            renderCanvas()
        }
    }

    gCanvas.onmousemove = event => {
        if (gMouseisDown) {
            dragElement(event.offsetX, event.offsetY)
            renderCanvas()
        }
    }

    document.onmouseup = ev => {
        if (gMouseisDown) {
            gMouseisDown = false
        }
    }
}
function handleTouch() {
    gCanvas.addEventListener("touchstart", (ev) => {
        let { offsetX, offsetY } = calcPosOffset(ev.touches[0].clientX, ev.touches[0].clientY, -1)
        if (selectAndCheckIfElement(offsetX, offsetY)) {
        gMouseisDown = true
        }
    });
    gCanvas.addEventListener("touchmove", event => {
        if(gMouseisDown){
            let { offsetX, offsetY } = calcPosOffset(event.touches[0].clientX, event.touches[0].clientY, -1)
            dragElement(offsetX,offsetY)
            renderCanvas()
        }
    });
    gCanvas.addEventListener('touchend',()=>{
        gMouseisDown = false
    })
}

function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.src);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    sticker = new Image()
    sticker.onload = () => {
        let { height, width } = calcAspectRatio(sticker.width, sticker.height, MAX_STICKER_WIDTH, MAX_STICKER_HEIGHT)
        sticker.width = width
        sticker.height = height
        addSticker(sticker, ev.offsetX, ev.offsetY, width, height)
        renderCanvas()
        renderTools()
    }
    sticker.src = data
}
function handleStickerDrag(){
    let stickers = document.querySelectorAll('img[draggable]')
    stickers.forEach(sticker=>{
        sticker.addEventListener('touchstart',(event)=>{
            stickerImg = new Image()
            stickerImg.onload = () => {
                let { height, width } = calcAspectRatio(stickerImg.width, stickerImg.height, MAX_STICKER_WIDTH/2, MAX_STICKER_HEIGHT/2)
                stickerImg.width = width
                stickerImg.height = height
                addSticker(stickerImg, gCanvas.width/2, gCanvas.height/2, width, height)
                renderCanvas()
                renderTools()
            }
            stickerImg.src = event.target.src
        })
    })
}
function downloadImg(elLink) {
    renderCanvas(true)
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.parentElement.href = imgContent

}
function onSave(elSave) {
    elSave.innerText = 'Saved in memes!'
    elSave.onclick = '#'
    renderCanvas(true)
    saveMeme(gCanvas.toDataURL('image/jpeg'));
}
function onToggleDropdown(elDrop) {
    elDrop.querySelector('.select').classList.toggle('open')
}
