const backgroundTerrainSetting = {
    noiseHeight: 5, 
    hilly: .1,
    baseRadius: 4.15, 
    count: 250, 
    isMain: false,
    color: '#a3d37e',
    speed: .001,
}
const mainTerrainSetting = {
    noiseHeight: 9, 
    hilly: .5, 
    baseRadius: 3.935, 
    count: 200,
    isMain: true,
    color: '#5e8d5a',
    speed: .004,
}

const clouds = [
    {
        element: document.getElementById('title'),
        pos: 30,
    },
    {
        element: document.getElementById('skill'),
        pos: 265,
    },
    {
        element: document.getElementById('proj_debugger'),
        pos: 500,
    },
    {
        element: document.getElementById('proj_watermelon'),
        pos: 675,
    },
    {
        element: document.getElementById('proj_olivetoast'),
        pos: 850,
    },
    {
        element: document.getElementById('proj_strawberrydonut'),
        pos: 1025,
    },
    {
        element: document.getElementById('proj_andmore'),
        pos: 1200,
    },
]

const plantMinSpace = 5.5

const radianCenter = 1.5
const radianLength = .2
const radianStart = radianCenter - radianLength / 2

const canvas = document.getElementById('canvas')    
const ctx = canvas.getContext('2d')

const simplex = new SimplexNoise()

position = 0

changedPos = 0
moveCoolTime = 0
prvTouch = {pos: 0, time: 0}

cloudSpeed = 1

window.addEventListener('resize', resizeCanvas, false)
window.addEventListener('mousemove', move)
window.addEventListener('touchmove', mobileMove)
window.addEventListener('wheel', scroll)

resizeCanvas()

var fc = new FpsCtrl(30, draw)
fc.start()

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function move(e) {
    if (e.buttons == 1) {
        changedPos = -e.movementX / 1.5

        moveCoolTime = 3
    }
}

function mobileMove(e) {
    if (e.touches.length == 0) return

    now = Date.now()
    touch = e.touches[0]
    if (now - prvTouch.time < 15) {
        changedPos = prvTouch.pos - touch.pageX
    }

    prvTouch = {pos: touch.pageX, time: now}

    moveCoolTime = 3
}

function scroll(e) {
    changedPos = e.deltaY / 7

    moveCoolTime = 5
}

function draw() {
    canvas.width = canvas.width

    centerX = canvas.width / 2
    centerY = canvas.height * 4.8
    
    drawTerrain(backgroundTerrainSetting)

    drawPlant(mainTerrainSetting)

    drawTerrain(mainTerrainSetting)

    drawCloud()

    position += changedPos
    changedPos = 0

    if (moveCoolTime <= 0)
        position++
    else
        moveCoolTime--
}

function drawTerrain(setting) {
    singleRadian = radianLength / setting.count

    ctx.beginPath()
    ctx.moveTo(0, canvas.height)

    for (i = 0; i < setting.count; i++) {
        radianAngle = radianStart + singleRadian * i

        pos = getPosition(i, radianAngle, setting)
        ctx.lineTo(pos.x, pos.y)
    }

    ctx.lineTo(canvas.width, canvas.height)
    ctx.fillStyle = setting.color
    ctx.fill()
}

function drawPlant(terrainSetting) {
    singleRadian = radianLength / terrainSetting.count

    s = canvas.height / 1297

    space = 0

    for (i = 0; i < terrainSetting.count; i++) {
        radianAngle = radianStart + singleRadian * i

        pos = getPosition(i, radianAngle, terrainSetting)

        x = Math.round((i / terrainSetting.hilly + position) * terrainSetting.speed * 25)
        seed = (simplex.noise2D(0, x) + 1) / 2

        space++
        if (seed > .3 || space < plantMinSpace) {
            continue
        }
        space = 0

        img = new Image()

        plantSeed = Math.floor(seed * 10000) % 100
        if (plantSeed < 30) {
            img.src = 'img/grass1.svg'
        }
        else if (plantSeed < 60) {
            img.src = 'img/grass2.svg'
        }
        else {
            img.src = 'img/flower1.svg'
        }

        width = img.width * s
        height = img.height * s

        angle = (radianAngle + .5) * Math.PI

        ctx.translate(pos.x, pos.y)
        ctx.rotate(angle)

        ctx.drawImage(img, -width / 2, -height + 3, width, height)

        ctx.rotate(-angle)
        ctx.translate(-pos.x, -pos.y)
    }
}

function drawCloud() {
    p = position > 0 ? position % 1350 : position

    for (i = 0; i < clouds.length; i++) {
        c = clouds[i]

        if (Math.abs(c.pos - p) > 150) {
            c.element.style.display = 'none'
            continue
        }
        c.element.style.display = ''

        t = p - c.pos
        pos = -473 - t * (Math.cos(t / 180) * -1 + 1) * 1

        radian = radianStart + radianLength / 100 * pos * Math.PI
        radius = canvas.height * 4.6

        x = centerX + radius * Math.cos(radian)
        y = centerY + radius * Math.sin(radian)

        c.element.style.transform = `rotate(${radian + Math.PI / 2}rad)`
        c.element.style.left = `${x - c.element.clientWidth / 2}px`
        c.element.style.top = `${y}px`
    }
}

function getPosition(x, radianAngle, setting) {
    radius = canvas.height * setting.baseRadius

    radian = radianAngle * Math.PI
    radius = getNoise(x, radius, setting)

    x = centerX + radius * Math.cos(radian)
    y = centerY + radius * Math.sin(radian)

    return {x, y}
}

function getNoise(x, radius, setting) {
    height = canvas.height / setting.noiseHeight

    pos = (x / setting.hilly + position) * setting.speed

    return radius + ((setting.isMain ? simplex.noise2D(pos, 0) : simplex.noise2D(0, 100 + pos)) + 1) * height
}

//https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
function FpsCtrl(fps, callback) {

    var delay = 1000 / fps,
        time = null,
        frame = -1,
        tref

    function loop(timestamp) {
        if (time === null) time = timestamp
        var seg = Math.floor((timestamp - time) / delay)
        if (seg > frame) {
            frame = seg
            callback({
                time: timestamp,
                frame: frame
            })
        }
        tref = requestAnimationFrame(loop)
    }

    this.isPlaying = false

    this.frameRate = function(newfps) {
        if (!arguments.length) return fps
        fps = newfps
        delay = 1000 / fps
        frame = -1
        time = null
    }

    this.start = function() {
        if (!this.isPlaying) {
            this.isPlaying = true
            tref = requestAnimationFrame(loop)
        }
    }

    this.pause = function() {
        if (this.isPlaying) {
            cancelAnimationFrame(tref)
            this.isPlaying = false
            time = null
            frame = -1
        }
    }
}