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
// const GAME_MAXTICK_BG = sprites.background.dw/GAME_SPEED_BG
const GAME_MAXTICK_SCREEN = W/GAME_SPEED_H
const GAME_BG_PARALLAX = 3/4

const patterns = {
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
        const frame = Math.floor(game.ticks.frame/sprites.player.slowness)
        ctx.drawImage(sprites.player.img,
            GAME_CELL_SIZE*(frame%sprites.player.frames),
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

class Entity {
    constructor() {
        this.type = ['screw','amp'][randomInt(2)]
        this.pattern = structuredClone(patterns[this.type][randomInt(patterns[this.type].length)])
        this.x = W//W+randomInt(4)*GAME_CELL_SIZE//W+randomInt(W/GAME_CELL_SIZE-this.pattern[0].length)*GAME_CELL_SIZE
        this.y = randomInt(GAME_PADDING,H/GAME_CELL_SIZE-GAME_PADDING-this.pattern.length)
        this.frame = 0
    }
    render() {
        this.pattern.forEach((row,i) => {
            row.forEach((cell,j) => {
                if(cell)
                    ctx.drawImage(
                        sprites[this.type].img,
                        GAME_CELL_SIZE*(this.frame%sprites[this.type].frames),0,GAME_CELL_SIZE,GAME_CELL_SIZE,
                        this.x+j*GAME_CELL_SIZE,(this.y+i)*GAME_CELL_SIZE,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )
            })
        })
    }
    update() {
        this.x -= game.speed_h
        this.frame = Math.floor(game.ticks.frame/sprites[this.type].slowness)
        this.pattern.forEach((row,i) => {
            row.forEach((cell,j) => {
                if(cell)
                    if(checkIntersection2D(
                        game.player.x,game.player.y,game.player.w,game.player.h,
                        this.x+j*GAME_CELL_SIZE,(this.y+i)*GAME_CELL_SIZE,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )) {
                        if(this.type=='screw') {
                            game.score++
                            this.pattern[i][j] = 0
                            soundPlay('screw')
                        }
                        if(this.type=='amp')
                            if(game.state=='running')
                                gameChangeState('lose')
                    }
            })
        })
    }
}

const game = {
    state:'',
    ticks:{
        frame:0,
        // bg:0,
        screen:0,
    },
    score:0,
    player:null,
    entities:[],
    speed_h:0,//8,
    pos_bg:0,
    // speed_bg:0,//game.speed_h*6/8,
    // maxtick_bg:0,//sprites.background.dw/game.speed_bg,
    // maxtick_screen:0,//W/game.speed_h,
}

function gameSceneInit() {
    game.state = 'running'
    game.score = 0
    Object.keys(game.ticks).forEach(t => game.ticks[t] = 0)
    musicStop()
    musicPlay()
    game.player = new Player(GAME_CELL_SIZE*2,GAME_FLOOR-GAME_PLAYER_H)
    game.entities = []
    game.speed_h = GAME_SPEED_H
    game.speed_bg = GAME_SPEED_BG
    game.pos_bg = 0
}

function gameChangeState(state) {
    game.state = state
    if(state=='lose') {
        soundStop('jetpack')
        soundPlay('death')
    }
}

function gameSceneKeyPress(key) {
    if(game.state=='running') {
        if(key=='l') gameChangeState('lose')
        if(key=='m') musicPlay()
        if(key=='ArrowUp' || key=='w' || key==' ') soundPlay('jetpack')
    }
    if(game.state=='lose') {
        if(key==' ') sceneChange('game',{type:'bars',sleep:500})
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
                W/2-(game.pos_bg%(W*2))/2,
                0,
                sprites.clouds.dw,
                sprites.clouds.dh
            )
            ctx.drawImage(
                sprites.clouds.img,
                W*3/2-(game.pos_bg%(W*2))/2,
                0,
                sprites.clouds.dw,
                sprites.clouds.dh
            )
            ctx.drawImage(
                sprites.background.img,
                0-game.pos_bg,//0-game.ticks.bg*game.speed_bg,
                0,
                sprites.background.dw,
                sprites.background.dh
            )
            ctx.drawImage(
                sprites.background.img,
                sprites.background.dw-game.pos_bg,//sprites.background.dw-game.ticks.bg*game.speed_bg,
                0,
                sprites.background.dw,
                sprites.background.dh
            )
            renderRect(0,0,W,H,'rgba(255,255,255,0.2)')
            renderRect(0,0,W,GAME_CEILING,GAME_COLOR_CEILING)
            renderRect(0,GAME_FLOOR,W,H-GAME_FLOOR,GAME_COLOR_FLOOR)
            renderText('v '+VERSION,10,H-10,'green',{font:'Emulogic',size:0.4})
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
            renderText('Press space to retry',W/2,H*2/3,'yellow',{centered:true,font:'emulogic',size:0.5})
        }
        function renderScore() {
            renderText('Score: '+game.score,16,GAME_CEILING*3/4,'green',{font:'emulogic'})
        }
        /* Render pipeline */
        /* 0 */ renderBG()
        /* 1 */ game.entities.forEach(e => e.render())
        /* 2 */ game.player.render()
        /* 3 */ if(game.state=='lose') renderLoseScreen()
        /* 4 */ if(game.state=='running') renderScore()
    }
    function update() {
        if(game.state=='running') {
            game.player.update()
            game.entities.forEach(e => e.update())
            if(game.ticks.screen==0) {
                game.entities.push(new Entity())
                if(game.entities.length>2) game.entities.shift()
            }
            if(game.ticks.screen==0) {
                game.speed_h += 0.5
                // game.speed_bg = game.speed_h*6/8
                // game.ticks.maxtick_screen = W/game.speed_h
                console.log(game.speed_h)
            }
            game.pos_bg += game.speed_h*GAME_BG_PARALLAX
            game.pos_bg %= sprites.background.dw
            game.ticks.frame++
            game.ticks.frame %= GAME_MAXTICK_FRAME
            // game.ticks.bg++
            // game.ticks.bg %= GAME_MAXTICK_BG
            game.ticks.screen++
            game.ticks.screen %= GAME_MAXTICK_SCREEN
        }
    }
    render()
    update()
}