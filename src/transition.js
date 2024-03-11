const TRANSITION_STEP = 2
const transition = {
    scene_new:'',
    type:'',
    sleep:0,
    tick:0,
    state:'',
}

function transitionInit(scene_new,type='fade',sleep=1000) {
    transition.scene_new = scene_new
    transition.type = type
    transition.sleep = sleep
    transition.tick = 0
    transition.state = 'in'
}

function transitionLoop() {
    if(transition.tick<0) display.transition = false
    else {
        if(transition.state=='in') {
            if(transition.type=='fade')
                renderRect(0,0,W,H,'rgba(0,0,0,'+transition.tick/100+')')
            if(transition.type=='bars') {
                for(let i=0;i<10;i++)
                    renderRect(
                        i*W/10,
                        -i*10*H/100,
                        W/10,
                        transition.tick*H*2/100,
                        'rgba(0,0,0,'+(transition.tick/50-i/10)+')'
                    )
            }
            if(transition.type=='circle') {
                const r_max = distance(0,0,W/2,H/2)
                ctx.globalCompositeOperation = 'destination-in'
                renderCircle(W/2,H/2,(4000*(1/transition.tick-1/100))*r_max/100,'red')
                ctx.globalCompositeOperation = 'destination-over'
                renderRect(0,0,W,H,'hsl(0,0%,'+(100-transition.tick)/4+'%)')
                ctx.globalCompositeOperation = 'source-over'
            }
            transition.tick += TRANSITION_STEP
        }
        if(transition.state=='sleep')
            renderRect(0,0,W,H,'black')
        if(transition.state=='out') {
            if(transition.type=='fade')
                renderRect(0,0,W,H,'rgba(0,0,0,'+transition.tick/100+')')
            if(transition.type=='bars') {
                for(let i=0;i<10;i++)
                    renderRect(
                        i*W/10,
                        H*2-transition.tick*H*2/100-i*10*H/100,
                        W/10,
                        H*2,
                        'rgba(0,0,0,'+(transition.tick+i*5)/100+')'
                    )
            }
            if(transition.type=='circle') {
                const r_max = distance(0,0,W/2,H/2)
                ctx.globalCompositeOperation = 'destination-in'
                renderCircle(W/2,H/2,(4000*(1/transition.tick-1/100))*r_max/100,'red')
                ctx.globalCompositeOperation = 'destination-over'
                renderRect(0,0,W,H,'hsl(0,0%,'+(100-transition.tick)/4+'%)')
                ctx.globalCompositeOperation = 'source-over'
            }
            transition.tick -= TRANSITION_STEP
        }
        if(transition.tick==100 && transition.state=='in') {
            transition.state = 'sleep'
            musicStop()
            setTimeout(() => {
                transition.state = 'out'
                sceneChange(transition.scene_new)
            },transition.sleep)
        }
    }
}