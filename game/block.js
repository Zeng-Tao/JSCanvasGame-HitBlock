class Block extends Sprite {
    // constructor
    constructor(x, y, path, game) {
        super(x, y, path, game)
        this.setup()
    }

    hitted() {
        this.hp -= 1
        if (this.hp < 1) {
            this.die = true
        }
    }

    setup() {
        this.hp = 1
    }

    update() {
        super.update()
    }
}