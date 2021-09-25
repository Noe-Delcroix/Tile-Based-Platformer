var transition = 0

var loaded

var editButton=null

function setupPlay(){
  MODE='play'
  exitEdit()
  createPlayers()
  camMovements(1, 1, 1)
  editButton=createButton('||')
  editButton.position(windowWidth / 2 - width / 2,0)
  editButton.class('playButton')
  editButton.style('font-size',width/48+'px')
  editButton.mousePressed(setupEdit)
}
function exitPlay(){
  if (editButton){
    editButton.remove()
  }
}

function mainPlay(){
    // fill(255)
    // stroke(bgColor)
    // strokeWeight(zoom * 0.1)
    // textSize(20)
    // textAlign(LEFT, TOP)
    // textFont(font1)
    // text('Test Mode', -width/2 + 5, -height / 2)
    textAlign(RIGHT, TOP)
    if (players.length == 0) {
      if (transition > 254) {
        reset()
      } else {
        transition += (255 - transition) / 10
      }
      renderTransition(50, true)
    } else {
      renderTransition(50, false)
      transition += (0 - transition) / 10
      camMovements(20, 20, 80)
    }
}

function reset(level) {
  MODE = 'edit'
  exitPlay()
  setupEdit()
}

function createPlayers() {
  players.push(new Player(-100, -100, 0.7, 0.7, color(216, 15, 15), [90, 81, 83, 68]))
  //players.push(new Player(-100, -100, 0.7, 0.7, color(33, 198, 64), [38, 37, 40, 39]))
  //players.push(new Player(-100, -100, 0.7, 0.7, color(0, 144, 255), [73, 74, 75, 76]))
}


function camMovements(xspeed, yspeed, zoomspeed) {
  let bounds = getPlayersBounds()
  let desiredPos = createVector(bounds[0] + bounds[2] / 2, bounds[1] + bounds[3] / 2)
  cam.x += (desiredPos.x - cam.x) / xspeed
  cam.y += (desiredPos.y - cam.y) / yspeed

  let desiredZoom = 0
  desiredZoom = constrain(min(width / (bounds[2] + 8), height / (bounds[3] + 8)), getMinZoom(), width * 40 / 710)
  zoom += (desiredZoom - zoom) / zoomspeed


  if (cam.x < width / zoom / 2 - 0.5) {
    cam.x = width / zoom / 2 - 0.5
  } else if (cam.x > gsize.x - 0.5 - (width / zoom / 2)) {
    cam.x = gsize.x - 0.5 - (width / zoom / 2)
  }
  if (cam.y < height / zoom / 2 - 0.5) {
    cam.y = height / zoom / 2 - 0.5
  } else if (cam.y > gsize.y - 0.5 - (height / zoom / 2)) {
    cam.y = gsize.y - 0.5 - (height / zoom / 2)
  }

}

function getMinZoom() {
  if (gsize.x > gsize.y) {
    return height / gsize.y
  } else {
    return width / gsize.x
  }
}

function getPlayersBounds() {
  //return a rectangle : [x,y,w,h] rectMode : CORNER
  let smallestX = Infinity
  let smallestY = Infinity
  for (let p of players) {
    if (p.pos.x < smallestX) {
      smallestX = p.pos.x
    }
    if (p.pos.y < smallestY) {
      smallestY = p.pos.y
    }
  }
  let HighestW = -1
  let HighestH = -1
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      let w = abs(players[i].pos.x - players[j].pos.x)
      let h = abs(players[i].pos.y - players[j].pos.y)
      if (w > HighestW) {
        HighestW = w
      }
      if (h > HighestH) {
        HighestH = h
      }
    }
  }

  return [smallestX, smallestY, HighestW, HighestH]
}

function renderTransition(res, type) {
  push()
  translate(-width / 2, -height / 2)
  noStroke()
  rectMode(CORNER)
  let maxrect = 10
  if (type) {
    for (let i = 0; i < maxrect; i++) {
      fill(map(i, 0, maxrect - 1, 255, 0))
      rect(0, 0, width, map(transition, map(i, 0, maxrect, 0, 200), 250, 0, height))
    }
  } else {
    for (let i = 0; i < maxrect; i++) {
      fill(map(i, 0, maxrect - 1, 255, 0))
      rect(0, height, width, map(transition, 0, 250 - map(i, 0, maxrect, 200, 0), 0, -height))
    }
  }
  pop()
}