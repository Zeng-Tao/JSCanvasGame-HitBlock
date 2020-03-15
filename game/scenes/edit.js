class Edit extends Scene {
    // constructor
    constructor(name, game) {
        super(name, game)
    }

    setup() {
        // setup 在 TaoGame 绑定 scene 时执行
        this.w = this.game.width
        this.h = this.game.height
        this.blockW = 40
        this.blockH = 20
        this.maxRows = parseInt(this.h / this.blockH) * (2 / 3)
        this.maxCols = parseInt(this.w / this.blockW)
        this.currentBlockName = 'block1'
        this.currentBlockHP = 1
        this.map = {}
        this.addBaseBlocks()
        // 注册场景按键事件
        this.registerEvents()
    }

    saveMap() {
        let map = []
        for (let key in this.map) {
            let s = this.map[key]
            // s = JSON.parse(s)
            map.push(s)
        }
        let gMap = localStorage.getItem('maps') || "[]"
        gMap = JSON.parse(gMap)
        gMap.push(map)
        gMap = JSON.stringify(gMap)
        localStorage.setItem('maps', gMap)
        location.reload()
        s = new Home('home', game)
        game.runWithScene(s)
    }

    blockTemplate(name, hp) {
        let t = `
        <button
            class="block"
            style="background-image: url('images/${name}.png'); background-repeat:no-repeat; color: #fff;" 
            data-name="${name}"
            data-hp="${hp}"
            >
            HP${hp}
        </button>
        `
        return t
    }

    addBaseBlocks() {
        let div = document.createElement('div')
        let info = `
                <h2>编辑关卡说明</h2>
                <ul>
                    <li>按 S 键保存新关卡</li>
                    <li>点击空白处添加砖块</li>
                    <li>点击已有这块, 则取消该砖块</li>
                    <li>点击下方砖块, 选择要添加的砖块类型</li>
                </ul>  
        `
        div.innerHTML = info
        e('body').insertAdjacentElement('afterEnd', div)

        for (let i = 1; i <= 3; i++) {
            let name = `block${i}`
            let hp = i
            let t = this.blockTemplate(name, hp)
            div.insertAdjacentHTML('afterEnd', t)
        }
        let blocks = es('.block')
        for (let b of blocks) {
            // 点击切换新砖块类型
            b.addEventListener('click', e => {
                let name = b.dataset["name"]
                let hp = Number(b.dataset["hp"])
                this.currentBlockName = name
                this.currentBlockHP = hp
            })
        }
    }

    registerEvents() {
        // 监听鼠标事件
        this.game.canvas.addEventListener('mousedown', e => {
            let row = parseInt(e.clientX / this.blockW)
            let col = parseInt(e.clientY / this.blockH)
            let x = row * this.blockW
            let y = col * this.blockH
            if (y >= this.h * (2 / 3)) {
                return
            }
            let s = {
                'x': x,
                'y': y,
                'name': this.currentBlockName,
                'hp': this.currentBlockHP,
            }
            let key = `${x}${y}`
            if (this.map.hasOwnProperty(key)) {
                delete this.map[key]
            } else {
                this.map[key] = s
            }
        })

        this.game.canvas.addEventListener('mousemove', e => {
            let x = e.clientX
            let y = e.clientY
        })

        // 按键事件
        this.game.registerEvent('s', e => {
            this.saveMap()
        })
    }

    drawGrid() {
        // 行
        for (let row = 0; row < this.maxRows; row++) {
            let y = row * this.blockH + this.blockH
            let start = [0, y]
            let end = [this.w, y]
            this.game.drawLine(start, end)
        }
        // 列
        for (let col = 0; col < this.maxCols; col++) {
            let x = col * this.blockW + this.blockW
            let start = [x, 0]
            let end = [x, this.h]
            this.game.drawLine(start, end)
        }

    }

    drawMap() {
        for (let key in this.map) {
            let s = this.map[key]
            let b = new Block(s, this.game)
            b.draw()
        }
    }

    draw() {
        super.draw()
        this.drawGrid()
        this.drawMap()
    }

    update() {
        super.update()
    }
}