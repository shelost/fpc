const Main = Id('main')
const Controls = Id('controls')
var SHOW_3 = true
var SHOW_OUTPUT = true
var SHOW_NAME = true
let Jsons = []
let Sets = []
var SLIDER = Id('image-size')

// INITIALIZE

function fullSize(){
    SLIDER.value = (window.innerWidth-150)/12.1

    if (window.innerWidth < 800){
        SLIDER.value = window.innerWidth/2.3
    }
}

window.onload = () => {
    if (localStorage.getItem("reload") == 0){
        window.location.reload()
        localStorage.setItem("reload", 1)
    }
    setTimeout(()=> {
        localStorage.setItem("reload", 0)
    },10)
}

// Retrieve, process, and build sets

console.log(localStorage.getItem('svg').length)

if (localStorage.getItem('svg').length > 5){
    processProblems()
    showResults()
    console.log(Jsons.length)
    Id('num-results').innerHTML = Sets.length + ' Results'
}else{
    fetchSVG(1000)

    setTimeout(()=>{
        processProblems()
        showResults()
        console.log(Jsons.length)
        Id('num-results').innerHTML = Sets.length + ' Results'
    },400)
}

// Interaction
for (let i=0; i<Class('checkbox').length; i++){
    let cb = Class('checkbox')[i]
    cb.onclick = () => {
        cb.classList.toggle('selected')
    }
}

// Sortable
var sortable = Sortable.create(Main,{
    animation: 150,
    dragoverBubble: true,
    disabled: false
});

Id('search-btn').onclick = Search

for (let i=0; i<Class('image').length; i++){
    let c = Class('image')[i]
    c.width = S
    c.height = S
}

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'Enter':
            Search()
            break
    }
});

function setLinks(){
    for (let i=0; i<Class('elem').length; i++){
        let elem = Class('elem')[i]
        let id = elem.id

        elem.onclick = () => {
            sessionStorage.setItem("searchID", id)
            setTimeout(()=>{
                window.location = '../svg'
            },200)
        }
    }
}


const ProblemsLoop = () => {

    setLinks()

    // Control Toggles
    if (Id('check-output').classList.contains('selected'))
    {SHOW_OUTPUT = true }else{SHOW_OUTPUT = false}
    if (Id('check-3ex').classList.contains('selected'))
    {SHOW_3 = true}else{SHOW_3 = false}
    if (Id('check-name').classList.contains('selected'))
    {SHOW_NAME = true}else{SHOW_NAME = false}

    // Toggle Effects
    for (let i=0; i<Class('example-secondary').length; i++){
        let el = Class('example-secondary')[i]
        if (SHOW_3){el.classList.remove('hidden')}
        else {el.classList.add('hidden')}
    }
    for (let i=0; i<Class('output').length; i++){
        let el = Class('output')[i]
        if (SHOW_OUTPUT){ el.classList.remove('hidden')}
        else{el.classList.add('hidden')}
    }
    for (let i=0; i<Class('head').length; i++){
        let el = Class('head')[i]
        if (SHOW_NAME){ el.classList.remove('hidden')}
        else{el.classList.add('hidden')}
    }

    let examples = 0, canvases = 0
    if (SHOW_3) { examples = 3 }else{ examples = 1 }
    if (SHOW_OUTPUT){ canvases = 2 }else{ canvases = 1 }
    let numActive = examples*canvases

    // Slider
    for (let i=0; i<Class('image').length; i++){
        let el = Class('image')[i]
        el.style.width = SLIDER.value + "px"
        el.style.height = SLIDER.value + "px"
        el.style.margin = SLIDER.value/50 + "px"
    }
    for (let i=0; i<Class('tags').length; i++){
        let el = Class('tags')[i]
        el.style.width = SLIDER.value*numActive*1.06 + "px"
    }

    Id('image-size-value').innerHTML = SLIDER.value
    if (window.innerWidth > 800){
        sortable.option("disabled", false)
    }else{
        sortable.option("disabled", true)
    }
    window.requestAnimationFrame(ProblemsLoop)
}

window.requestAnimationFrame(ProblemsLoop)