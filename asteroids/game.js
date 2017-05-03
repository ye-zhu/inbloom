const Collidable = require('./collidable.js')
const Ship = require('./ship')
const Bullet = require('./bullet')
const Asteroid = require('./asteroid')
const Explosion = require('./explosion')
const Description = require('./description')



class Game {
  constructor (params) {
    this.context = params.context;
    this.ship = [];
    this.bullets = [];
    this.asteroids = [];
    this.allObjects = [];
    this.explosions = [];
    this.numberAsteroids = 2;
    this.score = 0;
    this.running = true;
    this.makeShip();
    this.makeSmallAsteroid();
    this.makeLargeAsteroid();
    this.setGameIntoMotion();
  }

  localStorageScore () {
    if (!localStorage.asteroidHighScore || localStorage.asteroidHighScore < this.score) {
      localStorage.asteroidHighScore = this.score
    }
  }

  makeShip () {
    this.ship[0] = new Ship ({
            position: [canvas.width/2, canvas.height/2],
            vector: [.5, -.5],
            direction: [1,0],
            image: "ship",
            radius: 19,
            context: this.context,
            game: this
          });
    // this.ship[0].invulnerability();
   }

  makeLargeAsteroid () {
    for (let i=0; i < this.numberAsteroids ; i++) {
      let asteroid = new Asteroid ({
        direction: [-1, -1],
        vector: [2, 2],
        radius: 60,
        image: "asteroid",
        context: this.context,
        game: this
      })
      asteroid.checkRandomShipAsteroidCollision();
      this.makeWarp(asteroid);
      this.asteroids.push(asteroid)
    }
  }

  makeSmallAsteroid (pos) {
    for (let i=0; i < 4 ; i++) {
      let asteroid = new Asteroid ({
        position: pos,
        direction: [-1, -1],
        vector: [2, 2],
        radius: 19,
        image: "asteroid",
        context: this.context,
        game: this
      })
      this.asteroids.push(asteroid)
      this.makeWarp(asteroid);
      if (!pos) { break; }
    }
  }

  makeExplosion (asteroid) {
    let explosion = new Explosion ({
      position: asteroid.position,
      direction: asteroid.direction,
      vector: [asteroid.vector[0]/4, asteroid.vector[1]/4],
      radius: asteroid.radius,
      image: "explosion",
      context: this.context,
      game: this
    });
    this.explosions.push(explosion)
  }

  makeWarp (asteroid) {
    let explosion = new Explosion ({
      position: asteroid.position,
      direction: asteroid.direction,
      vector: [asteroid.vector[0]/4, asteroid.vector[1]/4],
      radius: asteroid.radius,
      image: "warp",
      context: this.context,
      game: this
    });
    this.explosions.push(explosion)
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Asteroid) {
      this.asteroids.splice(this.asteroids.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ship.splice(this.ship.indexOf(object), 1);
    } else if (object instanceof Explosion) {
      this.explosions.splice(this.explosions.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  }

  concatAll () {
    this.allObjects = [].concat(this.ship, this.bullets, this.asteroids, this.explosions)
  }

  // drawAll () {
  //   this.allObjects.forEach((circle) => circle.draw())
  // }

  beforeMoveAll () {
    this.allObjects.forEach((circle) => circle.beforeMove())
  }

  moveAll () {
    this.allObjects.forEach((circle) => circle.move())
  }

  drawAllImages () {
    this.allObjects.forEach((circle) => circle.drawImage())
  }

  clear () {
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }


  detectBulletAsteroidCollision() {
    this.asteroids.forEach((asteroid) => {
      this.bullets.forEach((bullet) => {

        if (asteroid.collideWith(bullet)) {
            if (asteroid.radius === 60) {
              this.makeExplosion(asteroid)
              this.makeSmallAsteroid(asteroid.position)
              this.remove(asteroid)
              // this.score += 100
            } else {
              this.makeExplosion(asteroid)
              this.remove(asteroid)
              // this.score += 50
            }
          this.remove(bullet)
        }
      })
    })
  }


  detectShipAsteroidCollision () {
    this.asteroids.forEach((asteroid) => {
      if (asteroid.collideWith(this.ship[0]) && this.running) {
        if (asteroid.radius === 60) {
          this.makeExplosion(asteroid)
          this.makeSmallAsteroid(asteroid.position)
          this.remove(asteroid)
        } else {
          this.makeExplosion(asteroid)
          this.remove(asteroid)
        }
        // this.ship[0].shipLives -= 1
        this.makeExplosion(this.ship[0])
        // this.checkGameLost();
      }
    })
  }

  resetGame () {
    this.localStorageScore();
    this.bullets = [];
    this.allObjects = [];
    this.explosions = [];
    this.numberAsteroids = 0;
    if (this.asteroids.length > 1) {
      this.asteroids = []
      this.makeSmallAsteroid();
      this.makeWarp(this.asteroids[0]);
    }
    this.score = 0;
    // this.ship[0].remakeShip();
    this.ship[0].shipLives = 6;
    this.ship[0].rotation = 0;
    this.ship[0].direction = [1,0];
  }

  checkGameLost () {
      this.ship[0].remakeShip();
  }

  detectAllCollisions() {
    if (this.ship[0].invulnerabilityCounter <= 0) {
      this.detectShipAsteroidCollision();
    }
    this.detectBulletAsteroidCollision();
  }

  resetFieldAsteroidsAfterRound () {
    if (this.asteroids.length === 0) {
      this.numberAsteroids += 1;
      this.makeLargeAsteroid();
    }
  }

  // makeStartScreenAndGameDesciptions () {
  //   this.description.drawGameDescriptions()
  // }

  animateFrame () {
    // this.clear();
    // this.localStorageScore();
    this.concatAll();
    this.beforeMoveAll();
    this.moveAll();
    this.detectAllCollisions();
    this.resetFieldAsteroidsAfterRound();
    this.drawAllImages();
    if (this.bullets[0]) {
      this.remove(this.bullets[0])
    }
  }

  setGameIntoMotion () {
    this.interval = setInterval(this.animateFrame.bind(this), 17)
  }

}

module.exports = Game;
