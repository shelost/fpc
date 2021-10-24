localStorage.setItem('svg',0)
sessionStorage.setItem('searchID', 'null')
console.log(sessionStorage.getItem('searchID'))

let Jsons = []
let Problems = []
let index = 0
fetchSVG(1000)

let p =
[{
    "type":"path",
    "stage":0,"commands":[["M",460,300],["s",-340,-360,-320,-30,255,50,290,-55]],
    "rgb":[255,85,0]},{"type":"path","stage":0,
    "commands":[["M",590,515],["s",435,280,145,345,25,-365,25,-365]],
    "rgb":[255,85,0]
},{
    "type":"line",
    "stage":1,
    "start":[265,275],
    "end":[710,740],
    "rgb":[6,249,255]
},{
    "type":"path",
    "stage":0,
    "commands":[["M",400,765],["s",-345,-200,-295,-20,175,110,175,110]],
    "rgb":[255,85,0]
},{
    "type":"path",
    "stage":0,
    "commands":[["M",620,160],["s",55,235,180,55,-65,-55,-65,-55]],
    "rgb":[255,85,0]
}]

drawFile(p, Id('input'), Id('output'))

setTimeout(()=>{
    processProblems()
    console.log(Jsons)

    for (let i=0; i<Jsons.length; i++){
        let set = Jsons[i]
        for (let j=0; j<set.problems.length; j++){
            let prob = set.problems[j]
            Problems.push(prob)
        }
    }
    setInterval(()=>{
        index = Math.floor(Math.random()*Problems.length)
        drawFile(Problems[index], Id('input'), Id('output'))
    },1000)
},300)

