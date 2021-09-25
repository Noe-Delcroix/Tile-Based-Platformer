class Particle {
  constructor(x, y, velx1, velx2, vely1, vely2, accx, accy, col1, col2, size1, size2, lifetime, shape) {
    this.pos = createVector(x, y)
    this.vel = createVector(random(velx1, velx2), random(vely1, vely2))
    this.accx = accx
    this.accy = accy
    this.col1 = col1
    this.col2 = col2
    this.size1 = size1
    this.size2 = size2
    this.lifetime = lifetime
    this.shape = shape

    this.life = 0
    this.delete = false
  }
  update() {
    this.vel.x *= this.accx
    this.vel.y *= this.accy

    this.pos.add(this.vel)
    this.life++
    if (this.life > this.lifetime) {
      this.delete = true
    }
  }
  render() {
    let xpos = this.pos.x * zoom - cam.x * zoom
    let ypos = this.pos.y * zoom - cam.y * zoom
    if (xpos > -width / 2 && xpos < width / 2 && ypos > -height / 2 && ypos < height / 2) {
      fill(lerpColor(this.col1, this.col2, map(this.life, 0, this.lifetime, 0, 1)))
      noStroke()
      push()
      translate(xpos, ypos)

      let s = map(this.life, 0, this.lifetime, this.size1, this.size2)

      if (this.shape == 0) {
        rect(0, 0, zoom * s, zoom * s)
      }else if (this.shape==1){
        circle(0,0,zoom*s)
      }else {
        triangle(0, -zoom * s / 2, -zoom * s / 2, zoom * s / 2, zoom * s / 2, zoom * s / 2)
      }
      pop()
    }
  }
}