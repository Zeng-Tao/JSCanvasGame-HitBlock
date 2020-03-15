class TaoGame {
    // constructor
    constructor(width, height, images = {}, maps = [], fps = 20) {
        this.height = height
        this.width = width
        this.images = images
        this.currntLevel = 1
        window.fps = fps
        window.pause = false
        this.scene = null
        this.debugMode = false
        this.isReload = true
        this.canvas = null
        this.context = null
        this.actions = {}
        this.keys = {}
        // 对象 ID
        this.id = 0
        this.init()
    }

    getImage(name) {
        let img = new Image()
        img.src = this.images[name]
        return img
    }

    init() {
        // 初始化 canvas
        let c = document.createElement('canvas')
        c.width = this.width
        c.height = this.height
        c.id = 'id-cavas'
        document.querySelector('body').insertAdjacentElement('afterbegin', c)
        this.canvas = document.querySelector('#id-cavas')
        this.context = this.canvas.getContext('2d')

        this.fontsize = 24
    }

    setup() {
        this.canvas = document.querySelector('#id-cavas')
        this.context = this.canvas.getContext('2d')

        this.fontsize = 24
        // 关卡
        this.maps = JSON.parse(localStorage.getItem('maps'))
        if (this.maps === null) {
            // 来自 map.js 的内置关卡
            this.maps = maps
            localStorage.setItem('maps', JSON.stringify(this.maps))
        }

        if (this.debugMode) {
            // this.registerDebugEvent()
        }
        // 监听按键事件
        var self = this
        window.addEventListener('keydown', function (evet) {
            let k = evet.key
            if (self.scene.keys.hasOwnProperty(k)) {
                self.scene.keys[k] = true
            }
            if (self.keys.hasOwnProperty(k)) {
                self.keys[k] = true
            }
        })

        window.addEventListener('keyup', function (evet) {
            let k = evet.key
            if (self.scene.keys.hasOwnProperty(k)) {
                self.scene.keys[k] = false
            }
            if (self.keys.hasOwnProperty(k)) {
                self.keys[k] = false
            }
        })

    }

    registerDebugEvent() {}

    debug() {
        // 动态调整 fps
        let fps = document.querySelector('#id-fps').value
        window.fps = fps
    }

    isCollided(spriteA, spriteB) {
        // 那就是判断两个矩形的中心坐标的水平和垂直距离
        let a = spriteA
        let b = spriteB
        // 算矩形的中心坐标
        // 在 sprite 的 update 中计算时, 中心坐标算的不对, 很迷
        let aCenterX = a.x + a.width / 2
        let aCenterY = a.y + a.height / 2
        let bCenterX = b.x + b.width / 2
        let bCenterY = b.y + b.height / 2

        let detaX = Math.abs(aCenterX - bCenterX)
        let detaY = Math.abs(aCenterY - bCenterY)
        let halfw = (a.width + b.width) / 2
        let halfh = (a.height + b.height) / 2

        let x = detaX < halfw
        let y = detaY < halfh
        return a.hp > 0 && b.hp > 0 && x && y
    }

    whenCollided(a, b, callback) {
        let pair = [a, b, callback]
        this.scene.collidPairs.push(pair)
    }

    registerEvent(key, callback, global = false) {
        if (global) {
            // 注册全局按键事件
            this.keys[key] = false
            this.actions[key] = callback
        } else {
            // 注册场景按键事件
            this.scene.keys[key] = false
            this.scene.actions[key] = callback
        }
    }

    drawSprite(sprite) {
        let x = sprite.x
        let y = sprite.y
        let img = sprite.image
        this.context.drawImage(img, x, y)
    }

    drawText(text, x, y, size = this.fontsize) {
        this.context.font = `${size}px serif`
        this.context.fillText(text, x, y)
        // 复原画笔样式
        // this.context.font = `${this.fontsize} serif`
    }

    drawLine(start, end) {
        let ctx = this.context
        ctx.beginPath()
        ctx.moveTo(start[0], start[1])
        ctx.lineTo(end[0], end[1])
        ctx.stroke()
    }

    addSprites(sprites) {
        if (sprites instanceof Sprite) {
            sprites.id = this.id
            this.id += 1
            this.scene.sprites.push(sprites)
            return
        }

        for (let s of sprites) {
            s.id = this.id + 1
            this.id += 1
            this.scene.sprites.push(s)
        }
    }

    draw() {
        this.scene.draw()
    }

    update() {
        // 响应 global (全局)按键事件
        for (let k in this.keys) {
            if (this.keys[k] === true) {
                this.actions[k]()
            }
        }
        // debug
        if (this.debugMode) {
            this.debug()
        }
        // scene
        this.scene.update()

    }

    runloop() {
        var self = this
        // 清空画布
        self.context.clearRect(0, 0, self.width, self.height)

        self.update()
        self.draw()

        setTimeout(function () {
            self.runloop()
        }, 1000 / window.fps)
    }

    runWithScene(scene) {
        var g = this
        g.setup()
        g.scene = scene
        g.scene.setup()
        setTimeout(function () {
            g.runloop()
        }, 1000 / window.fps)
    }

    loadMap(level = this.currntLevel) {
        level -= 1
        if (level < this.maps.length) {
            let map = this.maps[level]
            this.currntLevel += 1
            return map
        } else {
            this.currntLevel = 1
            return false
        }
    }
}