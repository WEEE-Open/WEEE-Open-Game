/* Global variables and functions */
const VERSION = '0.1.4'
const MOBILE = navigator.userAgent.match(/mobile/i) ? true : false
const [W,H] = [1024,576]//[960,540]
const keys = {
    Enter:{pressed:false},
    ' ':{pressed:false},
    ArrowUp:{pressed:false},
    ArrowDown:{pressed:false},
    ArrowLeft:{pressed:false},
    ArrowRight:{pressed:false},
    w:{pressed:false},
    a:{pressed:false},
    s:{pressed:false},
    d:{pressed:false},
    r:{pressed:false},
    l:{pressed:false},
    m:{pressed:false},
}
const display = {
    scene:'',
    transition:false,
}
function sceneChange(scene_new,{type='fade',sleep=1000}={}) {
    if(arguments.length>1) {
        if(!display.transition) {
            display.transition = true
            transitionInit(scene_new,type,sleep)
        }
    } else {
        window[scene_new+'SceneInit']()
        display.scene = scene_new
    }
}

/* Resources */
const fonts = [
    new FontFace('Emulogic','url(res/fonts/emulogic.ttf)'),
]
const sprites = {
    player:{img:null,frames:4,slowness:8},
    screw:{img:null,frames:4,slowness:8},
    amp:{img:null,frames:4,slowness:8},
    background:{img:null,dw:W*6,dh:H,sw:768,sh:72},
    clouds:{img:null,dw:W,dh:H,sw:64,sh:36},
}
const music = {
    theme1:{audio:new Audio('res/music/comic_bakery_noise_maker.mp3'),volume:0.5},
    theme2:{audio:new Audio('res/music/world_of_vikings_maniac.mp3'),volume:0.4,verse:14.5},
    theme3:{audio:new Audio('res/music/unreal_super_hero_3.mp3'),volume:0.8,verse:14.2},
    theme4:{audio:new Audio('res/music/time_machine_waterflame.mp3'),volume:0.5,verse:68},
    theme5:{audio:new Audio('res/music/sound_of_infinity_f777.mp3'),volume:0.4},
}
const sounds = {
    screw:{audio:new Audio('res/sounds/coin.wav'),volume:0.3},
    death:{audio:new Audio('res/sounds/death.wav'),volume:0.6},
    jetpack:{audio:new Audio('res/sounds/jetpack.wav'),loop:true,volume:0.4}
}
function loadResources() {
    fonts.forEach(f => document.fonts.add(f))
    Object.keys(sprites).forEach(s => {
        sprites[s].img = new Image()
        sprites[s].img.src = 'res/graphics/'+s+'.png'
    })
    Object.keys(music).forEach(m => {
        music[m].audio.loop = true
        if(music[m].volume) music[m].audio.volume = music[m].volume
    })
    Object.keys(sounds).forEach(s => {
        if(sounds[s].loop) sounds[s].audio.loop = sounds[s].loop
        if(sounds[s].volume) sounds[s].audio.volume = sounds[s].volume
    })
}
function musicStop() {
    Object.keys(music).forEach(m => {
        music[m].audio.pause()
        if(music[m].verse) music[m].audio.currentTime = music[m].verse
        else music[m].audio.currentTime = 0
    })
}
function musicPlay() {
    musicStop()
    const themes = Object.keys(music)
    const track = randomInt(themes.length)
    music[themes[track]].audio.play()
}
function soundStop(sound) {
    sounds[sound].audio.pause()
    sounds[sound].audio.currentTime = 0
}
function soundPlay(sound) {
    if(sounds[sound].loop) {
        sounds[sound].audio.play()
    } else {
        const clone = sounds[sound].audio.cloneNode()
        clone.volume = sounds[sound].audio.volume
        clone.play()
        clone.remove()
    }
}

/* Rendering properties and functions */
const canvas = document.getElementById('game')
canvas.width = W
canvas.height = H
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

function renderClear(x=0,y=0,w=W,h=H) {
    ctx.clearRect(x,y,w,h)
}

function renderRect(x,y,w,h,color) {
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}

function renderCircle(x,y,r,color) {
    ctx.beginPath()
    ctx.arc(x,y,r,0,2*Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}

function renderText(text,x,y,color='black',{size=1,font='sans-serif',centered=false,maxw=undefined}={}) {
    ctx.font = W/32*size+'px '+font
    ctx.textAlign = centered ? 'center' : 'left'
    ctx.fillStyle = color
    ctx.fillText(text,x,y+size,maxw)
}

function renderLine(ax,ay,bx,by,color) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(ax,ay)
    ctx.lineTo(bx,by)
    ctx.closePath()
    ctx.stroke()
}

function toggleFullscreen() {
    if(document.fullscreenElement) document.exitFullscreen()
    else canvas.requestFullscreen()
}