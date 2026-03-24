let osc
let thing = []
let vert = 100
let wobbleA = 40
let baseWidth = 120
let baseHeight = 70
let t = 0
let totalClicks = 0
let freq = 0

//DRUMS!!
let kick, snare, hihat
let beat = 0 
let bpm = 150
let interval

function preload(){
    kick = loadSound('sounds/kick.mp3')
    snare = loadSound('sounds/snare.mp3')
    hihat = loadSound('sounds/hihat.mp3')
}

class thingBlob {
//NEED to add Z b/c it’s 3D 
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    this.xV = random(-1,2)
    this.yV = random(-3,1)
    this.zV = random(-1,1)

    this.wobble = random(1000)
    this.col1 = color(random(255), random(255), random(255))
    this.col2 = color(random(255), random(255), random(255))
    this.col3 = color(random(255), random(255), random(255))
    this.rot = random(TWO_PI)
    this.rotSpeed = random(-0.01, 0.01)
  }

  move() {
    //VELOCITY OF BLOBS IN SPACE
    this.x += this.xV
    this.y += this.yV
    this.z += this.zV

    // LIKE FLOWERS doesn't move off screen
    if (this.x > width/2){
 this.x = -width/2
}
    if (this.x < -width/2){
 this.x = width/2
}
    if (this.y > height/2){
this.y = -height/2
}
    if (this.y < -height/2) {
this.y = height/2
}
    if (this.z > 300) {
this.z = -300
}
    if (this.z < -300) {
this.z = 300
}
   this.rot += this.rotSpeed
}

  display() {
    push()
    translate(this.x, this.y, this.z)
    rotateX(this.rot)
    rotateZ(this.rot * 2)
    rotateY(this.rot * 10)

    beginShape()
    for (let j = 0; j < vert; j++) {
      let angle = (j/vert) * TWO_PI
      let xr = baseWidth * cos(angle)
      let yr = baseHeight * sin(angle)

      // Noise-based wobble
      let n = noise(
        cos(angle) * 3 + this.wobble, 
        sin(angle) * 2 + this.wobble, 
        t
      )
      let rOffset = map(n, 0, 1, -wobbleA, wobbleA)
      let r = 1 + rOffset / 100

      let amt = map(j, 0, vert, 0, 1)
      let c = lerpColor(this.col1, this.col2, amt)
      fill(c)

      vertex(xr * r, yr * r)
    }
    endShape(CLOSE)
    pop()
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  noStroke()
  
  //OSC
  osc = new p5.Oscillator('sine')
  osc.start()
  osc.amp(0) // <-- Makes it so it starts out without any sound
  
  //DOM stuff
  clickCounter = createP('Clicks: 0')
  clickCounter.position(20, 20)
  clickCounter.style('color', 'white')
  clickCounter.style('font-size', '18px')
  
  freqDisplay = createP('Frequency: 0 Hz')
  freqDisplay.position(20, 50)
  freqDisplay.style('color', 'white')
  freqDisplay.style('font-size', '18px')
  
  //Creating the blobs
  for (let i = 0; i < 8; i++) {
    thing.push(new thingBlob(
      random(-width/2, width/2), 
      random(-height/2, height/2), 
      random(-200,200)
    ))
  }

  //Drummmsss
  let beatInterval = (60/bpm) * 1000
  interval = setInterval(playBeat, beatInterval)
}

function draw() {
  background(0)
  t += 0.01

  for (let c of thing) {
    c.move() //makes blobs move
    c.display() //shows blob on the screen
  }
}

function playBeat(){
    if (beat%3 == 0) kick.play()
    if (beat%3 == 1) hihat.play()
    if (beat%3 == 2) snare.play()
    beat++    
}

function mousePressed() {
  userStartAudio() //need it for p5.sound 
  
  let adjustedX = mouseX - width/2
  let adjustedY = mouseY - height/2
  
  for (let blob of thing){
    let d = dist(adjustedX, adjustedY, blob.x, blob.y)
    
    if (d < baseWidth){
      
      osc.freq(math.random(10, 900))
      osc.freq(10, 0.5)
      osc.amp(0.5, 0.03)
      
      //Updating the DOM when clicked
      totalClicks++
      clickCounter.html('Clicks: ' + totalClicks)
      freq = 900
      freqDisplay.html('Frequency: ' + Math.floor(freq) + ' Hz')
    }
  }
  
  //This is the original blob effect
  thing.push(new thingBlob(
    random(-width/2, width/2),
    random(-height/2, height/2),
    random(-200,200)
  ))
}
