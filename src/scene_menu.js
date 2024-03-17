const MENU_COLOR_BG = '#444'
const MENU_COLOR_TITLE = 'green'
const MENU_COLOR_SUBTITLE = '#bbb'
const MENU_SQUARE_SIZE = W/8
const MENU_MAXTICK_SQUARES = 50

const menu = {
    ticks:{
        squares:0,
    }
}

function menuSceneInit() {
    return
}

function menuSceneKeyPress(key) {
    if(key==' ') sceneChange('game',{type:'bars',sleep:500})
}

function menuSceneKeyRelease(key) {
    return
}

function menuSceneLoop() {
    function render() {
        renderRect(0,0,W,H,MENU_COLOR_BG)
        ctx.rotate(-Math.PI/24)
        ctx.translate(-100,40)
        ctx.scale(1.1,1.1)
        for(i=0;i<W/MENU_SQUARE_SIZE;i++)
            renderRect(MENU_SQUARE_SIZE*i,84+16*Math.sin(i+menu.ticks.squares/8),MENU_SQUARE_SIZE+1,MENU_SQUARE_SIZE*2,MENU_COLOR_SUBTITLE)
        ctx.resetTransform()
        renderText('WEEE OPEN GAME',W/2,H*5/12,MENU_COLOR_TITLE,{centered:true,font:'Emulogic',size:1.8})
        renderText('Use WASD to move',W/2,H*6/8,MENU_COLOR_SUBTITLE,{centered:true,font:'Emulogic',size:0.8})
        renderText('Press space to start game',W/2,H*5/6,MENU_COLOR_SUBTITLE,{centered:true,font:'Emulogic',size:0.8})
        renderText('Version: '+VERSION,10,H-10,'white',{font:'Emulogic',size:0.4})
    }
    function update() {
        menu.ticks.squares++
        menu.ticks.squares %= MENU_MAXTICK_SQUARES
    }
    render()
    update()
}