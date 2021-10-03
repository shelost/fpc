let Canvas = Id('canvas')
let ctx = Canvas.getContext('2d')
let rect = Canvas.getBoundingClientRect()
let MX, MY, EX, EY, W, ratio = 0
let S = 500
let COLOR = 2
let STAGE = 0
let DRAWING, ONSCREEN, MOUSEDOWN = false
let Strokes = []
let Lines = []
let ID = '00007'
let r = 5
let id = 0;

//// AIRTABLE FUNCTIONS /////

// new ID(): generates & assigns new ID for current session
function newID(){
    id = Math.floor(Math.random()*90+10).toString() + Math.floor(Math.random()*90+10).toString() + Math.floor(Math.random()*90+10).toString()
    console.log("ID: " + id)
}

// findMatch(): finds ID in airtable and assigns to SET
function findMatch(id){
    let s
    for (let i=0; i<Jsons.length; i++){
        let p = Jsons[i]
        if (p.id == id){
            s = p
        }
    }
    if (s != null){
        let set = buildSet(s)
        SET = set
        id = set.id
        console.log("ID (retrieved): " + id)
        Id('name').value = set.name
    }else{
        alert('Invalid ID')
    }
}

// buildSet(): takes in JSON & builds new Set() object
function buildSet(json){

    let set = new Set(json.id, json.name)

    for (let i=0; i<json.problems.length; i++){
        let p = json.problems[i]
        let prob = new Problem([], [])

        for (let j=0; j<p.strokes.length; j++){
            let s = p.strokes[j]
            let stroke = new Stroke(s.c)
            for (let k=0; k<s.points.length; k++){
                let p = s.points[k]
                let point = new Point(p.x, p.y, p.c)
                stroke.points.push(point)
            }
            prob.strokes.push(stroke)
        }

        for (let j=0; j<p.lines.length; j++){
            let l = p.lines[j]
            let start = new Point(l.start.x, l.start.y, l.start.c)
            let end = new Point(l.end.x, l.end.y, l.end.c)
            let line = new Line(start, end, l.c)
            prob.lines.push(line)
        }
        set.problems.push(prob)
    }
    return set
}

// setProblems(): draws problems in set onto shelf
function setProblems(set){
    for (let i=0; i<set.problems.length; i++){
        let p = set.problems[i]
        drawProblem(p, i)
    }
}

// drawProblems(): draws problem onto given canvas
function drawProblem(problem, index){
    if (Id(`a-input-${index+1}`) != undefined){
        let iCanvas = Id(`a-input-${index+1}`)
        let oCanvas = Id(`a-output-${index+1}`)
        problem.drawInput(iCanvas)
        problem.drawOutput(oCanvas)
    }else{
        Message("No more spaces")
    }
}

function Upload(){
    if (SET.problems.length > 3){
        console.log(SET)
        uploadSet(SET)
        newID()
        SET = new Set(id, "name")
        Id('name').value = ""
        Clear()
        STAGE = 0
        Clear()
        Select(0)
        fetchProblems2(1000)
        processProblems()
    }else{
        alert("Please create at least 4 sample problems.")
    }
}

//// DRAWING FUNCTIONS /////

function Undo(){
    if (STAGE == 0){
        if (Strokes.length > 0){
            Strokes.pop()
            Message("Undo")
        }
    }else{
        if (Lines.length > 0){
            Lines.pop()
            Message("Undo")
        }
    }
}

function Clear(){
    if (STAGE == 0){
        Strokes = []
    }else{
        Lines = []
    }
    Message("Clear")
}

function Submit(){
    if (STAGE == 0){
        STAGE ++
    }else{
        if (Strokes.length == 0 || Lines.length == 0){
            alert("Please enter at least one stroke and one line.")
        }else{

            let index = 0

            // Search for selected
            for (let i=0; i<Class('row').length; i++){
                let elem = Class('row')[i]
                if (elem.classList.contains('selected')){
                    index = i
                    break
                }
            }

            let p = new Problem(Strokes, Lines)
            SET.problems[index] = p
            console.log('Submitted!')
            Clear()
            STAGE = 0
            Clear()

            if (index < Class('row').length-1){
                Class('row')[index].classList.remove('selected')
                Class('row')[index+1].classList.add('selected')
            }
        }
    }
}

function Select(index){
    if (SET.problems[index] != null || SET.problems.length == index){
        for (let i=0; i<Class('row').length; i++){
            let elem = Class('row')[i]
            if (elem.classList.contains('selected')){
                elem.classList.remove('selected')
                break
            }
        }
        Class('row')[index].classList.add('selected')

        if (SET.problems[index] != null){
            Strokes = SET.problems[index].strokes
            Lines = SET.problems[index].lines
        }else{
            Strokes = []
            Lines = []
        }
    }
}

function Create(){
    newID()
    SET = new Set(id, "name")
}

function Back(){
    if (STAGE > 0){
        STAGE --
    }
}

function Message(msg){
    let m = Id('message')
    m.innerHTML = msg
    m.classList.add('active')

    setTimeout(()=>{
        m.classList.remove('active')
    },500)
}

//// CANVAS FUNCTIONS /////

// Resize dimension variables
function resize(){
    rect = Canvas.getBoundingClientRect()
    ratio = S/rect.height
    Canvas.width = S
    Canvas.height = S

    for (let i=0; i<Class('image').length; i++){
        let c = Class('image')[i]
        c.width = S
        c.height = S
    }
}

// Set EX & EY
function mousemove(e){
    MX = e.clientX
    MY = e.clientY
    EX = (MX-rect.left)*ratio
    EY = (MY-rect.top)*ratio
    if (MOUSEDOWN){
        draw()
    }
}

// Detect mouseup
function mouseup(e){
    MOUSEDOWN = false
}

// Place points for stroke
function draw(){
    if (ONSCREEN && STAGE == 0){
        if (!MOUSEDOWN){
            Strokes.push(new Stroke(COLOR))
        }
        MOUSEDOWN = true
        Strokes[Strokes.length-1].points.push(new Point(EX, EY, COLOR))
    }
}

// Place points for line
function onclick(e){
    if (ONSCREEN && STAGE == 1){
        if (DRAWING){
            // set end point
            let l = Lines[Lines.length-1]
            l.end = new Point(EX, EY, COLOR)

        }else{
            // Start new line
            let l = new Line(new Point(EX, EY, COLOR), null, COLOR)
            Lines.push(l)
        }
    }
}

// Event Listeners
window.addEventListener('mousemove', mousemove)
window.addEventListener('click', onclick)
window.addEventListener('mousedown', draw)
window.addEventListener('mouseup', mouseup)
window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'z':
            Undo()
            break
        case 'c':
            Clear()
            break
        case 's':
            Submit()
            break
        case "Escape":
            if (DRAWING){
                Lines.pop()
            }
            break
    }
});
