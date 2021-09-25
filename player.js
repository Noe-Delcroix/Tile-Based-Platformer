class Player {
  constructor(x, y, sx, sy, col, keys) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.size = createVector(sx, sy)
    this.col = color(red(col), green(col), blue(col), 0)
    this.keys = keys
    this.g = 1
    this.switchG = 0
    this.wallJumpSide = 0
    this.delete=false
    this.die()
  }
  update() {
    if (alpha(this.col) == 255) {
      if (this.collide(3)!=false) {
        this.physicsWater(0.001, 0.15, 0.003)
        this.physicsLeftRight(0.01, 0.9, null, null)
        this.wallJumpSide = 0
      } else if (this.collide(8)!=false) {
        this.physicsWater(-0.05, 0.01, 0)
        this.physicsLeftRight(0.01, 0.7, null, null)
        this.wallJumpSide = 0
        if (this.collide(0)==false && this.collide(6)==false && this.collide(3)==false) {
          particles.push(new Particle(this.pos.x, this.pos.y, this.vel.x, this.vel.x, this.vel.y, this.vel.y, 0.9, 0.9, color(this.col), color(red(this.col), green(this.col), blue(this.col), 0), this.size.x, this.size.x/4, 50, 0))
          this.die()
        }
      } else if (this.collide(5)!=false) {
        this.physicsGround(0.01, 0.5, 0.05, true)
        this.physicsLeftRight(0.02, 0.8, null, null)
        this.wallJumpSide = 0
      } else if (this.collide(6)!=false) {
        this.physicsUpDown(0.03, 0.8, null, null)
        this.physicsLeftRight(0.03, 0.8)
        this.wallJumpSide = 0
      } else {
        if (this.collide(7)!=false && this.touchGround()) {
          this.vel.y = -this.g * this.collide(7)/255
        }
        if (this.collide(9)!=false) {
          this.switchG++
        } else {
          this.switchG = 0
        }
        if (this.collide(11)!=false) {
          this.physicsLeftRight(0.04 + this.collide(13)/1000 * (this.collide(13)!=false), 0.8, 0.2, 0.262)
        } else if (this.collide(10)!=false) {
          this.physicsLeftRight(0.005 + this.collide(13)/1000 * (this.collide(13)!=false), 0.98, null, null)
        } else {
          this.physicsLeftRight(0.04 + this.collide(13)/1000 * (this.collide(13)!=false), 0.8, null, null)
        }
        if (this.collide(12)!=false && this.vel.y * this.g > -0.05 && keyIsDown(this.keys[0])) {
          for (let i=0;i<random(8,12);i++){
            particles.push(new Particle(this.pos.x, this.pos.y, -0.05, 0.05, -0.05, 0.08, 0.98, 0.98, color(255,200), color(255,100), 0.5, 0, random(50,70), 2))
          }
          this.vel.y = -this.g * this.collide(12)/400
        }
        this.physicsGround(0.01, 0.5, 0.259, false)

      }
      if (this.collide(14)!=false){
        for (let i=0;i<20;i++){
          particles.push(new Particle(this.pos.x, this.pos.y, -0.15, 0.15, -0.15, 0.15, 0.96, 0.96, color(red(this.col),green(this.col),blue(this.col),255), color(red(this.col),green(this.col),blue(this.col),0), 0.4, 0.3, 100, 0))
        }
        this.delete=true
      }
      if (this.collide(2)!=false) {
        for (let i=0;i<random(10,15);i++){
          particles.push(new Particle(this.pos.x, this.pos.y, -0.02, 0.02, 0, -0.01, 1, 1.05, color(200,150), color(150,0), 0.3, 0, random(50,70), 0))
        }
        particles.push(new Particle(this.pos.x, this.pos.y, this.vel.x, this.vel.x, this.vel.y, this.vel.y, 0.8, 0.8, color(50), color(0,0), this.size.x, this.size.x, 50, 0))
        this.die()
      }
      if (this.touchGround() && abs(this.vel.x)>0.01 && random(0,1)<0.5){
      particles.push(new Particle(this.pos.x, this.pos.y+this.size.y/2*this.g, -0.01, 0.01, -this.g/30, -this.g/20, 1, 0.9, color(red(this.col),green(this.col),blue(this.col),150), color(red(this.col),green(this.col),blue(this.col),0), 0.2, 0.2, 25, 0))
        
      }
      if (this.collide(13)!=false && abs(this.vel.x)>0){
        particles.push(new Particle(this.pos.x, this.pos.y, -this.vel.x/2.5, -this.vel.x/3, -0.02, 0.02, 0.9, 1, color(red(this.col),green(this.col),blue(this.col),255), color(red(this.col),green(this.col),blue(this.col),0), 0.5, 0.1, 25, 0))
      }
      if ((this.pos.y > gsize.y + 1 && this.g == 1) || (this.pos.y < -1 && this.g == -1)) {
        this.die()
      }

      if (this.switchG == 1) {
        this.g *= -1
      }
    }else{
      this.col = color(red(this.col), green(this.col), blue(this.col),alpha(this.col)+5)
    }
    this.render()
  }
  die() {
    this.col = color(red(this.col), green(this.col), blue(this.col), 0)
    this.pos = createVector(startPos.x, startPos.y)
    this.vel = createVector(0, 0)
    this.g = 1

  }

  render() {
    push()
    translate((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom)
    rectMode(CENTER)
    fill(this.col)
    noStroke()
    rect(0,0, this.size.x * zoom - abs(this.vel.y) / 2 * zoom, this.size.y * zoom + abs(this.vel.y) / 2 * zoom)
    stroke(0,alpha(this.col))
    strokeWeight(this.size.x*zoom*0.15)
    translate(map(constrain(this.vel.x,-0.1,0.1),-0.1,0.1,-this.size.x/6*zoom,this.size.x/6*zoom),map(this.vel.y,-0.2,0.2,-this.size.x/6*zoom,this.size.x/6*zoom))
    if (this.g==1){
    line(-this.size.x/5*zoom,-this.size.y/5*zoom,-this.size.x/5*zoom,this.size.y/20*zoom)
    line(this.size.x/5*zoom,-this.size.y/5*zoom,this.size.x/5*zoom,this.size.y/20*zoom)
    }else{
    line(-this.size.x/5*zoom,-this.size.y/20*zoom,-this.size.x/5*zoom,this.size.y/5*zoom)
    line(this.size.x/5*zoom,-this.size.y/20*zoom,this.size.x/5*zoom,this.size.y/5*zoom)  
      
    }
    pop()
  }
  physicsLeftRight(speed, friction, wjHorizontal, wjVertical) {
    if (abs(this.wallJumpSide) <= 1) {
      if (this.wallJumpSide == 1) {
        this.vel.x += keyIsDown(this.keys[3]) * speed / 2 + keyIsDown(this.keys[1]) * -speed * 1.2
      } else if (this.wallJumpSide == -1) {
        this.vel.x += keyIsDown(this.keys[3]) * speed * 1.2 + keyIsDown(this.keys[1]) * -speed / 2
      } else {
        this.vel.x += keyIsDown(this.keys[3]) * speed + keyIsDown(this.keys[1]) * -speed
      }
      this.vel.x *= friction
    }
    this.pos.x += this.vel.x

    if (this.touchGround()) {
      this.wallJumpSide = 0
    } else if (abs(this.wallJumpSide) > 1) {
      this.wallJumpSide -= abs(this.wallJumpSide) / this.wallJumpSide
    }

    if (this.collide(1)!=false) {
      while (this.collide(1)!=false) {
        this.pos.x += abs(this.vel.x) / this.vel.x * -1 / zoom
      }


      if (!this.touchGround() && wjHorizontal && wjVertical && abs(this.wallJumpSide) / this.wallJumpSide != abs(this.vel.x) / this.vel.x) {
        if (this.vel.y > 0) {
          this.vel.y *= 0.85
          if (keyIsDown(this.keys[1])){
          particles.push(new Particle(this.pos.x-this.size.x/2, this.pos.y, -0.01, 0.01, -0.01, 0.01, 1, 1, color(red(this.col),green(this.col),blue(this.col),150), color(red(this.col),green(this.col),blue(this.col),0), 0.2, 0.2, 25, 0))
          }else if (keyIsDown(this.keys[3])){
            particles.push(new Particle(this.pos.x+this.size.x/2, this.pos.y, -0.01, 0.01, -0.01, 0.01, 1, 1, color(red(this.col),green(this.col),blue(this.col),150), color(red(this.col),green(this.col),blue(this.col),0), 0.2, 0.2, 25, 0))
          }
        }

        if (keyIsDown(this.keys[0])) {
          this.wallJumpSide = abs(this.vel.x) / this.vel.x * 10
          this.vel.x = abs(this.vel.x) / this.vel.x * -wjHorizontal
          this.vel.y = (-this.g * wjVertical)
        }
      }
    }
  }
  touchGround() {
    this.pos.y += this.g * 0.05
    this.pos.x -= this.vel.x
    if (this.collide(1)!=false) {
      this.pos.y -= this.g * 0.05
      this.pos.x += this.vel.x
      return true
    } else {
      this.pos.y -= this.g * 0.05
      this.pos.x += this.vel.x
      return false
    }

  }

  physicsUpDown(speed, friction) {
    this.vel.y += (keyIsDown(this.keys[2]) * speed + keyIsDown(this.keys[0]) * -speed) * this.g
    this.vel.y *= friction
    this.pos.y += this.vel.y
    if (this.collide(1)!=false) {
      while (this.collide(1)!=false) {
        this.pos.y += abs(this.vel.y) / this.vel.y * -1 / zoom
      }
    }
  }


  physicsGround(gravity, verticalSpeed, jumpHeight, ceillingStick) {
    if (this.vel.y < verticalSpeed) {
      this.vel.y += this.g * gravity
    }
    this.pos.y += this.vel.y
    if (this.collide(1)!=false || this.semiSolidCollide()) {
      while (this.collide(1)!=false || this.semiSolidCollide()) {
        this.pos.y += abs(this.vel.y) / this.vel.y * -1 / zoom
      }
      this.vel.y = (keyIsDown(this.keys[0]) && (abs(this.vel.y) / this.vel.y == this.g || ceillingStick)) * (-this.g * jumpHeight)
    }
  }
  semiSolidCollide() {
    this.pos.y -= this.g * 0.5
    if (((this.vel.y > 0 && this.g == 1) || (this.vel.y < 0 && this.g == -1)) && this.collide(4)==false) {
      this.pos.y += this.g * 0.5
      this.pos.y += this.g * 0.01
      if (this.collide(4)!=false) {
        this.pos.y -= this.g * 0.01
        return true
      } else {
        this.pos.y -= this.g * 0.01
        return false
      }
    }
    this.pos.y += this.g * 0.5
    return false
  }

  physicsWater(gravity, verticalSpeed, controlability) {
    if (keyIsDown(this.keys[0])) {
      this.vel.y -= controlability * this.g
    } else if (keyIsDown(this.keys[2])) {
      this.vel.y += controlability * this.g
    } else {
      this.vel.y += gravity * -this.g
    }
    if (this.vel.y > verticalSpeed) {
      this.vel.y = verticalSpeed
    } else if (this.vel.y < -verticalSpeed) {
      this.vel.y = -verticalSpeed
    }
    this.pos.y += this.vel.y
    if (this.collide(1)!=false) {
      while (this.collide(1)!=false) {
        this.pos.y += abs(this.vel.y) / this.vel.y * -1 / zoom
      }
      this.vel.y = 0
    }
  }

  collide(type) {
    for (y = floor(this.pos.y) - 1; y <= ceil(this.pos.y) + 1; y++) {
      for (x = floor(this.pos.x) - 1; x <= ceil(this.pos.x) + 1; x++) {

        if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y && grid[y][x]) {
          if (grid[y][x].type == type) {
            if (this.collideWith(createVector(grid[y][x].pos.x - 1 / 2, grid[y][x].pos.y - 1 / 2), createVector(grid[y][x].pos.x + 1 / 2, grid[y][x].pos.y + 1 / 2))) {
              return grid[y][x].special
            }
          }
        }

      }
    }
    return false
  }
  collideWith(p1, p2) {
    let l1 = createVector(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2)
    let r1 = createVector(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2)
    let l2 = p1
    let r2 = p2
    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false
    }
    if (l1.y >= r2.y || l2.y >= r1.y) {
      return false
    }
    return true
  }
}