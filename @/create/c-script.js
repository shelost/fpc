// Initialize key variables
newID()
let SET = new Set(id, 'name')

// Fetch Problems
fetchProblems2(100)

// Retrieve sets from localStorage and parse into JSONS
let Strings = localStorage.getItem("Results2").split('!,')
let Jsons = []
processProblems()

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

// Retrive & draw ID

Id('search-button').onclick = () => {
    findMatch(Id('search-input').value)
    Id('search-input').value = ""
}

for (let i=0; i<Class('row').length; i++){
    let elem = Class('row')[i]

    elem.onclick = () => {
        Select(i)
    }
}

// Color Selector
for (let i=0; i<Class('color').length; i++){

    let c = Class('color')[i]
    let id = c.id.substring(2)
    let match = null

    for (let j=0; j<Palette.length; j++){
        let b = Palette[j]
        if (b.name == id){
            match = j
        }
    }

    c.onclick = () => {

        if (!DRAWING){
            // Change active color
            COLOR = match
            // Add class "selected"
            for (let j=0; j<Class('color').length; j++){
                let e = Class('color')[j]
                e.classList.remove('selected')
            }
            c.classList.add('selected')
        }
    }
}

const CreateLoop = () => {

    resize()
    setProblems(SET)

    Id('id').innerHTML = SET.id
    SET.name = Id('name').value

    Id('numStrokes').innerHTML = Strokes.length
    Id('numLines').innerHTML = Lines.length

    if (window.innerWidth>800){
        if (Strokes.length == 1){
            Id('numStrokes').innerHTML = "1 Stroke"
        }else{
            Id('numStrokes').innerHTML += " Strokes"
        }
        if (Lines.length == 1){
            Id('numLines').innerHTML = "1 Line"
        }else{
            Id('numLines').innerHTML += " Lines"
        }
    }

    // Check for unfinished line
    if (Lines.length > 0 && Lines[Lines.length-1].end == null){
        DRAWING = true
    }else{
        DRAWING = false
    }

    // Check if cursor is onscreen
    if (MX > rect.left && MX < rect.left+rect.width &&
        MY > rect.top && MY < rect.top+rect.height){
        ONSCREEN = true
    }else{
        ONSCREEN = false
    }

    // Draw Strokes
    for (let i=0; i<Strokes.length; i++){
        let l = Strokes[i]
        l.draw(Canvas)
    }

    // Draw Lines
    for (let i=0; i<Lines.length; i++){
        let l = Lines[i]
        l.draw(Canvas)
    }

    //Stages
    switch (STAGE){
        case 0:
            Id('submit-text').innerHTML = 'Next'
            Id('submit').classList.remove('purple')
            Id('submit').classList.add('blue')
            /*
            Id('stage').classList.remove('purple')
            Id('stage').classList.add('blue')
            Id('stage').innerHTML = "Problem"
            */
            Id('numStrokes').classList.add('active')
            Id('numLines').classList.remove('active')
            break
        case 1:
            Id('submit-text').innerHTML = 'Submit'
            Id('submit').classList.add('purple')
            Id('submit').classList.remove('blue')
            /*
            Id('stage').classList.add('purple')
            Id('stage').classList.remove('blue')
            Id('stage').innerHTML = "Solution"
            */
            Id('numStrokes').classList.remove('active')
            Id('numLines').classList.add('active')
            break
    }

    // Cursor
    ctx.fillStyle = Palette[COLOR].hex
    ctx.beginPath()
    ctx.arc(EX,EY,r,0,Math.PI*2)
    ctx.fill()
    ctx.closePath()

    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.arc(EX,EY,r*3,0,Math.PI*2)
    ctx.fill()
    ctx.closePath()
    ctx.globalAlpha = 1

    if (STAGE == 0){
        if (MOUSEDOWN){
            r = 8
        }else{
            r = 5
        }
    }else{
        if (DRAWING){

            let w = Lines[Lines.length-1].start
            ctx.beginPath()
            ctx.strokeStyle = Palette[COLOR].hex
            ctx.moveTo(w.x, w.y)
            ctx.lineTo(EX, EY)
            ctx.stroke()
            ctx.closePath()

            r = 8
        }else{
            r = 5
        }
    }

    window.requestAnimationFrame(CreateLoop)
}
window.requestAnimationFrame(CreateLoop)