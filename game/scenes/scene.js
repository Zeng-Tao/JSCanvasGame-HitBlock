class Scene {
    // constructor
    constructor(game) {
        this.game = game
        this.actions = {}
        this.keys = {}
        this.sprites = []
        this.collidPairs = []
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
        // 监测碰撞事件
        for (let pair of this.collidPairs) {
            let a = pair[0]
            let b = pair[1]
            let callback = pair[2]
            if (this.game.isCollided(a, b)) {
                callback()
            }
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
}