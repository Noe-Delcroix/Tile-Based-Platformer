/* TO DO LIST
- Transition
- the owl block pool edit menu (sliders,...)
- block pool edition (pick a block, delete, save, load)
- text creation button
- background edition
- instructions in general settings
- CTRL+Z
*/


var MODE = 'play'

var cam
var camVel
var desiredZoom
var zoom = 0



var grid = []
var txt = []
var startPos
var gsize
var players = []
var levels = []
var bgColor
var particles = []

//0:air/start 1:solid 2:lava 3:water 4:semi-solid 5:slime 6:grid 7:jumppad 8:quicksand 9:gravity 10:ice 11:walljump 12:orb 13:speedboost 14:end
const tilesStTo = [
  [],
  [1, 5, 7, 11, 10],
  [1, 2, 8, 9],
  [1, 3, 2, 8, 6, 9],
  [1, 4],
  [0, 3, 2, 8, 5, 7, 6, 9, 11, 10, 14],
  [0, 1, 5, 7, 11],
  [0, 3, 2, 8, 5, 7, 6, 9, 11, 10, 14],
  [1, 3, 2, 8, 6, 9],
  [9],
  [0, 3, 2, 8, 5, 7, 6, 9, 11, 10, 14],
  [0, 3, 2, 8, 5, 7, 6, 9, 11, 10, 14],
  [],
  [13],
  [14]
]
const tileNames = ['Air', 'Solid', 'Lava', 'Water', 'Semi-solid', 'Slime', 'Grid', 'Jump Pad', 'Quicksand', 'Gravity changer', 'Walljump wall', 'Jump Orb', 'Speed boost', 'End Portal']


function preload() {
  levels.push(loadJSON('levels/1-1.json'))
  levels.push(loadJSON('levels/1-2.json'))
  levels.push(loadJSON('levels/1-3.json'))
  levels.push(loadJSON('levels/1-4.json'))
  levels.push(loadJSON('levels/1-5.json'))
  levels.push(loadJSON('levels/2-1.json'))
  levels.push(loadJSON('levels/2-2.json'))
  levels.push(loadJSON('levels/2-3.json'))
  levels.push(loadJSON('levels/2-4.json'))
  levels.push(loadJSON('levels/2-5.json'))
  font1 = loadFont('Ressources/mini_pixel-7.ttf')
}

function setup() {
  let canvasSize = createVector(1, 0)
  while (canvasSize.x < windowWidth && canvasSize.y < windowHeight) {
    canvasSize.x++
    canvasSize.y = canvasSize.x * 9 / 16
  }
  var canvas = createCanvas(canvasSize.x, canvasSize.y)
  canvas.position(windowWidth / 2 - width / 2, 0)
  cam = createVector(0, 0)
  particles = []
  loadLevelJSON(levels[1])
  textFont(font1)
  createPlayers()
  camMovements(1, 1, 1)
  setupPlay()
  defaultBlockPool()
}


function saveLevelAsJSON() {
  if (levelName.length > 0) {
    let json = {
      levelSize: {
        x: gsize.x,
        y: gsize.y
      },
      background: [red(bgColor), green(bgColor), blue(bgColor), alpha(bgColor)],
      startPos: {
        x: startPos.x,
        y: startPos.y
      },
      levelData: [],
      texts: []
    }
    for (let y = 0; y < gsize.y; y++) {
      for (let x = 0; x < gsize.x; x++) {
        let g = grid[y][x]
        let col
        if (g.col) {
          col = [red(g.col), green(g.col), blue(g.col), alpha(g.col)]
        } else {
          col = null
        }
        let stcol
        if (g.stcol) {
          stcol = [red(g.stcol), green(g.stcol), blue(g.stcol), alpha(g.stcol)]
        } else {
          stcol = null
        }
        json.levelData.push({
          x: x,
          y: y,
          type: g.type,
          col: col,
          st: g.st,
          stcol: stcol,
          onTop: g.onTop,
          special: g.special
        })
      }
    }
    for (let t of txt) {
      json.texts.push({
        x: t.pos.x,
        y: t.pos.y,
        txt: t.txt,
        size: t.size,
        col: [red(t.col), green(t.col), blue(t.col), alpha(t.col)]
      })
    }
    saveJSON(json, levelName + '.json')
  }else{
    levelName='Enter a name'
    removeDOMGlobal()
    createDOMGlobal()
  }
}

function loadLevelJSON(json) {
  txt = []
  grid = []
  gsize = createVector(json.levelSize.x, json.levelSize.y)
  bgColor = color(json.background[0], json.background[1], json.background[2], json.background[3])
  startPos = createVector(json.startPos.x, json.startPos.y)
  for (let y = 0; y < gsize.y; y++) {
    grid[y] = []
    for (let x = 0; x < gsize.x; x++) {
      let t = json.levelData[y * gsize.x + x]
      let col
      if (t.col) {
        col = color(red(t.col), green(t.col), blue(t.col), alpha(t.col))
      } else {
        col = null
      }
      let stcol
      if (t.stcol) {
        stcol = color(red(t.stcol), green(t.stcol), blue(t.stcol), alpha(t.stcol))
      } else {
        stcol = null
      }
      grid[y][x] = new Tile(t.x, t.y, t.type, col, t.st, stcol, t.onTop, t.special)
    }
  }
  for (let t of json.texts) {
    txt.push(new Text(t.x, t.y, t.txt, t.size, color(t.col[0], t.col[1], t.col[2], t.col[3])))
  }
}

function renderGrid(type, outline) {
  for (y = floor(cam.y) - floor(height / zoom / 2) - 1; y <= ceil(cam.y) + ceil(height / zoom / 2); y++) {
    for (x = floor(cam.x) - floor(width / zoom / 2) - 1; x <= ceil(cam.x) + ceil(width / zoom / 2); x++) {
      if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
        if (grid[y][x].onTop == type) {
          if (outline) {
            grid[y][x].particle()
            if (grid[y][x].st) {
              grid[y][x].renderOutline()
            }
          } else if (grid[y][x].col) {
            grid[y][x].render()
          }
        }
      }
    }
  }
}


function mainGlobal() {
  renderGlobal()
}

function renderGlobal() {
  background(bgColor)
  renderGrid(false, false)
  renderGrid(false, true)
  for (let pa = particles.length - 1; pa >= 0; pa--) {
    particles[pa].render()
    particles[pa].update()
    if (particles[pa].delete || pa < length - 100) {
      particles.splice(pa, 1)
    }
  }
  for (let t = txt.length - 1; t >= 0; t--) {
    txt[t].render()
    if (txt[t].del) {
      txt.splice(t, 1)
    }
  }
  for (let p = players.length - 1; p >= 0; p--) {
    players[p].update()
    if (players[p].delete) {
      players.splice(p, 1)
    }
  }
  renderGrid(true, false)
  renderGrid(true, true)
}

function draw() {
  translate(width / 2, height / 2)
  mainGlobal()

  if (MODE == 'play') {
    mainPlay()
  } else if (MODE == 'edit') {
    mainEdit()
  }
}

function mouseWheel(event) {
  if (MODE == 'edit') {
    if (keyIsDown(16)) {
      desiredZoom -= desiredZoom / event.delta * 50
      desiredZoom = constrain(desiredZoom, 2, min(width, height))
    } else if (mouseX < width - menuPos) {
      brushSize -= event.delta / abs(event.delta)
      brushSize = constrain(brushSize, 1, min(gsize.x, gsize.y))
    } else {
      menuSelected += event.delta / abs(event.delta)
      menuSelected = constrain(menuSelected, -1, menuBlockPool.length - 1)
    }
  }
}

function mousePressed() {
  if (MODE == 'edit' && mouseButton == LEFT && mouseY > menuText && mouseX > menuGlobal && mouseX < width - menuPos && !keyIsDown(freeCamCode)) {
    if (menuSelectedText) {
      removeDOMText()
    }
    menuSelectedText = null
    for (let t of txt) {
      if (t.collide(mouseX - width / 2, mouseY - height / 2)) {
        menuSelectedText = t
        blockMouse=true
        createDOMText()
        break
      }
    }
  }
}
  
function mouseReleased(){
  if (menuSelectedText==null){
    blockMouse=false
  }
}