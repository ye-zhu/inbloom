const Images = require('./images.js')
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
