const GAME_COLOR_BG = 'lightblue'
const GAME_COLOR_CEILING = '#335'
const GAME_COLOR_FLOOR = '#335'
const GAME_CELL_SIZE = 32
const GAME_PADDING = 2
const GAME_FLOOR = H-GAME_CELL_SIZE*GAME_PADDING
const GAME_CEILING = GAME_CELL_SIZE*GAME_PADDING
const GAME_LEFT_LIMIT = GAME_CELL_SIZE*GAME_PADDING
const GAME_RIGHT_LIMIT = W/2
const GAME_SPEED_H = 8
const GAME_SPEED_BG = GAME_SPEED_H*6/8
const GAME_PLAYER_W = GAME_CELL_SIZE
const GAME_PLAYER_H = GAME_CELL_SIZE*2
const GAME_PLAYER_SPEED_V = 0.5
const GAME_PLAYER_SPEED_H = 6
const GAME_LOSESCREEN_SIZE = 0.6
const GAME_MAXTICK_FRAME = 1024
const GAME_MAXTICK_BG = sprites.background.dw/GAME_SPEED_BG
const GAME_MAXTICK_OBJ = W*2/GAME_SPEED_H

const game = {
    state:'',
    ticks:{
        frame:0,
        bg:0,
        npc:0,
    },
    patterns:{
        screw:[
            [
                [0,0,1,1,1,1,1,1,0,0],
                [0,1,1,1,1,1,1,1,1,0],
                [1,1,1,1,1,1,1,1,1,1],
                [0,1,1,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,1,1,0,0],
            ],
            [
                [0,0,1,1,1,1,1,1,0,0],
                [0,1,1,1,1,1,1,1,1,0],
                [1,1,1,1,1,1,1,1,1,1],
                [1,1,0,0,0,0,0,0,1,1],
                [1,0,0,0,0,0,0,0,0,1],
            ],
            [
                [1,0,0,0,0,0,0,0,0,1],
                [1,1,0,0,0,0,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1],
                [0,1,1,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,1,1,0,0],
            ],
            [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ],
            [
                [1,0,1,0,1,0,1,0,1,0,1],
                [0,1,0,1,0,1,0,1,0,1,0],
                [1,0,1,0,1,0,1,0,1,0,1],
                [0,1,0,1,0,1,0,1,0,1,0],
                [1,0,1,0,1,0,1,0,1,0,1],
            ],
        ],
        amp:[
            [
                [1],
                [1],
                [1],
                [1],
                [1],
                [1],
                [1],
            ],
            [
                [1,1,1,1,1,1,1,1,1,1,1,1],
            ],
            [
                [1,0,1,0,1,0,1,0,1],
                [0,0,0,0,0,0,0,0,0],
                [1,0,1,0,1,0,1,0,1],
                [0,0,0,0,0,0,0,0,0],
                [1,0,1,0,1,0,1,0,1],
            ],
            [
                [1,0,0,0,0,0,0],
                [0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,0,1,0,0],
                [0,0,0,0,0,1,0],
                [0,0,0,0,0,0,1],
            ],
            [
                [0,0,0,0,0,0,1],
                [0,0,0,0,0,1,0],
                [0,0,0,0,1,0,0],
                [0,0,0,1,0,0,0],
                [0,0,1,0,0,0,0],
                [0,1,0,0,0,0,0],
                [1,0,0,0,0,0,0],
            ],
        ],
    },
    score:0,
    npc:{
        type:'',
        pattern:[],
        offset:{
            x:0,
            y:0,
        },
    },
    npc_odd:{
        type:'',
        pattern:[],
        offset:{
            x:0,
            y:0,
        },
    },
}

class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.w = GAME_PLAYER_W
        this.h = GAME_PLAYER_H
        this.vel_y = 0
        this.acc_y = 0
    }
    render() {
        // renderRect(this.x,this.y,this.w,this.h,'red')
        // if(this.acc_y<0)
        //     renderRect(this.x,this.y+this.h,this.w,10,'yellow')
        const frame = Math.floor(game.ticks.frame/sprites[game.npc.type].slowness)
        ctx.drawImage(sprites.character.img,
            GAME_CELL_SIZE*(frame%sprites[game.npc.type].frames),
            this.acc_y<0 ? GAME_CELL_SIZE : 0,
            GAME_CELL_SIZE,
            GAME_CELL_SIZE,
            this.x-GAME_CELL_SIZE,
            this.y,
            GAME_CELL_SIZE*2,
            GAME_CELL_SIZE*2
        )
    }
    update() {
        /* Vertical axis */
        if(keys.ArrowUp.pressed || keys.w.pressed || keys[' '].pressed)
            this.acc_y = -GAME_PLAYER_SPEED_V
        else
            this.acc_y = GAME_PLAYER_SPEED_V
        this.vel_y += this.acc_y
        if(this.y+this.vel_y<=GAME_CEILING)
            this.stop(GAME_CEILING)
        if(this.y+this.h+this.vel_y>=GAME_FLOOR)
            this.stop(GAME_FLOOR-this.h)
        this.y += this.vel_y
        /* Horizontal axis */
        if(keys.ArrowLeft.pressed || keys.a.pressed)
            if(this.x>GAME_LEFT_LIMIT)
                this.x -= GAME_PLAYER_SPEED_H
        if(keys.ArrowRight.pressed || keys.d.pressed)
            if(this.x+this.w<GAME_RIGHT_LIMIT)
                this.x += GAME_PLAYER_SPEED_H
    }
    stop(y) {
        this.y = y
        this.vel_y = 0
    }
}
let player

function gameChangeState(state) {
    game.state = state
    if(state=='lose') {
        soundStop('jetpack')
        soundPlay('death')
    }
}

function gameSceneInit() {
    game.state = 'running'
    game.score = 0
    Object.keys(game.ticks).forEach(t => game.ticks[t] = 0)
    musicStop()
    musicPlay()
    player = new Player(GAME_CELL_SIZE*2,GAME_FLOOR-GAME_PLAYER_H)
}

function gameSceneKeyPress(key) {
    if(game.state=='running') {
        if(key=='l') gameChangeState('lose')
        if(key=='m') musicPlay()
        if(key=='ArrowUp' || key=='w' || key==' ') soundPlay('jetpack')
    }
    if(game.state=='lose') {
        if(key=='r') sceneChange('game',{type:'bars',sleep:500})
        if(key=='m') sceneChange('menu',{type:'circle',sleep:500})
    }
}

function gameSceneKeyRelease(key) {
    if(game.state=='running') {
        if(key=='ArrowUp' || key=='w' || key==' ') soundStop('jetpack')
    }
}

function gameSceneLoop() {
    function render() {
        function renderBG() {
            renderRect(0,0,W,H,GAME_COLOR_BG)
            ctx.drawImage(
                sprites.clouds.img,
                W/2-game.ticks.bg%(GAME_MAXTICK_BG/3)*GAME_SPEED_BG/2,
                0,
                sprites.clouds.dw,
                sprites.clouds.dh
            )
            ctx.drawImage(
                sprites.clouds.img,
                W/2+sprites.clouds.dw-game.ticks.bg%(GAME_MAXTICK_BG/3)*GAME_SPEED_BG/2,
                0,
                sprites.clouds.dw,
                sprites.clouds.dh
            )
            ctx.drawImage(
                sprites.background.img,
                0-game.ticks.bg*GAME_SPEED_BG,
                0,
                sprites.background.dw,
                sprites.background.dh
            )
            ctx.drawImage(
                sprites.background.img,
                sprites.background.dw-game.ticks.bg*GAME_SPEED_BG,
                0,
                sprites.background.dw,
                sprites.background.dh
            )
            renderRect(0,0,W,H,'rgba(255,255,255,0.2)')
            renderRect(0,0,W,GAME_CEILING,GAME_COLOR_CEILING)
            renderRect(0,GAME_FLOOR,W,H-GAME_FLOOR,GAME_COLOR_FLOOR)
            renderText('v '+VERSION,10,H-10,'green',{font:'Emulogic',size:0.4})
        }
        function renderNPC() {
            if(game.ticks.npc==0) {
                game.npc.type = ['screw','amp'][randomInt(2)]
                game.npc.pattern = structuredClone(game.patterns[game.npc.type][randomInt(game.patterns[game.npc.type].length)])
                game.npc.offset.x = randomInt(W/GAME_CELL_SIZE-game.npc.pattern[0].length)
                game.npc.offset.y = randomInt(GAME_PADDING,H/GAME_CELL_SIZE-GAME_PADDING-game.npc.pattern.length)
            }
            const frame = Math.floor(game.ticks.frame/sprites[game.npc.type].slowness)
            game.npc.pattern.forEach((row,i) => row.forEach((cell,j) => {
                if(cell) {
                    let npc_x = W-game.ticks.npc*GAME_SPEED_H+(game.npc.offset.x+j)*GAME_CELL_SIZE
                    let npc_y = (game.npc.offset.y+i)*GAME_CELL_SIZE
                    if(game.npc.type=='amp') {
                        ctx.drawImage(
                            sprites.amp.img,
                            GAME_CELL_SIZE*((frame)%sprites.amp.frames),0,GAME_CELL_SIZE,GAME_CELL_SIZE,
                            npc_x,npc_y,GAME_CELL_SIZE,GAME_CELL_SIZE
                        )
                    } else {
                        ctx.drawImage(
                            sprites[game.npc.type].img,
                            GAME_CELL_SIZE*(frame%sprites[game.npc.type].frames),0,GAME_CELL_SIZE,GAME_CELL_SIZE,
                            npc_x,npc_y,GAME_CELL_SIZE,GAME_CELL_SIZE
                        )
                    }
                    if(checkIntersection2D(
                        player.x,player.y,player.w,player.h,
                        npc_x,npc_y,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )) {
                        if(game.npc.type=='screw') {
                            game.score++
                            game.npc.pattern[i][j] = 0
                            soundPlay('screw')
                        }
                        if(game.npc.type=='amp')
                            if(game.state=='running')
                                gameChangeState('lose')
                    }
                }
            }))
        }
        function renderNPCOdd() {
            if(game.ticks.npc==0) {
                game.npc_odd.type = ['screw','amp'][randomInt(2)]
                game.npc_odd.pattern = structuredClone(game.patterns[game.npc_odd.type][randomInt(game.patterns[game.npc_odd.type].length)])
                game.npc_odd.offset.x = randomInt(W/GAME_CELL_SIZE-game.npc_odd.pattern[0].length)
                game.npc_odd.offset.y = randomInt(GAME_PADDING,H/GAME_CELL_SIZE-GAME_PADDING-game.npc_odd.pattern.length)
            }
            const frame = Math.floor(game.ticks.frame/sprites[game.npc_odd.type].slowness)
            game.npc_odd.pattern.forEach((row,i) => row.forEach((cell,j) => {
                if(cell) {
                    let npc_x = W*2-game.ticks.npc*GAME_SPEED_H+(game.npc_odd.offset.x+j)*GAME_CELL_SIZE
                    let npc_y = (game.npc_odd.offset.y+i)*GAME_CELL_SIZE
                    ctx.drawImage(
                        sprites[game.npc_odd.type].img,
                        GAME_CELL_SIZE*(frame%sprites[game.npc_odd.type].frames),0,GAME_CELL_SIZE,GAME_CELL_SIZE,
                        npc_x,npc_y,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )
                    if(checkIntersection2D(
                        player.x,player.y,player.w,player.h,
                        npc_x,npc_y,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )) {
                        if(game.npc_odd.type=='screw') {
                            game.score++
                            game.npc_odd.pattern[i][j] = 0
                            soundPlay('screw')
                        }
                        if(game.npc_odd.type=='amp')
                            if(game.state=='running')
                                gameChangeState('lose')
                    }
                }
            }))
        }
        function renderLoseScreen() {
            renderRect(
                W/2*(1-GAME_LOSESCREEN_SIZE),
                H/2*(1-GAME_LOSESCREEN_SIZE),
                W*GAME_LOSESCREEN_SIZE,
                H*GAME_LOSESCREEN_SIZE,
                'rgba(0,0,0,0.8)'
            )
            renderText('GAME OVER',W/2,H*2/5,'white',{centered:true,font:'emulogic'})
            renderText('Your score is '+game.score,W/2,H*3/5,'white',{centered:true,font:'emulogic',size:0.6})
            renderText('Press <R> to retry',W/2,H*2/3,'white',{centered:true,font:'emulogic',size:0.5})
        }
        function renderScore() {
            renderText('Score: '+game.score,16,GAME_CEILING*3/4,'green',{font:'emulogic'})
        }
        /* Render pipeline */
        /* 0 */ renderBG()
        /* 1 */ renderNPC()
        // renderNPCOdd()
        /* 2 */ player.render()
        /* 3 */ if(game.state=='lose') renderLoseScreen()
        /* 4 */ if(game.state=='running') renderScore()
    }
    function update() {
        if(game.state=='running') {
            player.update()
            game.ticks.frame++
            game.ticks.frame %= GAME_MAXTICK_FRAME
            game.ticks.bg++
            game.ticks.bg %= GAME_MAXTICK_BG
            game.ticks.npc++
            game.ticks.npc %= GAME_MAXTICK_OBJ
        }
    }
    render()
    update()
}