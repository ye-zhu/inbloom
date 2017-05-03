const Collidable = require('./collidable')
const Bullet = require('./bullet')

const ROTATION_STATE = {
  CLOCKWISE: "CLOCKWISE",
  COUNTER_CLOCKWISE: "COUNTER_CLOCKWISE",
  NONEC: "NONEC",
  NONECC: "NONECC"
}

const SHIP_STATUS = {
  ALIVE: "ALIVE",
  BLINKING: "BLINKING",
  IMPULSE: "IMPULSE",
  NOIMPULSE: "NOIMPULSE"
}


class Ship extends Collidable {
  constructor (params) {
    super(params)
    this.rotationState = ROTATION_STATE.NONEC;
    this.shipStatus = SHIP_STATUS.BLINKING;
    this.shipImpulse = SHIP_STATUS.NOIMPULSE;
    this.invulnerabilityCounter = 0;
    this.shipLives = 1;
    this.addListener();
  }

  invulnerability () {
    if (this.invulnerabilityCounter > 0 && this.shipStatus === SHIP_STATUS.ALIVE) {
      this.shipStatus = SHIP_STATUS.BLINKING
      this.image = undefined
      this.invulnerabilityCounter -= 1
    } else if (this.invulnerabilityCounter > 0 && this.shipStatus === SHIP_STATUS.BLINKING && this.game.running){
      this.shipStatus = SHIP_STATUS.ALIVE
      this.image = "ship"
    } else if (this.invulnerabilityCounter <= 0 && this.game.running) {
      this.shipStatus = SHIP_STATUS.ALIVE
      this.invulnerabilityCounter = 0
      this.image = "ship"
    }
  }

  fireBullet () {
    let bullet = new Bullet({
      image: "bullet",
      position: this.position,
      vector: [this.direction[0] * Bullet.SPEED + this.vector[0]/4, this.direction[1] * Bullet.SPEED + this.vector[1]/4],
      game: this.game,
      context: this.context,
      radius: 30
    })
    this.game.bullets.push(bullet)
  }

  remakeShip () {
    this.position = [this.game.canvas.width/2, this.game.canvas.height/2];
    this.vector = [.25, 0];
    this.game.makeWarp(this)
    this.shipStatus = "BLINKING"
    this.invulnerabilityCounter = 70
  }

  rotateShip () {
    if (this.rotationState === ROTATION_STATE.CLOCKWISE) {
      this.rotation += 0.08;
    } else if (this.rotationState === ROTATION_STATE.COUNTER_CLOCKWISE) {
      this.rotation -= 0.08;
    }

    if (this.rotationState === ROTATION_STATE.NONEC) {
      this.rotation += 0.02;
    } else if (this.rotationState === ROTATION_STATE.NONECC) {
      this.rotation -= 0.02;
    }

    this.direction = [
      Math.cos(this.rotation),
      Math.sin(this.rotation)
    ]
  }



  addListener () {
    let listenersFn = (e) => {
      if (e.keyCode === 32 && this.game.running) {
        e.preventDefault();
        if (e.type === 'keydown') {
          this.fireBullet();
        }
      } else if (e.keyCode === 68 && this.game.running) {
        if (e.type === 'keydown') {
          e.preventDefault();
          this.rotationState = ROTATION_STATE.CLOCKWISE;
        } else {
          this.rotationState = ROTATION_STATE.NONEC;
        }

      } else if (e.keyCode === 65 && this.game.running) {
        e.preventDefault();
        if (e.type === 'keydown') {
          this.rotationState = ROTATION_STATE.COUNTER_CLOCKWISE;
        } else {
          this.rotationState = ROTATION_STATE.NONECC;
        }

      } else if (e.keyCode === 87 && this.game.running) {
        e.preventDefault();
        if (e.type === 'keydown') {
          this.updateVector("accelerate")
          this.shipImpulse = SHIP_STATUS.IMPULSE
        } else {
          this.shipImpulse = SHIP_STATUS.NOIMPULSE
        }

      } else if (e.keyCode === 83 && this.game.running) {
        e.preventDefault();
        if (e.type === 'keydown') {
          this.updateVector("decelerate")
          this.shipImpulse = SHIP_STATUS.IMPULSE
        } else {
          this.shipImpulse = SHIP_STATUS.NOIMPULSE
        }

      }


    }

      document.addEventListener('keydown', listenersFn)
      document.addEventListener('keyup', listenersFn)
  }

  vectorMax () {
    if (this.vector[0] > 12 || this.vector[1] > 12 || this.vector[0] < -12 || this.vector[1] < -12) {
      this.vector[0] -= this.vector[0]/5
      this.vector[1] -= this.vector[1]/5
      this.vector[0] += this.direction[0]
      this.vector[1] += this.direction[1]
      return true
    }
  }

  updateVector (speed) {
    if (speed == "accelerate" && !this.vectorMax()) {
      this.vector[0] += this.direction[0]
      this.vector[1] += this.direction[1]
    } else if (speed == "decelerate" && (this.vector[0] + this.vector[1] >= .25 || this.vector[0] + this.vector[1] <= -.25) ) {
      this.vector[0] -= this.vector[0]/6
      this.vector[1] -= this.vector[1]/6
    }
  }

  beforeMove () {
    this.invulnerability()
    this.rotateShip();
  }

}


module.exports = Ship;
