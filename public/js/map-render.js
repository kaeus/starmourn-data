// Load map data
var mapData = {}
var xStart = 22;
var yStart = 28;


const hexSymbolVoidgate = (canvas, corners) => canvas.symbol()
  .polygon(corners.map(({ x, y }) => `${x},${y}`))
  .fill('#2c6015')
  .stroke({ width: 0.5, color: '#373739' });

const hexSymbolCosmpiercer = (canvas, corners) => canvas.symbol()
  .polygon(corners.map(({ x, y }) => `${x},${y}`))
  .fill('#2c1461')
  .stroke({ width: 0.5, color: '#373739' });

const hexSymbolStation = (canvas, corners) => canvas.symbol()
  .polygon(corners.map(({ x, y }) => `${x},${y}`))
  .fill('#1a4f89')
  .opacity(0.8)
  .stroke({ width: 0.5, color: '#373739' });

function loadMapData()
{
  $.ajax({
    url: '/map-data'
  }).done(function(data) {
    mapData = data;
    $('#loading').hide();
    initMap();
  });
}

function loadPoint(x, y)
{
  let key = `${x}${y}`;
  if (mapData[key]) {
    $('#pointData').val(JSON.stringify(mapData[key], null, 2))
  }
}

function randColour() {
  switch (getRandomInt(3)) {
    case 0:
      return "#323232";
    case 1:
      return "#1e1e1e";
    case 2:
    default:
      return "#282828";
  }
}


function getHexSymbol(canvas, corners, colour, opacity) {
    return canvas.symbol()
        .polygon(corners.map(({ x, y }) => `${x},${y}`))
        .fill({ color: colour, opacity: opacity })
        .stroke({ width: 0.5, color: '#37383a' });
}

function handleClick(event) {
  loadPoint(this.x, this.y);
}

function initMap()
{
  var mapCanvas = SVG('map').size(1850, 880);
  drawStars(mapCanvas);

  const Hex = Honeycomb.extendHex({ size: 18 });
  const Grid = Honeycomb.defineGrid(Hex);
  const grid = Grid.rectangle({ width: 58, height: 31 });

  const corners = Hex().corners();

  Grid.rectangle({ width: 58, height: 31 }).forEach(hex => {
    const point = hex.toPoint();
    let xCoord = hex.x + xStart;
    let yCoord = hex.y + yStart;
    let key = `${xCoord}${yCoord}`;
    let pointData = mapData[key];

    if (pointData != null) {
      var pointColor = randColour();
      var opacity = 1;
      var tooltip = `${pointData.quadrant}-${pointData.key}`

      if (pointData.region && regionColors[pointData.region]) {
        pointColor = regionColors[pointData.region];
        opacity = 0.55;
        tooltip = `${tooltip}<br/>Region: ${pointData.region}`
      }

      var hexSymbol = getHexSymbol(mapCanvas, corners, pointColor, opacity).translate(point.x, point.y);

      if (pointData.voidgate) {
        tooltip = `${tooltip}<br/>Voidgate: ${pointData.voidgate.x}, ${pointData.voidgate.y}`
        hexSymbol = hexSymbolVoidgate(mapCanvas, corners).translate(point.x, point.y);
      }

      let tile = mapCanvas.use(hexSymbol)
          .attr('data-tippy-content', tooltip)
          .attr('data-tippy-delay', '[150, 200]')
          .on('click', handleClick, { x: xCoord, y: yCoord })
          .addClass('noSelect');
    }
  });

  tippy('use');
}

loadMapData();