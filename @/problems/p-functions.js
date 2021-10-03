function buildElem(set){

    let s = set

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
            <div class = 'tags'>
                <h1 class = 'tag'> </h1>
            </div>
        </div>
    </div>
    `
    return string
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

function showResults(){
    let string = ``
    for (let i=0; i<Jsons.length; i++){
        let set = Jsons[i]
        string += buildElem(set)
    }
    Main.innerHTML = string
}

function drawProblems(){
    for (let i=0; i<Jsons.length; i++){
        let s = Jsons[i]
        let set = buildSet(s)

        for (let j=0; j<3; j++){
            let p = set.problems[j]
            let iCanvas = Id(`${s.id}-input-${j+1}`)
            let oCanvas = Id(`${s.id}-output-${j+1}`)

            p.drawInput(iCanvas, 7)
            p.drawOutput(oCanvas, 7)
        }
    }
}

function goToProblem(id){
    sessionStorage.setItem("linkID", id)
    sessionStorage.setItem("linked", "true")
    window.location = '../create'
}