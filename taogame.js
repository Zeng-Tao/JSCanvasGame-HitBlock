class TaoGame {
    // constructor
    constructor(width, height, images = {}, fps = 30) {
        this.height = height
        this.width = width
        this.images = images
        this.fps = fps
        this.debugMode = false
        this.pause = false
        this.canvas = null
        this.context = null
        this.actions = {}
        this.keys = {}
        this.sprites = []
        this.collidPairs = []
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
        // 监听按键事件
        var self = this
        window.addEventListener('keydown', function (evet) {
            let k = evet.key
            if (self.keys.hasOwnProperty(k)) {
                self.keys[k] = true
            }
            // degub
            if (self.debugMode) {
                if (k === 'p' || k === 'P') {
                    self.pause = !self.pause
                }
            }
        })
        window.addEventListener('keyup', function (evet) {
            let k = evet.key
            if (self.keys.hasOwnProperty(k)) {
                self.keys[k] = false
            }
        })
    }

    debug() {
        let fps = document.querySelector('#id-fps').value
        game.fps = fps
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
        this.collidPairs.push(pair)
    }

    registerEvent(key, callback) {
        this.keys[key] = false
        this.actions[key] = callback
    }

    drawSprite(sprite) {
        let x = sprite.x
        let y = sprite.y
        let img = sprite.image
        this.context.drawImage(img, x, y)
    }

    addSprites(sprites) {
        if (sprites instanceof Sprite) {
            sprites.id = this.id
            this.id += 1
            this.sprites.push(sprites)
            return
        }

        for (let s of sprites) {
            s.id = this.id + 1
            this.id += 1
            this.sprites.push(s)
        }
    }

    drawSprites() {
        for (let s of this.sprites) {
            s.draw()
        }
    }

    draw() {
        this.drawSprites()
    }

    update() {
        if (this.pause) {
            return
        }
        // 监测碰撞事件
        for (let pair of this.collidPairs) {
            let a = pair[0]
            let b = pair[1]
            let callback = pair[2]
            if (this.isCollided(a, b)) {
                callback()
            }
        }

        if (this.debugMode) {
            this.debug()
        }
        // 响应按键事件
        for (let k in this.keys) {
            if (this.keys[k] === true) {
                this.actions[k]()
            }
        }
        // 更新状态
        var sprites = this.sprites
        for (let s of sprites) {
            if (s.die) {
                let index = sprites.indexOf(s)
                sprites.splice(index, 1)
                continue
            }
            s.update && s.update()
        }
        this.sprites = sprites

    }

    runloop() {
        var self = this

        self.update()
        self.context.clearRect(0, 0, this.width, this.height)
        self.draw()
        log('runloog')

        setTimeout(function () {
            self.runloop()
        }, 1000 / self.fps)
    }

    runWithScene() {
        var g = this
        // this.scene = scene
        // 开始运行程序
        setTimeout(function () {
            g.runloop()
        }, 1000 / g.fps)

    }

}