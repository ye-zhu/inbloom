const Images = require('./images')
const ImageSpec = require('./imageSpec')

class Collidable {
  constructor (params) {
    this.image = params.image;
    this.radius = params.radius;
    this.makeImageSpecs();
    this.imageSource = Images[this.image] || undefined
    this.vector = params.vector;
    this.direction = params.direction;
    this.position = params.position
    this.context = params.context;
    this.game = params.game;
    this.shipStatus;
    this.rotation = 0;
  }

  // draw() {
  //   this.context.beginPath();
  //   this.context.arc(this.position[0], this.position[1], this.radius, 0, Math.PI*2, true)
  //   this.context.stroke();
  //
  // }

  collideWith (otherCollidable) {
    let xDiff = this.position[0] - otherCollidable.position[0]
    let yDiff = this.position[1] - otherCollidable.position[1]

    let distanceBetween = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

    if (distanceBetween < this.radius + otherCollidable.radius) {
      return true
    } else {
      return false
    }
  }

  generateRandomFrameRate () {
    return Math.floor(8 * Math.random() + 1)
  }

  makeImageSpecs () {
    if (this.image) {
      if (this.radius === 19 && this.image !== "ship") {
        this.imageSpec = ImageSpec["smaller"+this.image];
      } else {
        this.imageSpec = ImageSpec[this.image];
      };
    this.frameRate = (this.imageSpec.frameRate || this.generateRandomFrameRate());
    this.frameCount = this.frameRate;
    this.frameX = this.imageSpec.frameX;
    this.frameY = this.imageSpec.frameY;
    this.frameWidth = this.imageSpec.frameWidth;
    this.frameHeight = this.imageSpec.frameHeight;
    this.imageWidth = this.imageSpec.imageWidth;
    this.imageHeight = this.imageSpec.imageHeight;
    }
  }


  drawImage () {
    if (this.image) {
      this.frameCount = (this.frameCount + 1)%this.frameRate
      if (this.image === "ship") {
        this.context.save();
        this.context.translate(this.position[0], this.position[1]);
        this.context.rotate(this.rotation + 90 * 0.0174532925);
      }
      this.context.drawImage(
        this.imageSource,
        this.frameX,
        this.frameY,
        this.frameWidth,
        this.frameHeight,
        this.imageSpec.shipOffset || this.position[0] - this.imageSpec.offset,
        this.imageSpec.shipOffset || this.position[1] - this.imageSpec.offset,
        this.imageWidth,
        this.imageHeight
      );

      if (this.frameCount === 0) {
          this.frameX += this.frameWidth;

          if (this.shipImpulse === "IMPULSE") {
            this.frameY = 156
          }

          if (this.frameX >= this.imageSpec.totalFrameX) {
            this.frameX = 0;
            if (this.shipImpulse === "NOIMPULSE") {
              this.frameY = 0;
            } else {
              this.frameY += this.frameHeight;
            }
          }

          if (this.frameY >= this.imageSpec.totalFrameY) {
            if (this.shipImpulse === "IMPULSE") {
              this.frameY = 156
            } else if (this.image === "explosion" || this.image === "warp") {
              this.terminateAfterAnimation();
            } else {
              this.frameY = 0;
            }
          }
        }

        if (this.image === "ship") {
            this.context.restore();
        }
      }
  }

  terminateAfterAnimation () {
      this.game.remove(this)
  }

  move () {
    this.position = [
      (this.position[0] + this.vector[0] + this.context.canvas.width)%this.context.canvas.width,
      (this.position[1] + this.vector[1] + this.context.canvas.height)%this.context.canvas.height
    ]
  }

  beforeMove () {
  }

}


// export default Collidable;
module.exports = Collidable;
