let Files = []
let Objects = []
let Jsons = []
let SELECTED = 0
let STAGE = 0
let ID;
let SET = {
    id: ID,
    name: "unknown",
    problems: [],
    tags: []
}
newID()

function findMatch(id){
    fetchSVG(1000)
    processProblems()
    let s
    if (id == undefined || id.length != 6 || isNaN(id)){
        return false
    }
    id = parse(id)
    for (let i=0; i<Jsons.length; i++){
        let p = Jsons[i]

        if (p.id == id){
            s = p
        }
    }
    setTimeout(()=>{
        if (s != null){
            SET = s
            Objects = s.problems
            if (typeof s.problems[0] == 'string'){
                problems = []
                for (let i=0; i<s.problems.length; i++){
                    problems.push(parse(s.problems[i]))
                }
                Objects = problems
            }
            ID = s.id
            tags = ``
            if (s.tags != undefined){
                tags = parse(s.tags)
                for (let i=0; i<tags.length; i++){
                    let tag = tags[i]
                }
            }
            Id('name').value = s.name
            Id('id').innerHTML = s.id
            Id('tags').value = tags
            console.log("ID (retrieved): " + ID)
            return true
        }else{
            alert('Invalid ID')
            return false
        }
    },100)
}

fetchSVG(1000)
processProblems()

if (window.location.search.length > 6){
    let s = window.location.search
    let searchID = s.substring(4,s.length)
    findMatch(searchID)
    console.log(searchID)

    setTimeout(()=>{
        Select(0)
        drawProblems()
    }, 100)
}

function Search(searchID){
    window.location.search = 'id=' + searchID
}

for (let i=0; i<Tag('canvas').length; i++){
    let c = Tag('canvas')[i]
    c.width = S
    c.height = S
}

function Resize(){
    Canvas.width = S
    Canvas.height = S
    for (let i=0; i<Tag('canvas').length; i++){
        let c = Tag('canvas')[i]
        c.width = S
        c.height = S
    }
}

function filesToObjects(){
    Objects=[]
    for (let i=0; i<Files.length; i++){
        let file = Files[i]
        Objects.push(fileToObject(file))
    }
    console.log('Converted Files[] To Objects[]')
}

function addToSet(){
    SET.problems = []
    for (let i=0; i<Objects.length; i++){
        let obj = Objects[i]
        SET.problems.push(objectToList(obj))
    }
    SET.tags = []
    let split = Id('tags').value.split(',')
    for (let i=0; i<split.length; i++){
        let tag = split[i].trim()
        SET.tags.push(tag)
    }
}

function drawProblems(){
    clearCanvases()
    for (let i=0; i<Objects.length; i++){
        let obj = Objects[i]
        if (Id(`input-${i+1}`) != undefined){
            drawFile(obj, Id(`input-${i+1}`), Id(`output-${i+1}`))
        }
    }
}

function scaleObjects(factor){
    for (let i=0; i<Objects.length; i++){
        let obj = Objects[i]
        scaleObject(obj,factor)
    }
}

function Clear(){
    Files = []
    Objects = []
    SET.problems = []
    drawProblems()
    Id('elems').innerHTML = ''
    Id('object').innerHTML = ''
    for (let i=0; i<Tag('canvas').length; i++){
        let canvas = Tag('canvas')[i]
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0,0,canvas.width, canvas.height)
    }
}

function Select(i){
    let row = Class('row')[i]
    if (i < Objects.length){
        for (let j=0; j<Class('row').length; j++){
            let other = Class('row')[j]
            other.classList.remove('selected')
        }
        row.classList.add('selected')
        SELECTED = i
        Log(Objects[SELECTED])
        addToSet()
    }
}

function Back(){
    Files = []
    STAGE = 0
}


function Submit(){
    if (Id('file').value.length > 0){
        let list = Id('file').files
        for (let i=0; i<list.length; i++){
            let file = list[i]
            let reader = new FileReader()
            reader.readAsText(file)
            reader.onload = () => {
                Files.push(`'${reader.result}'`)
                console.log(reader.result)
            }
        }
        setTimeout(()=>{
            filesToObjects()
            scaleObjects(5)
            Select(0)
            drawProblems()
        }, 100)
    }else{
        alert('please select a file')
    }
}

function Message(msg){
    let d = Id('message')
    d.innerHTML = msg
    d.style.top = '10px'
    setTimeout(()=>{
        d.style.top = '-60px'
    }, 2000)
}

function Save(){
    let string = objectToList(Objects[SELECTED])
    console.log(JSON.stringify(Objects[SELECTED][0]))
    Id('object').innerHTML = annotate(string.substring(1,string.length-1))
    if (Objects.length > 0){
        let html = htmlToObject()
        if (html.length > 0){
          Objects[SELECTED] = html
        }
    }
    addToSet()
    showColors()
    drawProblems()
}

// Interaction
Id('upload').onclick = () =>{
    if (SET.problems.length < 3){
        alert('Please enter at least 3 examples.')
    }else if (SET.name.length < 1){
        alert('Please enter a name.')
    }else{
        addToSet()
        uploadProblem(SET)
    }
}
Id('search').onclick = () => {
    Search(Id('searchbox').value)
}
Id('save').onclick = Save
Id('file').onchange = Submit
Id('new').onclick = newID
Id('clear').onclick = Clear

for (let i=0; i<Class('row').length; i++){
    let row = Class('row')[i]
    row.onclick = () => {
        Select(i)
    }
}

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'Enter':
            Search(Id('searchbox').value)
            break
        case 's':
            Save()
            break
    }
});

let SVGLoop = () => {
    if (Id('name').value.length > 0){
        SET.name = Id('name').value
    }
    window.requestAnimationFrame(SVGLoop)
}
window.requestAnimationFrame(SVGLoop)