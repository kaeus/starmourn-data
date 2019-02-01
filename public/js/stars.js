function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function gaussianRand() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}

function gaussianRandom(start, end) {
    return Math.floor(start + gaussianRand() * (end - start + 1));
}

function drawStars(canvas) {
  let height = canvas.node.clientHeight;
  let width = canvas.node.clientWidth;

  for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
          if (i % 25 == 0 && j % 25 == 0) {
              var rect = canvas.rect(
                  gaussianRandom(0, 1) * 0.975,
                  gaussianRandom(0, 1) * 1.87)
                    .fill('#fff')
                    .opacity(getRandomInt(5) / 10)
                    .translate(i + gaussianRandom(0, 1) * 10, j + gaussianRandom(0, 1) * 10);
          }
      }
  }
}