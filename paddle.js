class Paddle extends Sprite {
    // constructor
    constructor(x, y, path, game) {
        super(x, y, path, game)
        this.speed = 10
        this.setup()
    }

    move(x) {
        this.x += x
        if (this.x < 0) {
            this.x = 0
        }
        if ((this.x + this.width) > this.game.width) {
            this.x = this.game.width - this.width
        }
    }

    moveLeft() {
        this.move(-this.speed)
    }
    moveRight() {
        this.move(this.speed)
    }

    setup() {

        this.game.registerEvent('a', () => {
            this.moveLeft()
        })

        this.game.registerEvent('d', () => {
            this.moveRight()
        })

    }

    update() {
        super.update()
    }

}