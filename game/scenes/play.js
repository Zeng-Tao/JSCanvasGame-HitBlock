class Play extends Scene {
    // constructor
    constructor(name, game) {
        super(name, game)
        this.score = 0
    }

    setup(level = this.game.currntLevel) {
        // setup 在 TaoGame 绑定 scene 时执行
        this.paddle = this.addPaddle()
        this.ball = this.addBall()
        let map = this.game.loadMap(level)
        if (!map) {
            this.backToHome()
        }
        this.addBlocks(map)

        this.game.whenCollided(this.paddle, this.ball, () => {
            this.ball.reverseY()
        })
        // 注册场景按键事件
        this.registerEvents()
    }

    addPaddle() {
        let status = {
            x: 100,
            y: 280,
            name: 'paddle',
            hp: 1,
        }
        let paddle = new Paddle(status, this.game)
        this.game.addSprites(paddle)
        return paddle
    }

    addBall() {
        let status = {
            x: 150,
            y: 240,
            name: 'ball',
            hp: 1,
        }
        let ball = new Ball(status, this.game)
        this.game.addSprites(ball)
        return ball
    }

    addBlocks(map) {
        let blocks = []
        for (let status of map) {
            let block = new Block(status, this.game)
            blocks.push(block)
            this.game.whenCollided(block, this.ball, () => {
                this.ball.reverse()
                block.hitted()
                this.score += 1
                log('hitted')
            })
        }
        this.game.addSprites(blocks)
        return blocks
    }

    registerEvents() {
        this.game.registerEvent('Escape', () => {
            this.backToHome()
        })

        window.addEventListener('keydown', (event) => {
            let k = event.key
            // 载入关卡
            if ('123456789'.includes(k)) {
                log('load level k, ', k)
                this.nextLevel(Number(k))
            }
        })
    }

    draw() {
        super.draw()
        // draw score
        this.game.drawText(this.score, 10, this.game.height - 10, 24)
    }

    update() {
        super.update()
        if (this.sprites.length === 2) {
            this.nextLevel()
        }
        if (this.ball.y + this.ball.height >= this.game.height) {
            this.ball.die = true
            let text = 'GAME OVER!'
            this.game.drawText(text, 80, 200, 36)
            text = '按 ESC 键返回开始界面.'
            this.game.drawText(text, 80, 236, 24)
        }
    }

    nextLevel(level = this.game.currntLevel) {
        this.actions = {}
        this.keys = {}
        this.sprites = []
        this.collidPairs = []
        this.setup(level)
    }

    backToHome() {
        let s = new Home('home', this.game)
        this.game.isReload = false
        this.game.runWithScene(s)
    }

}