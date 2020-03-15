class Home extends Scene {
    // constructor
    constructor(name, game) {
        super(name, game)
        // location.reload()
    }

    setup() {
        // setup 在 TaoGame 绑定 scene 时执行

        // 重新加载页面, 否则随着不断的重新开始游戏, fps 会越来越快
        // 不明白为什么, 所以在进入 home 页时, 手动重新加载页面
        if (!this.game.isReload) {
            location.reload()
            this.game.isReload = true
        }

        // 注册场景按键事件
        this.registerEvents()
    }

    newGame() {
        let s = new Play('play', this.game)
        this.game.runWithScene(s)
    }

    newMap() {
        let s = new Edit('edit', this.game)
        this.game.runWithScene(s)
    }

    registerEvents() {
        this.game.registerEvent('k', () => {
            this.newGame()
        })
        this.game.registerEvent('e', () => {
            this.newMap()
        })
    }

    showInfo() {
        let g = this.game
        let text = "按 K 开始游戏!"
        g.drawText(text, 80, 100, 36)
        text = "按 E 编辑新关卡!"
        g.drawText(text, 80, 136, 36)
        text = "按 A D 键左右移动挡板."
        g.drawText(text, 80, 172, 24)
    }

    draw() {
        super.draw()
        this.showInfo()
    }

    update() {
        super.update()
    }
}