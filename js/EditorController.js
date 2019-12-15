const DEFAULT_FONT = "Impact"
const DEFAULT_FONT_SIZE = 60
const DEFAULT_FILL = 'white'
const DEFAULT_STROKE = 'black'
const MAX_STICKER_WIDTH = 150
const MAX_STICKER_HEIGHT = 200
let maxImgWidth = 500
let gCanvas, gCtx;
let gMouseisDown = false;
function initEditor() {
    initMeme()
    initCanvas()
    drawMemeImg()
    initTools()
    handleClick()
    handleTouch()
    renderCanvas()
}
function initCanvas() {
    gCanvas = document.createElement('canvas')
    gCtx = gCanvas.getContext('2d')
    resizeCanvas()
    document.querySelector('.canvas-container').appendChild(gCanvas)
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
    let newRatio = calcAspectRatio(gMeme.img.width, gMeme.img.height, maxImgWidth, 500);
    gMeme.img.width = newRatio.width
    gMeme.img.height = newRatio.height
    gCanvas.width = gMeme.img.width
    gCanvas.height = gMeme.img.height
    setDefaults()
}

function drawMemeImg() {
    gCtx.drawImage(getMemeImg(), 0, 0, gCanvas.width, gCanvas.height)
}
function renderCanvas() {
    drawMemeImg()
    gCtx.save()
    let texts = getTextsToRender()

    texts.map((text, i) => {
        gCtx.font = `${text.size}px ${text.font}`;
        gCtx.textAlign = text.align
        gCtx.fillStyle = text.fill
        gCtx.strokeStyle = text.stroke
        gCtx.strokeText(text.line, text.posX, text.posY);
        gCtx.fillText(text.line, text.posX, text.posY);

        let measure = gCtx.measureText(text.line)
        setTextMeasure(measure.actualBoundingBoxAscent, measure.width, i)
        handleOutOfBound(text)
    })

    let stickers = getStickersToRender()
    stickers.map(sticker => {
        gCtx.drawImage(sticker.img, sticker.posX, sticker.posY, sticker.img.width, sticker.img.height)
    })


    activeLineShow()
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

function initTools() {
    const input = document.querySelector('.text-input')
    let currTxt = getCurrText()

    if (!currTxt && !isSticksEmpty()) {
        input.value = 'sticker selected'
        input.disabled = true
    } else if (isTxtsEmpty() && isSticksEmpty()) {
        input.value = 'Add new line'
        input.disabled = true
    } else {
        input.disabled = false
        input.value = currTxt.line
        activeLineShow()
    }

}
function activeLineShow() {
    const lineFocus = document.querySelector('.focus-line')
    let currText = getCurrText()
    if (!currText) {
        lineFocus.classList.add('hidden')
        return
    } else lineFocus.classList.remove('hidden')

    let { offsetX, offsetY } = calcPosOffset(currText.posX, currText.posY, +1)
    lineFocus.style.top = offsetY - currText.height - 10 + 'px'
    lineFocus.style.left = offsetX - 10 + 'px'
    lineFocus.style.height = currText.height + 25 + 'px'
    lineFocus.style.width = currText.width + 30 + 'px'
}
function calcPosOffset(x, y, dir) {
    canvasRect = gCanvas.getBoundingClientRect();
    canvasLeft = canvasRect.left;
    canvasTop = canvasRect.top;
    return { offsetX: x + canvasLeft * dir, offsetY: y + canvasTop * dir }
}
function onChangeFontSize(elSize) {
    if (isTxtsEmpty() && isSticksEmpty()) return
    let dif = +elSize.dataset.val
    if (getCurrText()) setFontSize(dif)
    else setStickerSize(dif)
    renderCanvas()
}
function onLineDelete() {
    deleteCurrLine()
    renderCanvas()
    initTools()
}
function onLineAdd() {
    addNewLine(gCtx.fillStyle)
    renderCanvas()
    initTools()
}
function handleClick() {
    gCanvas.onmousedown = (ev) => {
        if (isInTextArea(ev) && getCurrText()) {
            gMouseisDown = true
            initTools()
            gCanvas.onmousemove = event => {
                if (gMouseisDown) {
                    dragText(event)
                    renderCanvas()
                }
            }
        } else if (isInStickerArea(ev)) {
            gMouseisDown = true
            initTools()
            gCanvas.onmousemove = event => {
                if (gMouseisDown) {
                    dragSticker(event)
                    renderCanvas()
                }
            }
        }
    }
    gCanvas.onmouseup = ev => {
        if (gMouseisDown) {
            gMouseisDown = false
            if (!getCurrText()) {
                dragSticker(ev)
                renderCanvas()
            } else {
                dragText(ev)
                renderCanvas()
            }
        }
    }
}
function handleTouch() {
    gCanvas.addEventListener("touchstart", (ev) => {
        gCanvas.addEventListener("touchmove", event => {
            let { offsetX, offsetY } = calcPosOffset(event.touches[0].clientX, event.touches[0].clientY, -1)
            event.offsetX = offsetX
            event.offsetY = offsetY
            dragText(event)
            renderCanvas()
        });
    });
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
        addSticker(sticker, ev.offsetX, ev.offsetY)
        renderCanvas()
        initTools()
    }
    sticker.src = data
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.parentElement.href = imgContent

}
function onSave(elSave) {
    elSave.innerText = 'Saved in memes!'
    elSave.onclick = '#'
    saveMeme();
}
function onToggleDropdown(elDrop) {
    elDrop.querySelector('.select').classList.toggle('open')

}
