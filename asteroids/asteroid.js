const Collidable = require('./collidable')

const Canvas = document.getElementById('canvas');

class Asteroid extends Collidable {
  constructor (params) {
    super(params)
    this.position = this.position || this.generateRandomPos();
    this.vector = this.generateRandomVector();
  }

  generateRandomPos () {
    return [Canvas.width * Math.random(), Canvas.height * Math.random()]
  }

  checkRandomShipAsteroidCollision () {
    this.radius += 100
    if (this.collideWith(this.game.ship[0])) {
      this.position = this.generateRandomPos();
      if (this.collideWith(this.game.ship[0])) {
        this.checkRandomShipAsteroidCollision()
      }
    }
    this.radius -= 100
  }

  // console.log(this.collideWith(this.game.ship[0], xCoord, yCoord, 600));
  // if (this.collideWith(this.game.ship[0], xCoord, yCoord, 600)) {
  //   return this.generateRandomPos()
  // } else {
  //   return [xCoord, yCoord]
  // }

  generateRandomVector () {
    return [
      this.vector[0] * Math.random() - this.vector[0]/2,
      this.vector[1] * Math.random() - this.vector[1]/2
    ]
  }

}

module.exports = Asteroid
