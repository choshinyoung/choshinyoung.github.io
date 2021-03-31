new fullpage('#fullpage', {
    licenseKey: 'asdf',
    navigation: true,
    navigationTooltips: ['Main', 'Skill', 'Project'],
    slidesNavigation: true,
    scrollingSpeed: 900,
    css3: false,
    paddingTop: '50px',
})

document.body.addEventListener('dragstart', event => event.preventDefault())
window.addEventListener('resize', resizeCanvas, false);

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

let img_src = ['img/papyrus.jpg'];

particlesJS.load('snowCanvas', 'particles.json', () => console.log('loaded'))

const backgroundTerrainSetting = {
    noiseHeight: 3.5, 
    hilly: 65,
    baseRadius: 4.15, 
    count: 250, 
    isXAxis: false,
    //color: 'rgb(61,125,0)',
    color: '#333',
    speed: .002,
}
const mainTerrainSetting = {
    noiseHeight: 9, 
    hilly: 80, 
    baseRadius: 3.935, 
    count: 200, 
    isXAxis: true, 
    //color: 'rgb(98,202,0)',
    color: '#fff',
    speed: .004,
}

const plantSettings = [
    {
        img: 'img/flower1.svg',
        size: [.675, .9],
        maxSlope: 4,
        chance: .005,
    },
    {
        img: 'img/grass1.svg',
        size: [.75, 1.35],
        maxSlope: 2.5,
        chance: .005,
    },
    {
        img: 'img/tree2.svg',
        size: [2.625, 3.3],
        maxSlope: 1,
        chance: .005,
    },
    {
        img: 'img/tree1.svg',
        size: [2.625, 3.3],
        maxSlope: 1.5,
        chance: .02,
    },
    {
        img: 'img/snowman.svg',
        size: [1.25, 2],
        maxSlope: 1.5,
        chance: .0175,
    },
    {
        img: 'img/box.svg',
        size: [1, 2],
        maxSlope: 3,
        chance: .02,
    },
    {
        img: 'img/papyrus.jpg',
        size: [.1, 1],
        maxSlope: 23,
        chance: 10,
    },
]
const plantCooltime = 40

const radianCenter = 1.5
const radianLength = .18

simplex = new SimplexNoise()
frame = 0

clouds = []
r = random(3, 6)
for(i = 0; i < r; i++) {
    addCloud()
    clouds[clouds.length - 1].pos = random(-375, -600)
}

plants = []
cooltime = 0
pr = random(2, 3)
for(i = 0; i < pr; i++) {
    addPlant(true)
}

resizeCanvas()

var fc = new FpsCtrl(30, draw)
fc.start()

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    canvas.width = canvas.width

    centerX = canvas.width / 2
    centerY = canvas.height * 4.8    
        
    drawTerrain(backgroundTerrainSetting)

    addPlant(false)
    for (i = 0; i < plants.length; i++) {
        drawPlant(plants[i])
    }

    drawTerrain(mainTerrainSetting)

    if (Math.random() < .003) {
        addCloud()
    }
    for(i = 0; i < clouds.length; i++) {
        drawCloud(clouds[i])
    }

    frame++
}

function drawTerrain(setting) {
    radianStart = radianCenter - radianLength / 2
    singleRadian = radianLength / setting.count

    ctx.beginPath()
    ctx.moveTo(0, canvas.height)

    for (i = 0; i < setting.count; i++) {
        radianAngle = radianStart + singleRadian * i

        pos = getPosition(i, radianAngle, setting)
        ctx.lineTo(pos.x, pos.y)
    }   

    ctx.lineTo(canvas.width * 2, canvas.height * 2)
    ctx.fillStyle = setting.color
    ctx.fill()
}

function drawPlant(plant) {
    radianStart = radianCenter - radianLength / 2
    singleRadian = radianLength / mainTerrainSetting.count
    radianAngle = radianStart + singleRadian * plant.pos

    pos = getPosition(plant.pos, radianAngle, mainTerrainSetting)
    pos.y += 2
    
    s = canvas.height / 1297
    width = plant.img.width * plant.size * s
    height = plant.img.height * plant.size * s

    angle = (radianAngle + .5) * Math.PI + plant.angle

    ctx.translate(pos.x, pos.y)
    ctx.rotate(angle)
    
    ctx.drawImage(plant.img, -width / 2, -height + 5, width, height)

    if (plant.img.src.endsWith('img/tree1.svg')) {
        img = new Image()
        img.src = 'img/tree1-glow.svg'

        ctx.shadowBlur = 30;
        ctx.shadowColor = "yellow";

        ctx.drawImage(img, -width / 2, -height + 5, width, height)

        ctx.shadowBlur = 0
        
        img2 = new Image()
        img2.src = 'img/tree1-glow2.svg'

        ctx.filter = 'brightness(' + (plant.blur) + '%) opacity(85%)'
        if (plant.isUp == undefined || plant.isUp == false) {
            plant.blur -= .4
            if (plant.blur < 80) {
                plant.isUp = true
            }
        }
        else {
            plant.blur += .4
            if (plant.blur > 100) {
                plant.isUp = false
            }
        }

        ctx.drawImage(img2, -width / 2, -height + 5, width, height)

        ctx.filter = 'none'
    }

    ctx.rotate(-angle)
    ctx.translate(-pos.x, -pos.y)
    
    plant.pos -= .31316
    if(plant.pos <= 0) {
        plants.splice(i, 1)
        i--
    }
}

function drawCloud(cloud) {
    radian = radianStart + radianLength / 100 * cloud.pos * Math.PI
    radius = canvas.height * 4.5 + cloud.height

    x = centerX + radius * Math.cos(radian)
    y = centerY + radius * Math.sin(radian)

    ctx.translate(x, y)
    ctx.rotate(radian + Math.PI / 2)

    s = canvas.height / 1297
    width = cloud.img.width * cloud.size * s
    height = cloud.img.height * cloud.size * s

    ctx.filter = 'brightness(' + cloud.brightness + '%) opacity(85%)'

    ctx.drawImage(cloud.img, 0, 0, width, height)

    ctx.filter = 'none'

    ctx.rotate((radian + Math.PI / 2) * -1)
    ctx.translate(-x, -y)

    cloud.pos += cloud.speed
    if (cloud.pos < -600) {
        clouds.splice(i, 1)
        i--
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

    pos = (x / setting.hilly) + (frame * setting.speed)

    return radius + ((setting.isXAxis ? simplex.noise2D(pos, 0) : simplex.noise2D(0, 100 + pos)) + 1) * height
}

function addCloud() {
    r = parseInt(random(1, 4))
    clouds.push(newCloud({
        imgSrc: 'img/sans.jpg', 
        brightness: random(90, 100),
        height: random(0, 300), 
        speed: random(-.05, -.125), 
        size: random(.25, 1),
    }))
}

function newCloud({imgSrc, brightness, height, speed, size}) {
    img = new Image()
    img.src = imgSrc
    pos = -450

    return {img, brightness, pos, height, speed, size}
}

function addPlant(isInit) {
    if (isInit || cooltime < 1) {
        r =  parseInt(random(0, plantSettings.length))
        if (isInit && r < 3) {
            addPlant(true)
            return
        }
        setting = plantSettings[r]

        if (isInit || Math.random() <= setting.chance) {
            x = mainTerrainSetting.count - 1
            if (isInit)
                x = random(10, mainTerrainSetting.count - 10)

            pos1 = {x: x, y: getNoise(x, 0, mainTerrainSetting)}
            pos2 = {x: x + 1, y: getNoise(x + 1, 0, mainTerrainSetting)}
            
            bottom = Math.abs(pos2.x - pos1.x)
            height = Math.abs(pos2.y - pos1.y)
            slope = height / bottom

            if ((isInit && slope <= .25) || (!isInit && slope <= setting.maxSlope)) {
                cooltime = plantCooltime

                angle = height / 37.5
                if (pos1.y < pos2.y)
                    angle = 2 - angle

                plants.push(newPlant(setting, angle * Math.PI, x))
            }
        }
    }  
    else {
        cooltime--
    }
}

function newPlant(setting, angle, pos) {
    img = new Image()
    img.src = setting.img

    return {pos, img, size: random(setting.size[0], setting.size[1]), angle, blur: 100}
}

function random(min, max) {
    return Math.random() * (max - min) + min
}

function FpsCtrl(fps, callback) {

    var delay = 1000 / fps,                               // calc. time per frame
        time = null,                                      // start time
        frame = -1,                                       // frame count
        tref;                                             // rAF time reference

    function loop(timestamp) {
        if (time === null) time = timestamp;              // init start time
        var seg = Math.floor((timestamp - time) / delay); // calc frame no.
        if (seg > frame) {                                // moved to next frame?
            frame = seg;                                  // update
            callback({                                    // callback function
                time: timestamp,
                frame: frame
            })
        }
        tref = requestAnimationFrame(loop)
    }

    // play status
    this.isPlaying = false;

    // set frame-rate
    this.frameRate = function(newfps) {
        if (!arguments.length) return fps;
        fps = newfps;
        delay = 1000 / fps;
        frame = -1;
        time = null;
    };

    // enable starting/pausing of the object
    this.start = function() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            tref = requestAnimationFrame(loop);
        }
    };

    this.pause = function() {
        if (this.isPlaying) {
            cancelAnimationFrame(tref);
            this.isPlaying = false;
            time = null;
            frame = -1;
        }
    }
}