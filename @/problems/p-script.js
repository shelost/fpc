const Main = Id('main')
const Controls = Id('controls')

var SHOW_3 = true
var SHOW_OUTPUT = true
var SHOW_NAME = true

var SLIDER = Id('image-size')

// INITIALIZE

SLIDER.value = (window.innerWidth-150)/12

if (window.innerWidth < 800){
    SLIDER.value = window.innerWidth/2.3
}

window.onload = () => {
    if (localStorage.getItem("reload") == 0){
        window.location.reload()
        localStorage.setItem("reload", 1)
    }
    setTimeout(()=> {
        localStorage.setItem("reload", 0)
    },1000)
}

// Show Problems

fetchProblems(24)

let Problems = []

let strArray = localStorage.getItem("Results").split('!,')

for (let i=0; i<strArray.length; i++){
    if (i == strArray.length-1 ){
        strArray[i] = strArray[i].substring(0, strArray[i].length-1)
    }
    Problems.push(JSON.parse(strArray[i]))
}

// Interaction

for (let i=0; i<Class('checkbox').length; i++){
    let cb = Class('checkbox')[i]

    cb.onclick = () => {
        cb.classList.toggle('selected')
    }
}

showResults()

// Sortable

var sortable = Sortable.create(Main,{
    animation: 150,
    dragoverBubble: true,
    disabled: false
});


/*
var sortable = Sortable.create(Controls,{
    animation: 150,
    dragoverBubble: true,
});
*/

const loop = () => {

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
        else{el.classList.add('hidden')}
    }
    for (let i=0; i<Class('output').length; i++){
        let el = Class('output')[i]
        if (SHOW_OUTPUT){ el.classList.remove('hidden')}
        else{el.classList.add('hidden')}
    }
    for (let i=0; i<Class('name').length; i++){
        let el = Class('name')[i]
        if (SHOW_NAME){ el.classList.remove('hidden')}
        else{el.classList.add('hidden')}
    }

    // Slider

    for (let i=0; i<Class('image').length; i++){
        let el = Class('image')[i]

        el.style.width = SLIDER.value + "px"
        el.style.height = SLIDER.value + "px"
        el.style.margin = SLIDER.value/50 + "px"
    }

    Id('image-size-value').innerHTML = SLIDER.value

    if (window.innerWidth > 800){
        sortable.option("disabled", false)
    }else{
        sortable.option("disabled", true)
    }

    window.requestAnimationFrame(loop)
}
setTimeout(()=>{
    window.requestAnimationFrame(loop)
}, 400)
