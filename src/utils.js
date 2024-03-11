function randomInt(a,b) {
    let min,max
    if(arguments.length==1) {
        min = 0
        max = a
    }
    if(arguments.length==2) {
        min = a
        max = b
    }
    return Math.floor(Math.random()*(max-min))+min
}

function distance(ax,ay,bx,by) {
    return Math.sqrt((ax-bx)**2+(ay-by)**2)
}

function checkIntersection1D(ax1,ax2,bx1,bx2) {
    if(ax2>bx1&&ax1<bx2) return true
    return false
}

function checkIntersection2D(ax,ay,aw,ah,bx,by,bw,bh) {
    if(checkIntersection1D(ax,ax+aw,bx,bx+bw))
        if(checkIntersection1D(ay,ay+ah,by,by+bh))
            return true
    return false
}