/* Before page loaded */
loadResources()

/* After page loaded */
if(MOBILE) alert('Game not available on mobile devices')
else addEventListener('load',() => {
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