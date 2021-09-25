const freeCamCode = 16

//prevent user from holding 
var blockMouse=false

var brushSize = 1
var menuPos = 0
var menuBlockPool = []
var menuSelected = 0
var menuSelectedRender = 0
var menuSelectedText = null
var menuText = 0
var menuGlobal = 0

var tempData

var sText = null
var sTextSize = null
var sTextCol = null

var sGlobalPlay = null

var dom=false
var sBlockCol=null
var sBlockstcol=null
var sBlockstTop=null
var sBlockstBottom=null
var sBlockstLeft=null
var sBlockstRight=null
var sBlockA=null
var sBlockSpecial=null

var levelName = ''

function setupEdit() {
  blockMouse=true
  MODE = 'edit'
  exitPlay()
  menuPos = 0
  menuSelectedText = null
  menuText = 0
  desiredZoom = zoom
  camVel = createVector(0, 0)
  transition = 0
  sBlockA=createSlider(0,100,0,1)
  sBlockA.style('width',width/9+'px')
  sBlockA.position(windowWidth/2+width/2-width/7,(height/2-width/12)/1.32)
}

function exitEdit() {
  menuPos = 0
  menuText = 0
  menuGlobal = 0
  removeDOMText()
  removeDOMGlobal()
  removeDOMBlock()
}

function mainEdit() {
  // main loop for edit mode
  players = []
  freeCam()
  renderMainElements()
  place()
  resizeGridSmaller()
  correctBlocks()
  renderBlockMenu()
  renderGlobalMenu()
  renderTextMenu()
  //move text
  for (let t of txt) {
    t.update()
  }
}

function defaultBlockPool() {
  // all the default blocks in the menu
  menuBlockPool.push(new Tile(0, 0, 0, null, null, null, false, null))
  menuBlockPool.push(new Tile(0, 0, 0, color(76, 76, 76, 50), [0,0,0,0], color(0,0), false, null))
  menuBlockPool.push(new Tile(0, 0, 1, color(25), [3, 3, 3, 3], color(234), true, null))
  menuBlockPool.push(new Tile(0, 0, 2, color(255, 70, 0), [3, 3, 3, 3], color(250, 150, 0), true, null))
  menuBlockPool.push(new Tile(0, 0, 3, color(24, 151, 224, 120), [3, 3, 3, 3], color(60, 255, 255, 100), true, null))
  menuBlockPool.push(new Tile(0, 0, 4, color(0, 0), [5, 5, 5, 5], color(128, 64, 0), false, null))
  menuBlockPool.push(new Tile(0, 0, 5, null, [7, 7, 7, 7], color(0, 255, 0), true, null))
  menuBlockPool.push(new Tile(0, 0, 6, color(128, 100), [1, 1, 1, 1], color(192, 150), true, null))
  menuBlockPool.push(new Tile(0, 0, 7, null, [10, 10, 10, 10], color(255, 200, 0), true, 100))
  menuBlockPool.push(new Tile(0, 0, 8, color(128, 64, 0, 200), [3, 3, 3, 3], color(192, 96, 0, 200), true, null))
  menuBlockPool.push(new Tile(0, 0, 9, color(162, 45, 168, 100), [2, 2, 2, 2], color(255, 90, 255, 200), false, null))
  menuBlockPool.push(new Tile(0, 0, 10, null, [10, 10, 10, 10], color(128, 234, 255), true, null))
  menuBlockPool.push(new Tile(0, 0, 11, null, [6, 6, 6, 6], color(169, 59, 247), true, null))
  menuBlockPool.push(new Tile(0, 0, 12, color(166, 247, 79, 200), null, null, false, 100))
  menuBlockPool.push(new Tile(0, 0, 13, color(255, 255, 30, 200), [3, 3, 3, 3], color(255, 255, 200), false, 100))
  menuBlockPool.push(new Tile(0, 0, 14, color(255), [4, 4, 4, 4], color(255, 150), false, 100))
}

function createDOMText() {
  sText = createInput(menuSelectedText.txt)
  sText.input(setDOMText)
  sText.style('width', width * 0.4 + 'px')
  sText.style('height', height / 15 + 'px')
  sText.position(windowWidth / 2 - width / 2, 0)
  sTextSize = createSlider(0.5, 4, menuSelectedText.size, 0.1)
  sTextSize.style('width', width * 0.4 + 'px')
  sTextSize.style('height', height / 10 + 'px')
  sTextSize.input(setDOMText)
  sTextSize.position(windowWidth / 2 - width / 2 + width * 0.59, 0)
  sTextCol = createColorPicker(color(menuSelectedText.col))
  sTextCol.style('width', width * 0.15 + 'px')
  sTextCol.style('height', height / 15 + 'px')
  sTextCol.position(windowWidth / 2 - width / 2 + width * 0.42, 0)
  sTextCol.input(setDOMText)
}

function removeDOMText() {
  if (sText) {
    sText.remove()
    sTextSize.remove()
    sTextCol.remove()
  }
}

function setDOMText() {
  //set text paramaters according to DOM
  if (menuSelectedText) {
    menuSelectedText.txt = sText.value()
  }
  menuSelectedText.size = sTextSize.value()
  menuSelectedText.col = sTextCol.color()
}

function renderMainElements() {
  // renders : cursor, startpos and level border
  noFill()
  stroke(255)
  strokeWeight(zoom * 0.1)
  let m = getMousePos(true)
  rectMode(CENTER)
  let tc = false
  for (let t of txt) {
    if (t.collide(mouseX - width / 2, mouseY - height / 2)) {
      tc = true
      break
    }
  }
  if (!tc && !keyIsDown(freeCamCode) && mouseX < width - menuPos && mouseY > menuText && mouseX > menuGlobal && !blockMouse) {
    rect((m.x - 0.5 * (brushSize % 2 == 0) - cam.x) * zoom, (m.y - 0.5 * (brushSize % 2 == 0) - cam.y) * zoom, zoom * brushSize, zoom * brushSize)
  }
  stroke(255, 0, 0, 150)
  rectMode(CORNER)
  rect((-0.5 - cam.x) * zoom, (-0.5 - cam.y) * zoom, gsize.x * zoom, gsize.y * zoom)
  stroke(0, 255, 0, 150)
  rectMode(CENTER)
  rect((startPos.x - cam.x) * zoom, (startPos.y - cam.y) * zoom, zoom, zoom)
  fill(0, 255, 0, 150)
  noStroke()
  textSize(zoom)
  textAlign(CENTER, CENTER)
  text('S', (startPos.x - cam.x) * zoom, (startPos.y - cam.y) * zoom)
}

function createDOMGlobal() {
  sGlobalPlay = createButton('PLAY')
  sGlobalPlay.position(windowWidth / 2 - width / 2, 0)
  sGlobalPlay.style('width', width / 5 + 'px')
  sGlobalPlay.style('font-size',width/48+'px')
  sGlobalPlay.class('globalButton')
  sGlobalPlay.mousePressed(setupPlay)

  sGlobalSave = createButton('SAVE LEVEL AS')
  sGlobalSave.position(windowWidth / 2 - width / 2, width/26)
  sGlobalSave.style('width', width / 5 + 'px')
  sGlobalSave.style('font-size',width/48+'px')
  sGlobalSave.class('globalButton')
  sGlobalSave.mousePressed(saveLevelAsJSON)
  
  sGlobalName = createInput(levelName)
  sGlobalName.position(windowWidth / 2 - width / 2, width/15)
  sGlobalName.style('width', width / 5 + 'px')
  sGlobalName.style('font-size',width/48+'px')
  sGlobalName.class('globalInput')
  sGlobalName.input(changeName)
  
  sGlobalLoad = createFileInput(handleLoad)
    
  sGlobalLoad.position(windowWidth / 2 - width / 2, width/9.3)
  sGlobalLoad.style('font-size',width/48+'px')
  sGlobalLoad.class('custom-file-input')
  sGlobalLoad.style('width', width / 5 + 'px')
}
function handleLoad(file){
  levelName=file.name.substring(0,file.name.length-5)
  tempData=loadJSON(file.data,doneLoading)
}
function doneLoading(){
  loadLevelJSON(tempData)
  removeDOMGlobal()
  CreateDOMGlobal()
}

function changeName() {
  levelName = sGlobalName.value()
}

function removeDOMGlobal() {
  if (sGlobalPlay) {
    sGlobalPlay.remove()
    sGlobalPlay = null
    sGlobalSave.remove()
    sGlobalName.remove()
    sGlobalLoad.remove()
  }
}
  
function renderGlobalMenu() {
  fill(50, 200)
  noStroke()
  rectMode(CORNER)
  rect(-width / 2, -height / 2, menuGlobal, height)
  if (mouseX < menuGlobal + 5) {
    menuGlobal += (width / 5 - menuGlobal) / 5
  } else {
    menuGlobal += (0 - menuGlobal) / 5
  }
  if (abs(menuGlobal - width / 5) < 10) {
    if (sGlobalPlay == null) {
      createDOMGlobal()
    }
  } else {
    removeDOMGlobal()
  }
  fill(100, 100)
  rectMode(CENTER)
  let s = map(menuGlobal, 0, width / 5, 20, 0)
  rect(-width / 2 + menuGlobal + s / 2, 0, s, height / 6)
  textSize(50)
  textAlign(CENTER, CENTER)
  fill(100, map(menuGlobal, 0, width / 5, 255, 0))
  text('x', -width / 2 + menuGlobal + s / 2, -5)


}

function createDOMBlock(){
  if (menuSelected>=0){
    dom=true
    if (menuBlockPool[menuSelected].col){
      sBlockCol=createColorPicker(menuBlockPool[menuSelected].col)
      sBlockCol.style('width',width/12+'px')
      sBlockCol.style('height',width/8+'px')
      sBlockCol.class('blockColorPicker')
      sBlockCol.position(windowWidth/2+width/2-width/6,0)
      sBlockCol.input(updateDOMBlock)
      
      sBlockColA=createSlider(0,255,alpha(menuBlockPool[menuSelected].col),1)
      sBlockColA.class('vSlider')
      sBlockColA.style('width',width/12+'px')
      sBlockColA.position(windowWidth/2+width/2-width/6,(height/2-width/12)/4.25)
      sBlockColA.input(updateDOMBlock)
      
      if (sBlockA){
        sBlockA.show()
      }
      
    }
    if (menuBlockPool[menuSelected].stcol){
      sBlockstcol=createColorPicker(menuBlockPool[menuSelected].stcol)
      sBlockstcol.style('width',width/12+'px')
      sBlockstcol.style('height',width/8+'px')
      sBlockstcol.class('blockColorPicker')
      sBlockstcol.position(windowWidth/2+width/2-width/12,0)
      sBlockstcol.input(updateDOMBlock)
      
      sBlockstcolA=createSlider(0,255,alpha(menuBlockPool[menuSelected].stcol),1)
      sBlockstcolA.class('vSlider')
      sBlockstcolA.style('width',width/12+'px')
      sBlockstcolA.position(windowWidth/2+width/2-width/12,(height/2-width/12)/4.5)
      sBlockstcolA.input(updateDOMBlock) 
    }
    if (menuBlockPool[menuSelected].st){
      sBlockstTop=createSlider(0,10,menuBlockPool[menuSelected].st[0],1)
      sBlockstTop.style('width',width/12+'px')
      sBlockstTop.position(windowWidth/2+width/2-width/12-width/24,height/2-width/12)
      sBlockstTop.input(updateDOMBlock)
      if (![5,7,10,11].includes(menuBlockPool[menuSelected].type)){
        sBlockstBottom=createSlider(0,10,menuBlockPool[menuSelected].st[1],1)
        sBlockstBottom.style('width',width/12+'px')
        sBlockstBottom.position(windowWidth/2+width/2-width/12-width/24,height/2+width/22)
        sBlockstBottom.input(updateDOMBlock)
        sBlockstLeft=createSlider(0,10,menuBlockPool[menuSelected].st[3],1)
        sBlockstLeft.class('vSlider')
        sBlockstLeft.style('width',width/12+'px')
        sBlockstLeft.position(windowWidth/2+width/2-width/5.25,height/2.18)
        sBlockstLeft.input(updateDOMBlock)
        
        sBlockstRight=createSlider(0,10,menuBlockPool[menuSelected].st[2],1)
        sBlockstRight.class('vSlider')
        sBlockstRight.style('width',width/12+'px')
        sBlockstRight.position(windowWidth/2+width/2-width/16.25,height/2.18)
        sBlockstRight.input(updateDOMBlock)
      }
    }
    if (menuBlockPool[menuSelected].special){
      sBlockSpecial=createSlider(30,255,menuBlockPool[menuSelected].special,1)
      sBlockSpecial.style('width',width/9+'px')
      sBlockSpecial.position(windowWidth/2+width/2-width/7,(height/2+width/12))  
      sBlockSpecial.input(updateDOMBlock)
      
    }
  }
}
function removeDOMBlock(){
  if (sBlockA){
    sBlockA.hide()
  }
  dom=false
  if (sBlockCol){
    sBlockCol.remove()
    sBlockColA.remove()
  }
  if (sBlockstcol){
    sBlockstcol.remove()
    sBlockstcolA.remove()
  }
  if (sBlockstTop){
    sBlockstTop.remove()
  }
  if (sBlockstBottom){
    sBlockstBottom.remove()
  }
  if (sBlockstLeft){
    sBlockstLeft.remove()
  }
  if (sBlockstRight){
    sBlockstRight.remove()
  }
  if (sBlockSpecial){
    sBlockSpecial.remove()
  }
}
  
function updateDOMBlock(){
  if (menuBlockPool[menuSelected].col){
  menuBlockPool[menuSelected].col=color(red(sBlockCol.color()),green(sBlockCol.color()),blue(sBlockCol.color()),sBlockColA.value())
  }
  if (menuBlockPool[menuSelected].stcol){
  menuBlockPool[menuSelected].stcol=color(red(sBlockstcol.color()),green(sBlockstcol.color()),blue(sBlockstcol.color()),sBlockstcolA.value())
  }
  if (menuBlockPool[menuSelected].st){
    if ([5,7,10,11].includes(menuBlockPool[menuSelected].type)){
      menuBlockPool[menuSelected].st=[sBlockstTop.value(),sBlockstTop.value(),sBlockstTop.value(),sBlockstTop.value()]
    }else{
      menuBlockPool[menuSelected].st=[sBlockstTop.value(),sBlockstBottom.value(),sBlockstRight.value(),sBlockstLeft.value()]
    }
  }
  if (menuBlockPool[menuSelected].special){
    menuBlockPool[menuSelected].special=sBlockSpecial.value()
  }
}
  
function renderBlockMenu() {
  //render block selection menu
  fill(100, 200)
  noStroke()
  rectMode(CORNER)
  rect(width / 2 - menuPos, -height / 2, menuPos, height)
  fill(100, 100)
  rectMode(CENTER)
  let s = map(menuPos, 0, width / 6, 20, 0)
  rect(width / 2 - menuPos - s / 2, 0, s, height / 6)
  textSize(50)
  textAlign(CENTER, CENTER)
  fill(100, map(menuPos, 0, width / 6, 255, 0))
  text('<', width / 2 - menuPos - s / 2, -5)

  menuSelectedRender += (menuSelected - menuSelectedRender) / 5
  if (mouseX > width - menuPos - 5 && mouseY > menuText) {
    menuPos += (width / 6 - menuPos) / 5
  } else {
    menuPos += (0 - menuPos) / 5
  }
  for (let b = -1; b < menuBlockPool.length; b++) {
    let block = menuBlockPool[b]
    push()
    let sz = width / map(abs(menuSelectedRender - b), 0, 12, 12, 50)
    translate(width / 2 - menuPos + width / 12, (b - menuSelectedRender) * (sz + sz / 3))
    rectMode(CENTER)
    if (b == -1) {
      strokeWeight(sz / 10)
      stroke(0, 255, 0, 150)
      rect(0, 0, sz, sz)
      fill(0, 255, 0, 150)
      noStroke()
      textSize(sz)
      textAlign(CENTER, CENTER)
      text('S', 0, 0)
    } else if (b == 0) {
      stroke(255, 0, 0)
      strokeWeight(sz / 20)
      line(-sz / 2, -sz / 2, sz / 2, sz / 2)
      line(sz / 2, -sz / 2, -sz / 2, sz / 2)
    } else {
      if (block.col) {
        fill(block.col)
        rect(0, 0, sz, sz)
      }
      if (block.stcol) {
        stroke(block.stcol)
        strokeWeight(block.st[0] * sz / 40)
        if (![5, 7, 10, 11].includes(block.type)) {
          line(-sz / 2, -sz / 2, sz / 2, -sz / 2)
          strokeWeight(block.st[1] * sz / 40)
          line(-sz / 2, sz / 2, sz / 2, sz / 2)
          strokeWeight(block.st[2] * sz / 40)
          line(sz / 2, -sz / 2, sz / 2, sz / 2)
          strokeWeight(block.st[3] * sz / 40)
          line(-sz / 2, -sz / 2, -sz / 2, sz / 2)
        } else if (block.type == 11) {
          line(0, -sz / 2, 0, sz / 2)
        } else {
          line(-sz / 2, 0, sz / 2, 0)
        }
      }
    }
    pop()
  }
  fill(0, map(abs(menuSelected - menuSelectedRender), 0, 0.05, 200, 50))
  noStroke()
  rectMode(CORNER)
  rect(width / 2 - menuPos, width / 12, menuPos, height)
  rect(width / 2 - menuPos, -width / 12, menuPos, -height)
  fill(255, map(abs(menuSelected - menuSelectedRender), 0, 0.05, 200, 50))
  textSize(width/48)
  textAlign(LEFT,TOP)
  if (menuSelected!=-1 && menuBlockPool[menuSelected].col){
    text('Main color',width/2-menuPos,-width/6.5)
    textAlign(CENTER,TOP)
    text('Randomize brightness',width/2+width/12-menuPos,-width/9.5)
  }
  textAlign(RIGHT,TOP)
  if (menuSelected!=-1 && menuBlockPool[menuSelected].stcol){
  text('Border color',width/2+width/6-menuPos,-width/6.5)
  }
  if (menuSelected!=-1 && menuBlockPool[menuSelected].special){
    textAlign(CENTER,TOP)
    if (menuBlockPool[menuSelected].type!=13){
      text('Jumping Height',width/2+width/12-menuPos,width/9)
    }else{
      text('Speed',width/2+width/12-menuPos,width/9)
    }
  }
  
  if (abs(menuSelected - menuSelectedRender)<0.1 && abs(width/6-menuPos)<10){
     if (dom==false){
       createDOMBlock()
     }
  }else{
    removeDOMBlock()
  }

}

function renderTextMenu() {
  //render text editing menu
  fill(100, 200)
  noStroke()
  rectMode(CORNER)
  rect(-width / 2, -height / 2, width, menuText)
  if (menuSelectedText == null) {
    menuText += (0 - menuText) / 3
  } else {
    menuText += (height / 10 - menuText) / 3 
  }

}

function place() {
  //all the conditions for a block to be placed
  if (!keyIsDown(freeCamCode) && mouseX > menuGlobal && mouseX < width - menuPos && mouseY > menuText && mouseIsPressed && mouseButton == LEFT && !blockMouse) {
    if (mouseX < width - menuPos && mouseX > menuGlobal) {
      let m = getMousePos(true)
      if (menuSelectedText == null) {
        if (menuSelected == -1) {
          if (m.x >= 0 && m.y >= 0 && m.x < gsize.x && m.y < gsize.y && ![1, 2, 8, 14].includes(grid[m.y][m.x].type)) {
            startPos = m
            startPos = createVector(constrain(startPos.x, 0, gsize.x - 1), constrain(startPos.y, 0, gsize.y - 1))
          }
        } else if (menuSelected != 0) {
          resizeGridBigger(abs(min(0, m.x - floor(brushSize / 2))), abs(min(0, m.y - floor(brushSize / 2))), max(0, m.x - gsize.x + ceil(brushSize / 2)), max(0, m.y - gsize.y + ceil(brushSize / 2)))
          m = getMousePos(true)
          placeBlocks(menuBlockPool[menuSelected])
        } else {
          placeBlocks(menuBlockPool[menuSelected])
        }
      }
    } else {
      if (pmouseY - mouseY != 0) {
        menuSelected += (pmouseY - mouseY) / abs(pmouseY - mouseY)
      }
      menuSelected = constrain(menuSelected, 0, menuBlockPool.length - 1)
    }
  }
}

function placeBlocks(b) {
  //script for placing the blocks
  let m = getMousePos(true)
  for (let y = m.y - floor(brushSize / 2); y < m.y + ceil(brushSize / 2); y++) {
    for (let x = m.x - floor(brushSize / 2); x < m.x + ceil(brushSize / 2); x++) {
      if (x >= 0 && y >= 0 && x < gsize.x && y < gsize.y) {
        if (b.col){
          let br=random(-sBlockA.value(),sBlockA.value())
          let c=color(red(b.col)+br,green(b.col)+br,blue(b.col)+br,alpha(b.col))
        grid[y][x] = new Tile(x, y, b.type, c, b.st, b.stcol, b.onTop, b.special)  
        }else{
        grid[y][x] = new Tile(x, y, b.type, b.col, b.st, b.stcol, b.onTop, b.special)
        }
      }
    }
  }
}

function freeCam() {
  if (keyIsDown(freeCamCode) && mouseIsPressed && mouseButton == LEFT && mouseX > menuGlobal && mouseX < width - menuPos && mouseY > menuText) {
    camVel.x = (pmouseX - mouseX) / zoom
    camVel.y = (pmouseY - mouseY) / zoom
  }
  cam.add(camVel)
  camVel.mult(0.89)
  zoom += (desiredZoom - zoom) / 5
}

function getMousePos(round) {
  let mpos = createVector(mouseX - width / 2, mouseY - height / 2)
  let rpos = createVector((mpos.x / zoom) + cam.x, (mpos.y / zoom) + cam.y)
  if (round) {
    return createVector(floor(rpos.x + 0.5), floor(rpos.y + 0.5))
  } else {
    return createVector(rpos.x, rpos.y)
  }
}

function correctBlocks() {
  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      if ([5, 7, 10].includes(grid[y][x].type) && ((y != 0 && grid[y - 1][x].type != 1) && (y != gsize.y - 1 && grid[y + 1][x].type != 1) || y == 0 || y == gsize.y - 1)) {
        grid[y][x] = menuBlockPool[0]
      }
      if (grid[y][x].type == 11 && ((x != 0 && grid[y][x - 1].type != 1) && (x != gsize.x - 1 && grid[y][x + 1].type != 1) || x == 0 || x == gsize.x - 1)) {
        grid[y][x] = menuBlockPool[0]
      }
    }
  }
  startPos = createVector(constrain(startPos.x, 0, gsize.x - 1), constrain(startPos.y, 0, gsize.y - 1))
}

function resizeGridSmaller() {
  let yt = -1
  let yb = 0
  let xl = gsize.x - 1
  let xr = gsize.x - 1

  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      let g = grid[y][x]
      if (!(g.type == 0 && !g.col)) {
        if (yt == -1) {
          yt = y
        }
        yb = gsize.y - y - 1
        if (x < xl) {
          xl = x
        }
        if (gsize.x - x - 1 < xr) {
          xr = gsize.x - x - 1
        }
      }
    }
  }
  if (yt == -1) {
    yt = 0
  }
  while (xl + xr >= gsize.x) {
    xr--
  }
  while (yt + yb >= gsize.y) {
    yb--
  }

  //print('Top : '+yt+' Bottom : '+yb)
  //print('Right : '+xr+' Left : '+xl)
  let newGrid = []
  for (let y = 0; y < gsize.y - yb - yt; y++) {
    newGrid[y] = []
    for (let x = 0; x < gsize.x - xr - xl; x++) {
      let g = grid[y + yt][x + xl]
      newGrid[y][x] = new Tile(x, y, g.type, g.col, g.st, g.stcol, g.onTop, g.special)
    }
  }
  gsize.add(createVector(-xr - xl, -yt - yb))
  cam.add(createVector(-xl, -yt))
  startPos.add(createVector(-xl, -yt))
  for (let t of txt) {
    t.pos.add(createVector(-xl, -yt))
  }
  for (let p of particles) {
    p.pos.add(createVector(-xl, -yt))
  }
  grid = newGrid.slice()
  //print(newGrid)
}

function resizeGridBigger(xl, yt, xr, yb) {
  let newGrid = []
  for (let y = 0; y < gsize.y + yt + yb; y++) {
    newGrid[y] = []
    for (let x = 0; x < gsize.x + xr + xl; x++) {
      if (x < xl || x >= gsize.x + xl || y < yt || y >= gsize.y + yt) {
        newGrid[y][x] = new Tile(x, y, 0, null, null, null, false, null)
      } else {
        let g = grid[y - yt][x - xl]
        newGrid[y][x] = new Tile(x, y, g.type, g.col, g.st, g.stcol, g.onTop, g.special)
      }
    }
  }
  grid = newGrid.slice()
  gsize = createVector(newGrid[0].length, newGrid.length)
  startPos.add(createVector(xl, yt))
  cam.add(createVector(xl, yt))
  for (let t of txt) {
    t.pos.add(createVector(xl, yt))
  }
  for (let p of particles) {
    p.pos.add(createVector(xl, yt))
  }
}