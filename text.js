class Text{
  constructor(x,y,txt,size,col){
    this.pos=createVector(x,y)
    this.txt=txt
    this.size=size
    this.col=col
    this.del=false
  }
  render(){
    if (this.loaded()){
      let b=this.bounds()
      if (MODE=='edit' && menuSelectedText==this){
        stroke(255,200)
        strokeWeight(zoom/10)
      }else{
        stroke(bgColor)
        strokeWeight(zoom/30)
      }
      fill(this.col)
      textFont(font1)
      textSize(this.size*zoom)
      textAlign(CENTER,CENTER)
      text(this.txt,(this.pos.x-cam.x)*zoom,(this.pos.y-cam.y)*zoom)
      
      
    }
    if (menuSelectedText!=this  && this.txt.length==0){
      this.del=true
    }
  }
  update(){
    if (menuSelectedText==this){
      if (mouseIsPressed && !keyIsDown(freeCamCode) && mouseY>menuText){
        this.pos=getMousePos(false)
        
      }
    }
    let b=this.bounds()
    // noFill()
    // stroke(255,100)
    // strokeWeight(zoom/20)
    // rectMode(CORNER)
    // rect(b.x,b.y,b.w,b.h)
  }
  bounds(){
    textSize(this.size*zoom)
    textAlign(CENTER,CENTER)
    return (font1.textBounds(this.txt,(this.pos.x-cam.x)*zoom,(this.pos.y-cam.y)*zoom))
  }
  
  loaded(){
    textSize(this.size*zoom)
    textAlign(CENTER,CENTER)
    let b=this.bounds()
    let l1 = createVector(b.x,b.y)
    let r1 = createVector(b.x+b.w,b.y+b.h)
    let l2 = createVector(-width/2,-height/2)
    let r2 = createVector(width/2,height/2)

    if (!(l1.x >= r2.x || l2.x >= r1.x) && !(l1.y >= r2.y || l2.y >= r1.y)) {
      return true
    }
    return false
  }
  collide(fx,fy){
    let b=this.bounds()
  
    return (fx>b.x && fy>b.y && fx<b.x+b.w && fy<b.y+b.h)
    
  }
}