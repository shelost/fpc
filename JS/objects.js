const Palette = [
    new Color('black', '#000000'), // 0
    new Color('blue', '#0074FF'), // 1
    new Color('red', '#FF0000'), // 2
    new Color('cyan', '#00FFFF'), // 3
    new Color('pink', '#ff00ff'), // 4
    new Color('orange', '#ff6d00'), // 5
    new Color('yellow', '#ffce00'), // 6
    new Color('purple', '#ba00ff'), // 7
    new Color('white', '#FFFFFF'), // 8
    new Color('green', '#00dd15'), // 9
    new Color('gray', '#909090'), // 10
    new Color('indigo', '#0013ff') // 11
]

function Color(name, hex){
    this.name = name
    this.hex = hex
}

function Tolerance(point, p, tolerance){

    if ((point.qx-p.qx)**2 + (point.qy-p.qy)**2 < tolerance**2){
        return true
    }else{
        return false
    }
}

function Point(x,y,color){

    this.x = x
    this.y = y
    this.c = color
    this.color = Palette[color]
    this.qx = this.x/S
    this.qy = this.y/S
    this.obj =
    {
        x: this.x,
        y: this.y,
        c: this.c,
        color: this.color.hex,
        qx: this.qx,
        qy: this.qy,
    }

    this.draw = canvas => {

        let c = canvas.getContext('2d')

        c.fillStyle = this.color.hex
        c.beginPath()
        c.arc(this.qx*canvas.width,this.qy*canvas.height,5,0,Math.PI*2)
        c.fill()
        c.closePath()
    }

    this.toString = () => {
        return JSON.stringify(this.obj)
    }
}

function Stroke(color){

    this.points = []
    this.c = color
    this.color = Palette[color]
    this.obj =
    {
        c: this.c,
        color: this.color.hex,
        points: []
    }

    this.draw = (canvas, strokeWidth) => {

        let c = canvas.getContext('2d')

        for (let i=0; i<this.points.length-1; i++){

            let p = this.points[i]
            let q = this.points[i+1]

            c.strokeStyle = this.color.hex
            c.lineCap = 'round'
            c.lineJoin = 'round'
            if (strokeWidth){
                c.lineWidth = strokeWidth
            }else{
                c.lineWidth = 5
            }
            c.beginPath()
            c.moveTo(p.qx*canvas.width, p.qy*canvas.height)
            c.lineTo(q.qx*canvas.width, q.qy*canvas.height)
            c.stroke()
            c.closePath()
        }
    }

    this.fill = () => {
        for (let i=0; i<this.points.length; i++){
            let p = this.points[i]
            this.obj.points.push(p.obj)
        }
    }

    this.toString = () => {
        if (this.obj.points.length == 0){
            this.fill()
        }
        return JSON.stringify(this.obj)
    }
}

function Line(start, end, color){

    this.start = start
    this.end = end
    this.c = color
    this.color = Palette[color]
    this.obj =
    {
        c: this.c,
        color: this.color.hex,
        start:
        {
            x: this.start.x,
            y: this.start.y,
            qx: this.start.qx,
            qy: this.start.qy,
            c: this.start.c
        },
    }

    this.draw = (canvas, strokeWidth) => {

        if (this.start != null){

            let c = canvas.getContext('2d')

            this.start.draw(canvas)

            if (this.end != null){

                this.end.draw(canvas)
                c.lineCap = 'round'
                c.strokeStyle = this.color.hex
                if (strokeWidth){
                    c.lineWidth = strokeWidth
                }else{
                    c.lineWidth = 5
                }
                c.beginPath()
                c.moveTo(this.start.qx*canvas.width, this.start.qy*canvas.height)
                c.lineTo(this.end.qx*canvas.width, this.end.qy*canvas.height)
                c.stroke()
                c.closePath()
            }
        }
    }

    this.fill = () => {

        this.obj.end =
        {
            x: this.end.x,
            y: this.end.y,
            qx: this.end.qx,
            qy: this.end.qy,
            c: this.end.c
        }
    }

    this.toString = () => {
        if (this.obj.end == undefined){
            this.fill()
        }
        return JSON.stringify(this.obj)
    }
}

function Problem(strokes, lines){

    this.strokes = strokes
    this.lines = lines
    this.numStrokes = this.strokes.length
    this.numLines = this.lines.length
    this.input = null
    this.output = null

    this.obj =
    {
        strokes: [],
        lines: [],
        input: null,
        output: null
    }

    this.drawInput = (canvas, strokeWidth) => {

        let c = canvas.getContext('2d')

        for (let i=0; i<this.strokes.length; i++){
            let s = this.strokes[i]
            s.draw(canvas, strokeWidth)
        }
    }

    this.drawOutput = (canvas, strokeWidth) => {

        let c = canvas.getContext('2d')

        for (let i=0; i<this.strokes.length; i++){
            let s = this.strokes[i]
            s.draw(canvas, strokeWidth)
        }

        for (let i=0; i<this.lines.length; i++){
            let l = this.lines[i]
            l.draw(canvas, strokeWidth)
        }
    }

    this.fill = () => {
        for (let i=0; i<this.strokes.length; i++){
            let s = this.strokes[i]
            s.fill()
            this.obj.strokes.push(s.obj)
        }
        for (let i=0; i<this.lines.length; i++){
            let l = this.lines[i]
            l.fill()
            this.obj.lines.push(l.obj)
        }
        if (this.obj.input == null){
            this.obj.input = this.input
        }
        if (this.obj.output == null){
            this.obj.output = this.output
        }
    }

    this.toString = () => {
        if (this.obj.strokes.length == 0 && this.obj.lines.length == 0){
            this.fill()
        }
        return JSON.stringify(this.obj)
    }
}

function Set(id, name){

    this.id = id
    this.name = name
    this.problems = []
    this.obj =
    {
        id: this.id,
        name: this.name,
        problems: []
    }

    this.fill = () => {
        for (let i=0; i<this.problems.length; i++){
            let p = this.problems[i]
            this.obj.problems.push(p.obj)
        }
    }

    this.toString = () => {
        if (this.obj.problems.length == 0){
            this.fill()
        }
        return JSON.stringify(this.obj)
    }
}