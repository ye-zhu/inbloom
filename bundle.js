/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1)
	const Images = __webpack_require__(3)
	
	let canvas = document.getElementById('canvas');
	let context = canvas.getContext('2d');
	
	canvas.width = document.body.clientWidth; 
	canvas.height = document.body.clientHeight; 
	context.font = "18px monospace";
	context.fillStyle = "#32CD32";
	context.strokeStyle = "#ffffff";
	
	
	
	let startGame = function () {
	    new Game({
	    context:context
	  })
	}
	
	Images.loadImages(startGame)
	context.fillText("LOADING...", canvas.width/2 - 50, canvas.height/2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Collidable = __webpack_require__(2)
	const Ship = __webpack_require__(5)
	const Bullet = __webpack_require__(6)
	const Asteroid = __webpack_require__(7)
	const Explosion = __webpack_require__(8)
	const Description = __webpack_require__(9)
	
	
	
	class Game {
	  constructor (params) {
	    this.context = params.context;
	    this.ship = [];
	    this.bullets = [];
	    this.asteroids = [];
	    this.allObjects = [];
	    this.explosions = [];
	    this.numberAsteroids = 1;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Images = __webpack_require__(3)
	const ImageSpec = __webpack_require__(4)
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	const IMAGES = [
	  'explosion',
	  'asteroid',
	  'ship',
	  'bullet',
	  'warp',
	  'asteroidintro'
	]
	
	const LOADING_STATUS = {
	  LOADING: "LOADING",
	  FINISHED_LOADING: "FINISHED_LOADING"
	}
	
	
	const Images = {
	  loading: LOADING_STATUS.LOADING,
	  counter: 0,
	  loadImages: function (startGame) {
	    IMAGES.forEach((imageName) => {
	      let img = new Image();
	
	      img.onload = function () {
	        Images.counter += 1;
	        Images[imageName] = img;
	        if (Images.counter === IMAGES.length) {
	          Images.loading = LOADING_STATUS.FINISHED_LOADING
	          startGame()
	        }
	      }
	
	      img.src = `./asteroids/assets/${imageName}.png`;
	      img.id = `${imageName}`
	    })
	  }
	
	}
	
	
	
	
	
	
	
	
	module.exports = Images


/***/ },
/* 4 */
/***/ function(module, exports) {

	const ImageSpec = {
	
	  "asteroid": {
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 256,
	    frameHeight: 256,
	    offset: 90,
	    totalFrameX: 2048,
	    totalFrameY: 1024,
	    imageWidth: 180,
	    imageHeight: 180
	  },
	
	  "ship": {
	    frameRate: 7,
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 96,
	    frameHeight: 156,
	    shipOffset: -25,
	    totalFrameX: 384,
	    totalFrameY: 312,
	    imageWidth: 48,
	    imageHeight: 78
	  },
	
	  "explosion": {
	    frameRate: 2,
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 128,
	    frameHeight: 128,
	    offset: 100,
	    totalFrameX: 640,
	    totalFrameY: 1152,
	    imageWidth: 200,
	    imageHeight: 200
	  },
	
	  "warp": {
	    frameRate: 1,
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 128,
	    frameHeight: 128,
	    offset: 100,
	    totalFrameX: 640,
	    totalFrameY: 896,
	    imageWidth: 200,
	    imageHeight: 200
	  },
	
	  "bullet": {
	    frameRate: 1,
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 457,
	    frameHeight: 457,
	    offset: 40,
	    totalFrameX: 457,
	    totalFrameY: 457,
	    imageWidth: 80,
	    imageHeight: 80
	  },
	
	  "smallerexplosion": {
	    frameRate: 2,
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 128,
	    frameHeight: 128,
	    offset: 100/3,
	    totalFrameX: 640,
	    totalFrameY: 1152,
	    imageWidth: 200/3,
	    imageHeight: 200/3
	  },
	
	  "smallerwarp": {
	    frameRate: 1,
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 128,
	    frameHeight: 128,
	    offset: 100/3,
	    totalFrameX: 640,
	    totalFrameY: 896,
	    imageWidth: 200/3,
	    imageHeight: 200/3
	  },
	
	  "smallerasteroid": {
	    frameX: 0,
	    frameY: 0,
	    frameWidth: 256,
	    frameHeight: 256,
	    offset: 90/3,
	    totalFrameX: 2048,
	    totalFrameY: 1024,
	    imageWidth: 180/3,
	    imageHeight: 180/3
	  }
	
	
	}
	
	
	
	module.exports = ImageSpec


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Collidable = __webpack_require__(2)
	const Bullet = __webpack_require__(6)
	
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Collidable = __webpack_require__(2)
	
	
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Collidable = __webpack_require__(2)
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Collidable = __webpack_require__(2)
	
	class Explosion extends Collidable {
	  constructor(params) {
	    super(params)
	  }
	
	
	}
	
	module.exports = Explosion


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Images = __webpack_require__(3)
	const context = undefined
	
	const GAME_TEXT = {
	  INTRO_TEXT: "Press Enter To Play",
	  NO_TEXT: ""
	}
	
	class Description {
	  constructor(game) {
	    this.game = game;
	    this.gameText = GAME_TEXT.INTRO_TEXT;
	  }
	
	  drawShipLivesAndScore () {
	    let xPos = 870
	    let highScore = ""
	    for (let i = 0; i < this.game.ship[0].shipLives; i++) {
	      this.game.context.drawImage (
	        Images.ship, 0, 0, 96, 156, xPos, 15, 24, 39
	      )
	      xPos -= 40
	    }
	    if (localStorage.asteroidHighScore > 0 ) {
	      highScore = `high score = ${localStorage.asteroidHighScore}    `
	    }
	    this.game.context.fillText(`${highScore} score = ${this.game.score}`, 10, 25);
	  }
	
	  makeEnterScreen () {
	    let listenerFn = (e) => {
	      if (e.keyCode === 13) {
	        this.game.running = true
	        this.game.ship[0].image = Images.ship
	        this.game.resetGame()
	        this.enterListener = document.removeEventListener('keydown', listenerFn)
	      }
	    }
	
	    if (!this.startGame) {
	      this.game.ship[0].image = undefined;
	      this.game.context.drawImage (
	        Images.asteroidintro, 0, 0, 583, 519, 180, 60, 583, 519
	      )
	
	      let score = ""
	      let highScore = ""
	
	      if (this.game.score > 0 ) {
	        score = `your score = ${this.game.score}`
	      }
	
	      if (localStorage.asteroidHighScore > 0 ) {
	        highScore = `high score = ${localStorage.asteroidHighScore}   `
	      }
	
	      this.game.context.fillText(`${highScore} ${score}`, 10, 25);
	    }
	
	    this.enterListener = document.addEventListener('keydown', listenerFn)
	  }
	
	  drawGameDescriptions () {
	    if (this.game.running) {
	      this.drawShipLivesAndScore();
	    } else {
	      this.makeEnterScreen();
	    }
	  }
	
	}
	
	
	
	module.exports = Description


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map