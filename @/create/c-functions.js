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

// setProblems(): draws problems in set onto shelf
function setProblems(set){
    for (let i=0; i<set.problems.length; i++){
        let p = set.problems[i]
        drawProblem(p, i)
    }
}

// drawProblem(): draws problem onto given canvas
function drawProblem(problem, index){
    if (Class('a-input')[index] != undefined){
        let iCanvas = Class('a-input')[index]
        let oCanvas = Class('a-output')[index]
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

            if (Lines[Lines.length-1].end == null){
                Lines.pop()
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
        Strokes[Strokes.length-1].points.push(new Point(Math.round(EX), Math.round(EY), COLOR))
    }
}

// Place points for line
function onclick(e){
    if (ONSCREEN && STAGE == 1){
        if (DRAWING){
            // set end point
            let l = Lines[Lines.length-1]
            l.end = new Point(Math.round(EX), Math.round(EY), COLOR)

        }else{
            // Start new line
            let l = new Line(new Point(Math.round(EX), Math.round(EY), COLOR), null, COLOR)
            Lines.push(l)
        }
    }
}

function processProblems(){
    Strings = localStorage.getItem("Results2").split('!,')
    Jsons = []

    for (let i=0; i<Strings.length; i++){
        if (i == Strings.length-1 ){
            Strings[i] = Strings[i].substring(0, Strings[i].length-1)
        }
        Strings[i] = JSON.parse(Strings[i])
        Strings[i].problems = JSON.parse(Strings[i].problems)
        Jsons.push(Strings[i])
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
        case 'ArrowRight':
            Submit()
            break
        case 'ArrowLeft':
            Back()
            break
        case "Escape":
            if (DRAWING){
                Lines.pop()
            }
            break
    }
});
