function mainInit() {
    display.scene = 'menu'
    display.transition = false
    window[display.scene+'SceneInit']()
}

function mainKeyPress(key) {
    window[display.scene+'SceneKeyPress'](key)
    if(key=='Enter') toggleFullscreen()
}

function mainKeyRelease(key) {
    window[display.scene+'SceneKeyRelease'](key)
}

function mainLoop() {
    renderClear()
    window[display.scene+'SceneLoop']()
    if(display.transition) transitionLoop()
    requestAnimationFrame(mainLoop)
}