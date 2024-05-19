let dimSquare = 10;

const $canvas = document.getElementById("myCanvas")
const $config = document.getElementById("config")
const $color = document.getElementById("color")
const $previous = document.getElementById("previous")
const $play = document.getElementById("submit")
const $pause =document.getElementById("pause")
const $next = document.getElementById("next")
const $clear = document.getElementById("clear")

const ctx = $canvas.getContext("2d")
let cellColor = $color.value
let nbrLine = Math.floor(($canvas.clientHeight+1)/dimSquare)
let nbrCol = Math.floor(($canvas.clientWidth+1)/dimSquare)
let interval
let turn = 0

let history = []
history.push(initWorld())
drawBoard(history[turn])

$canvas.addEventListener("mousedown", function (event) {
    const rect = this.getBoundingClientRect()
    const x = Math.floor((event.clientX-rect.left)/dimSquare)
    const y = Math.floor((event.clientY-rect.top)/dimSquare)
    history[turn][y][x]=!history[turn][y][x]
    if (turn != history.length-1){
        history = history.slice(0, turn+1)
    }
    drawBoard(history[turn])
})

$color.addEventListener("input",function(){
    cellColor=this.value
    drawBoard(history[turn])
})

$previous.addEventListener("click",(event)=>{
    event.preventDefault()
    if (turn > 0){
        turn--
    }
    drawBoard(history[turn])
})

$config.addEventListener("submit",(event) =>{
    event.preventDefault()
    $previous.disabled = true
    $play.disabled = true
    $pause.disabled = false
    $next.disabled = true
    if (turn != history.length-1){
        history = history.slice(0, turn+1)
    }
    interval=setInterval(runTheLife, 100)
})

$pause.addEventListener("click",(event)=>{
    event.preventDefault()
    $previous.disabled = false
    $play.disabled = false
    $pause.disabled = true
    $next.disabled = false
    clearInterval(interval)
})

$clear.addEventListener("click",(event)=>{
    event.preventDefault()
    $previous.disabled = false
    $play.disabled = false
    $pause.disabled = true
    $next.disabled = false
    history = []
    turn = 0
    history[turn] = initWorld()
    drawBoard(history[turn])
    clearInterval(interval)
})

$next.addEventListener("click",(event)=>{
    event.preventDefault()
    if (turn == history.length-1){
        history.push(updateWorld(history[turn]))
    }
    turn++
    drawBoard(history[turn])
})

function initWorld() {
    const board = []
    for (let i = 0; i < nbrLine; i++) {
        board[i]=[]
        for (let j = 0; j < nbrCol; j++) {
            board[i][j]=false
        }
    }
    return board
}

function runTheLife() {
    history.push(updateWorld(history[turn]))
    turn++
    drawBoard(history[turn])
}

function drawBoard(world) {
    let nbrLine = world.length
    let nbrCol = world[0].length
    drawGrid(nbrLine, nbrCol)
    for (let i = 0; i < nbrLine; i++) {
        for (let j = 0; j < nbrCol; j++) {
            if (world[i][j]) {
                fillSquare(i,j,cellColor)
            }else{
                fillSquare(i,j,"white")
            }
        }
    }
}

function drawGrid(lines, col) {
    ctx.beginPath()
    for (let i = 1; i < nbrLine; i++) {
        ctx.moveTo(0, i*dimSquare)
        ctx.lineTo($canvas.clientWidth, i*dimSquare)
    }
    for (let i = 1; i < nbrCol; i++) {
        ctx.moveTo(i*dimSquare, 0)
        ctx.lineTo(i*dimSquare, $canvas.clientHeight)
    }
    ctx.stroke()    
}

function fillSquare(line, col, color) {
    ctx.fillStyle = color
    ctx.fillRect(col*dimSquare, line*dimSquare, dimSquare-1, dimSquare-1)
    ctx.strokeRect(col*dimSquare, line*dimSquare, dimSquare, dimSquare)
}

function updateWorld(world) {
    const newBoard=[]
    for (let i = 0; i < world.length; i++) {
        newBoard[i]=[]
        for (let j = 0; j < world[i].length; j++) {
            const nbNeighbours = countNeighbours(world,i,j)
            switch (nbNeighbours) {
                case 2:
                    newBoard[i][j]=world[i][j]
                    break;
                case 3:
                    newBoard[i][j]=true
                    break;
            
                default:
                    newBoard[i][j]=false
                    break;
            }
        }
    }
    return newBoard
}

function countNeighbours(world, y, x) {
    let yMin
    let yMax
    let xMin
    let xMax
    let number = 0

    yMin = y>0 ? y-1 : 0
    yMax = y<nbrLine-1 ? y+1 : nbrLine-1
    xMin = x>0 ? x-1 : 0
    xMax = x<nbrCol-1 ? x+1 : nbrCol-1

    for (let i = yMin; i <= yMax; i++){
        for (let j = xMin; j <= xMax; j++) {
            if (world[i][j] && (i!=y || j!=x)){
                number++
            }
        }
    }
    return number
}