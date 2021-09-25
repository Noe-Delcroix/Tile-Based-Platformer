class Tile {
  constructor(x, y, type, col, st,stcol, onTop,special) {
    this.pos = createVector(x, y)
    this.type = type
    this.col = col
    this.st = st
    this.stcol = stcol
    this.stTo = tilesStTo[type]
    this.onTop = onTop
    this.special=special
  }
  particle(){
    if (this.type==5 && y!=0 && grid[this.pos.y-1][this.pos.x].type==1 && random(0, 1) < 0.005){
      particles.push(new Particle(this.pos.x+random(-0.45,0.45), this.pos.y-0.48, 0, 0, 0.001, 0.005, 1, 1.1, this.stcol, this.stcol, random(0.15,0.25), 0, 50, 0))
    }
    if (this.type==14 && random(0,1)<0.25){
      particles.push(new Particle(this.pos.x+random(-0.4,0.4), this.pos.y+random(-0.4,0.4), -0.1, 0.1, -0.1, 0.1, 1, 1, this.col, this.col, random(0.3,0.4),0, 50, 2))
    }
    if (this.type==7){
      if (y!=0 && grid[this.pos.y-1][this.pos.x].type==1 && random(0, 1) < 0.1){
      particles.push(new Particle(this.pos.x+random(-0.45,0.45), this.pos.y-0.48, 0, 0, this.special/2400, this.special/2500, 1, 1, this.stcol, color(255), random(0.1,0.2), 0, 50, 0))
      }
      if (y!=gsize.y-1 && grid[this.pos.y+1][this.pos.x].type==1 && random(0, 1) < 0.1){
      particles.push(new Particle(this.pos.x+random(-0.45,0.45), this.pos.y+0.48, 0, 0, -this.special/2500, -this.special/2400, 1, 1, this.stcol, color(255), random(0.1,0.2), 0, 50, 0))
      }
    }
    if (this.type == 8 && random(0, 1) < 0.005) {
      particles.push(new Particle(this.pos.x+random(-0.4,0.4), this.pos.y+random(-0.4,0.4), 0, 0, 0, 0, 1, 1, this.col, this.col, 0, random(0.3,0.4), 100, 1))
    }
    if (this.type == 2 && random(0, 1) < 0.005) {
      particles.push(new Particle(this.pos.x+random(-0.4,0.4), this.pos.y+random(-0.4,0.4), 0, 0, -0.005, -0.01, 1, 1.01, this.col, this.stcol, random(0.2,0.3), 0, 150, 1))
    }
    if (this.type == 3 && y!=0 && grid[this.pos.y-1][this.pos.x].type==3 && random(0, 1) < 0.0025) {
      particles.push(new Particle(this.pos.x+random(-0.4,0.4), this.pos.y+random(-0.4,0.4), 0, 0, -0.005, -0.01, 1, 1.01, this.stcol, color(255,0), random(0.2,0.3), 0, 150, 1))
    }
    if (this.type==9 && random(1)<0.03){
      if (players.length>0){
      particles.push(new Particle(this.pos.x+random(-0.45,0.45), this.pos.y+random(-0.45,0.45), 0, 0, -0.01*players[0].g, -0.05*players[0].g, 1, 1, this.col, this.stcol, random(0.1,0.2), 0, 50, 0))
      }
    }
  }
  render() {
    rectMode(CENTER)
    fill(this.col)
    noStroke()
    rect((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, zoom, zoom)
    
    
  }
  renderOutline() {
    push()
    rectMode(CENTER)
    stroke(this.stcol)

    noFill()
    translate((this.pos.x - cam.x) * zoom - zoom / 2, (this.pos.y - cam.y) * zoom - zoom / 2)
    if (y != 0 && !this.stTo.includes(grid[y - 1][x].type)) {
      strokeWeight(this.st[0] * zoom / 40)
      line(0, 0, zoom, 0)
    }
    if (y != gsize.y - 1 && !this.stTo.includes(grid[y + 1][x].type)) {
      strokeWeight(this.st[1] * zoom / 40)
      line(0, zoom, zoom, zoom)
    }
    if (x != gsize.x - 1 && !this.stTo.includes(grid[y][x + 1].type)) {
      strokeWeight(this.st[2] * zoom / 40)
      line(zoom, 0, zoom, zoom)
    }
    if (x != 0 && !this.stTo.includes(grid[y][x - 1].type)) {
      strokeWeight(this.st[3] * zoom / 40)
      line(0, 0, 0, zoom)
    }
    pop()
  }
  
}