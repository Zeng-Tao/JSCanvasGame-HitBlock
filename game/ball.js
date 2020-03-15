class Ball extends Sprite {
    // constructor
    constructor(status, game) {
        super(status, game)
        this.setup()
    }

    setup() {
        this.fire = false
        this.speedX = 5
        this.speedY = -5
        this.game.registerEvent('f', () => {
            this.fired = true
        })
    }

    reverseX() {
        this.speedX = -this.speedX
    }

    reverseY() {
        this.speedY = -this.speedY
    }

    reverse() {
        this.reverseX()
        this.reverseY()
    }

    move() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || (this.x + this.width > this.game.width)) {
            this.reverseX()

        }

        if ((this.y < 0) || (this.y + this.height > this.game.height)) {
            this.reverseY()

        }
    }

    update() {
        super.update()

        if (!this.fired) {
            return
        }

        this.move()
    }

}