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
