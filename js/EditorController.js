const DEFAULT_FONT = "Impact"
const DEFAULT_FONT_SIZE = 60
const DEFAULT_FILL = 'white'
const DEFAULT_STROKE = 'black'
let maxWidth = 500
let gCanvas, gCtx;
let gMouseisDown = false
function initEditor() {
    initMeme()
    initCanvas()
    drawMemeImg()
    renderCanvas()
    initTools()
    handleClick()
    handleDrag()
    renderCanvas()
}
function initCanvas() {
    gCanvas = document.createElement('canvas')
    gCtx = gCanvas.getContext('2d')
    resizeCanvas()
    document.querySelector('.canvas-container').appendChild(gCanvas)
}
function setFill(fillColor) {
    gCtx.fillStyle = fillColor
}
function onSetFill() {
    let fillColor = document.getElementById('palette').value
    document.querySelector('.icon.palette').style.fill = fillColor
    setTextFill(fillColor)
}
function resizeCanvas() {
    if(document.body.width < 500) maxWidth=350
    let newRatio = calcAspectRatio(gMeme.img.width, gMeme.img.height, maxWidth, 500);
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
    if (texts.length === 0) {
        activeLineShow()
        return
    }
    texts.map((text, i) => {
        gCtx.font = `${text.size}px ${text.font}`;
        gCtx.textAlign = text.align
        gCtx.fillStyle = text.fill
        gCtx.strokeStyle = text.stroke
        gCtx.strokeText(text.line, text.posX, text.posY);
        gCtx.fillText(text.line, text.posX, text.posY);

        let measure = gCtx.measureText(text.line)
        setTextMeasure(measure.actualBoundingBoxAscent, measure.width, i)
        handleOutOfBound(text, measure)

    })
    activeLineShow()
    gCtx.restore()
}
function handleOutOfBound(text, measure) {
    if (text.posX + measure.width > gCanvas.width && !gMouseisDown) setFontSize(-5)
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
    input.value = getCurrText().line
    activeLineShow()
}
function activeLineShow() {
    canvasRect = gCanvas.getBoundingClientRect();
    canvasLeft = canvasRect.left;
    canvasTop = canvasRect.top;
    const lineFocus = document.querySelector('.focus-line')

    let currText = getCurrText()
    if (!currText) {
        lineFocus.classList.add('hidden')
        return
    } else lineFocus.classList.remove('hidden')
    lineFocus.style.top = currText.posY - currText.height - 10 + canvasTop + 'px'
    lineFocus.style.left = currText.posX + canvasLeft - 10 + 'px'
    lineFocus.style.height = currText.height + 25 + 'px'
    lineFocus.style.width = currText.width + 30 + 'px'
}
function onChangeFontSize(elSize) {
    let dif = +elSize.dataset.val
    setFontSize(dif)
    renderCanvas()
}

function onLineDelete() {
    deleteCurrLine()
    renderCanvas()
    initTools()
}
function onLineAdd() {
    addNewLine()
    renderCanvas()
    initTools()
}
function handleClick() {
    gCanvas.onclick = (event) => {
        if (isInTextArea(event)) {
            initTools()
        }
    }
}
function handleDrag() {
    canvasRect = gCanvas.getBoundingClientRect();
    canvasLeft = canvasRect.left;
    canvasTop = canvasRect.top;
    console.log(canvasTop,canvasLeft)
    gCanvas.onmousedown = (ev) => {
        if (isInTextArea(ev)) {
            gMouseisDown = true
            gCanvas.onmousemove = event => {
                if (gMouseisDown) {
                    dragText(event)
                    renderCanvas()
                }
            }
        }
    }
    gCanvas.onmouseup = ev => {
        if (gMouseisDown) {
            gMouseisDown = false
            dragText(ev)
            renderCanvas()
        }
    }
    gCanvas.addEventListener("touchstart", (ev) => {
        gCanvas.addEventListener("touchmove", event => {
            event.offsetX = event.touches[0].clientX - canvasLeft
            event.offsetY = event.touches[0].clientY - canvasTop
            dragText(event)
            renderCanvas()
        });
    });
}
function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}
function onSave() {
    document.querySelector('.save').innerText = 'Saved!'
    document.querySelector('.save').onclick = '#'
    saveMeme();
}
