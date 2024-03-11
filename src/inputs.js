/* Before page loaded */
loadResources()

/* After page loaded */
addEventListener('load',() => {
    mainInit()
    mainLoop()
    
    addEventListener('keydown',({key}) => {
        if(Object.keys(keys).includes(key) && !keys[key].pressed) {
            keys[key].pressed = true
            mainKeyPress(key)
        }
    })
    
    addEventListener('keyup',({key}) => {
        if(Object.keys(keys).includes(key)) {
            keys[key].pressed = false
            mainKeyRelease(key)
        }
    })
})