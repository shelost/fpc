function buildElem(set){

    let s = set

    let name = s.name

    name = name.replaceAll('/','<span class = "slash"> / </span>')

    let string =
    `
    <div class = 'elem' id = ${s.id}>
        <div class = 'head'>
            <h1 class = 'name'> ${s.name} </h1>
            <p class = 'id'> ${s.id} </p>
        </div>
        <div class = 'container'>
            <div class = 'example example-1'>
                <canvas class = 'image input' id = '${s.id}-input-1'></canvas>
                <canvas class = 'image output' id = '${s.id}-output-1'></canvas>
            </div>
            <div class = 'example example-2 example-secondary'>
                <canvas class = 'image input' id = '${s.id}-input-2'></canvas>
                <canvas class = 'image output' id = '${s.id}-output-2'></canvas>
            </div>
            <div class = 'example example-2 example-secondary'>
                <canvas class = 'image input' id = '${s.id}-input-3'></canvas>
                <canvas class = 'image output' id = '${s.id}-output-3'></canvas>
            </div>
        </div>
        <div class = 'tags'>

    `
    if (s.tags != undefined && s.tags.length > 4){
        let tags = parse(s.tags)
        for (let i=0; i<tags.length; i++){
            let tag = tags[i]
            if (tag != ''){
                string += `<h1 class = 'tag' style = 'background:${tagColor(tag)}'> ${tag} </h1>`
            }
        }
    }

    string += `</div> <div class = 'gradient'> </div></div>`

    return string
}

function processProblems(){
    Strings = localStorage.getItem('svg').split('!,')
    Jsons = []
    Sets = []
    for (let i=0; i<Strings.length; i++){
        if (i == Strings.length-1 ){
            Strings[i] = Strings[i].substring(0, Strings[i].length-1)
        }
        if (Strings[i].length > 0){
            Strings[i] = parse(Strings[i])
            Strings[i].problems = parse(Strings[i].problems)
            Jsons.push(Strings[i])
            Sets.push(Strings[i])
        }
    }
}

function showResults(){
    let string = ``
    for (let i=0; i<Sets.length; i++){
        let set = Sets[i]
        string += buildElem(set)
    }
    Main.innerHTML = string
    setTimeout(()=>{
        drawProblems()
        fullSize()
    }, 0)
}

function drawProblems(){
    for (let i=0; i<Sets.length; i++){
        let s = Sets[i]
        if (s.problems.length >= 3){
            console.log(s.name)
            for (let j=0; j<3; j++){
                let p = s.problems[j]
                let iCanvas = Id(`${s.id}-input-${j+1}`)
                let oCanvas = Id(`${s.id}-output-${j+1}`)
                drawFile(p, iCanvas, oCanvas)
            }
        }else{
        }
    }
}

function Search(query){
    if (query.length > 0){
        window.location.search = 'search=' + query
    }else{
        window.location.search = ''
    }
}

function Render(list){
    fetchSVG(1000)
    Sets = []
    let count = 0
    if (list.length > 0){
        for (let j=0; j<Jsons.length; j++){
            let json = Jsons[j]
            add = false
            for (let i=0; i<list.length; i++){
                let q = list[i]
                if (json.name.includes(q)){
                    add = true
                }else{
                    tags = parse(json.tags)
                    for (let k=0; k<tags.length; k++){
                        let tag = tags[k]
                        if (tag.includes(q)){
                            add = true
                        }
                    }
                }
            }
            if (add){
                let match = false
                for (let k=0; k<Sets.length; k++){
                    if (json.id == Sets[k].id){
                        match = true
                    }
                }
                if (!match){
                    Sets.push(json)
                    count++
                }
            }
        }
        showResults()
    }else{
        count = Jsons.length
        for (let i=0; i<Jsons.length; i++){
            let json = Jsons[i]
            Sets.push(json)
        }
        showResults()
    }

    let blurb = count + ' Results'
    if (count == 1){
        blurb = '1 Result'
    }
    Id('num-results').innerHTML = blurb
}

function tagColor(tag){
    c = 0

    colors = [
        '#B8FEFF', // 0 - blue
        '#B8FFB8', // 1 - green
        '#FFF0B2', // 2 - yellow
        '#FFDDF5', // 3 - pink
        '#EAD4FF', // 4 - indigo
    ]
    switch (tag){

        case 'multi-object':
            c = 4
            break
        case 'distractions':
            c = 4
            break

        case 'center-of-mass':
            c = 2
            break
        case 'center-of-regpoly':
            c = 2
            break
        case 'regular-polygon':
            c = 2
            break
        case 'midpoint':
            c = 2
            break
        case 'endpoint':
            c = 2
            break
        case 'intersection':
            c = 2
            break
        case 'screen-edge':
            c = 2
            break
        case 'vertex':
            c = 2
            break

        case 'parallel':
            c = 1
            break
        case 'perpendicular':
            c = 1
            break
        case 'tangent':
            c = 1
            break
        case 'angle':
            c = 1
            break
        case 'cardinal-direction':
            c = 1
            break
        case 'even-spacing':
            c = 1
            break
        case 'geometric-spacing':
            c = 1
            break
        case 'line-length':
            c = 1
            break
        case 'curve-length':
            c = 1
            break
        case 'edge-extension':
            c = 1
            break
        case 'angle-bisection':
            c = 1
            break


        case 'compound-object':
            c = 3
            break
        case 'multiple-objects':
            c = 3
            break
        case 'distraction':
            c = 3
            break

    }
    return colors[c]
}