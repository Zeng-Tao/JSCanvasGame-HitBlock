class Play extends Scene {
    // constructor
    constructor(game) {
        super(game)
        // this.setup()
    }

    setup() {
        var game = this.game
        let paddle = new Paddle(110, 280, 'paddle', game)
        let ball = new Ball(150, 240, 'ball', game)
        let blocks = []
        for (let i = 0; i < 3; i++) {
            let x = 100 * i + 10
            let y = 50
            let block = new Block(x, y, 'block', game)
            blocks.push(block)
            game.whenCollided(block, ball, function () {
                ball.reverse()
                block.hitted()
                log('hitted')
            })
        }
        game.addSprites(blocks)
        game.addSprites(paddle)
        game.addSprites(ball)

        game.whenCollided(paddle, ball, function () {
            ball.reverseY()
            log('collide')
        })
    }

    draw() {
        super.draw()
    }

    update() {
        super.update()
    }

    run() {
        this.draw()
        this.update()
    }
}