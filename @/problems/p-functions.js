function buildElem(obj){

    let string =
    `
    <div class = 'elem'>
        <div class = 'head'>
            <h1 class = 'name'> ${obj.name} </h1>
        </div>
        <div class = 'container'>
            <div class = 'example example-1'>
                <div class = 'image input' style="background-image: url('${obj.examples[0].input}')">
                </div>
                <div class = 'image output' style="background-image: url('${obj.examples[0].output}')">
                </div>
            </div>
            <div class = 'example example-2 example-secondary'>
                <div class = 'image input' style="background-image: url('${obj.examples[1].input}')">
                </div>
                <div class = 'image output' style="background-image: url('${obj.examples[1].output}')">
                </div>
            </div>
            <div class = 'example example-2 example-secondary'>
                <div class = 'image input' style="background-image: url('${obj.examples[2].input}')">
                </div>
                <div class = 'image output' style="background-image: url('${obj.examples[2].output}')">
                </div>
            </div>
            <div class = 'tags'>
                <h1 class = 'tag'> </h1>
            </div>
        </div>
    </div>
    `

    return string
}

function showResults(){

    let string = ``

    for (let i=0; i<Problems.length; i++){
        let elem = Problems[i]

        string += buildElem(elem)
    }

    Main.innerHTML = string
}