const Collidable = require('./collidable')



class Bullet extends Collidable {
  constructor (params) {
    super(params)
    this.counter = 1;
  }

  beforeMove () {
  }

}

Bullet.SPEED = 200;

module.exports = Bullet
