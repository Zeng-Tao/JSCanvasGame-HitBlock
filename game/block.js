class Block extends Sprite {
    // constructor
    constructor(status, game) {
        super(status, game)
        this.setup()
    }

    hitted() {
        this.hp -= 1
        if (this.hp < 1) {
            this.die = true
        }
    }

    setup() {
    }

    update() {
        super.update()
    }
}