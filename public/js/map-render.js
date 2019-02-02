// Load map data
var mapData = {}
var xStart = 22;
var yStart = 28;

var showCosmpiercers = false;
var showVoidgates = true;
var showRegions = true;

var editor;
var mapCanvas;

JSONEditor.defaults.theme = 'bootstrap4';
JSONEditor.defaults.iconlib = 'bootstrap4';

$(document).ready(() => {
  var container = document.getElementById('pointData');
  editor = new JSONEditor(container, {
    schema: schema,
    no_additional_properties: true,
    //disable_edit_json: true,
    compact: true
  });

  editor.on('change', function() {
    var point = editor.getValue();
    calcPointData(point);
  });

  mapCanvas = SVG('map').size(1850, 880);

  $('#cosmpiercersToggle').attr('checked', showCosmpiercers);
  $('#voidgatesToggle').attr('checked', showVoidgates);
  $('#regionsToggle').attr('checked', showRegions);

  $('#cosmpiercersToggle').click(() => {
    showCosmpiercers = $('#cosmpiercersToggle').prop('checked');
    initMap();
  });

  $('#voidgatesToggle').click(() => {
    showVoidgates = $('#voidgatesToggle').prop('checked');
    initMap();
  });

  $('#regionsToggle').click(() => {
    showRegions = $('#regionsToggle').prop('checked');
    initMap();
  });

  $.ajax({
    url: '/map-data'
  }).done(function(data) {
    mapData = data;
    initMap();
  });
});

function calcPointData(point)
{
  point.quadrant = calcQuadrant(point._id);
  point.coords = calcCoords(point._id);
}

function getMapDataFromVoidgate(voidgateName)
{
  for(var key in mapData) {
    var pointData = mapData[key];
    if (pointData.voidgate && pointData.voidgate.name == voidgateName) {
      return pointData;
    }
  }

  return null;
}

function loadPoint(x, y)
{
  let key = `${x}${y}`;
  if (mapData[key]) {
    calcPointData(mapData[key]);
    editor.setValue(mapData[key]);
    $('#pointHeader').html(`${mapData[key].quadrant}-${key}`);
    $('#editor').modal();
  }
}

function savePoint()
{
  if (editor.validate()) {
    var point = editor.getValue();
    var pointData = JSON.stringify(point);

    mapData[point._id] = point;
    initMap();

    $.ajax({
      url: '/update-map',
      type: 'post',
      data: pointData,
      dataType: 'json',
      contentType: 'application/json',
    }).done(function(data) {
      $('#editor').modal('hide')
    });
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

function calcQuadrant(key) {
  let coords = calcCoords(key);
  return `${coords.y < 41 ? 'C' : 'R'}${coords.x < 41 ? 'A' : 'S'}`
}
function calcCoords(key) {
  let x = parseInt(key.substr(0, 2));
  let y = parseInt(key.substr(2, 2));
  return { x: x, y: y }
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
  $('#loading').show();
  //$('#map-container').hide();

  mapCanvas.clear();
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
      pointData.point = point;
      var pointColor = randColour();
      var opacity = 1;
      var tooltip = `${calcQuadrant(pointData._id)}-${pointData._id}`

      if (pointData.region && regionColors[pointData.region] && showRegions) {
        pointColor = regionColors[pointData.region];
        opacity = 0.55;
        tooltip = `${tooltip}<br/>Region: ${pointData.region}`
      }

      var hexSymbol = getHexSymbol(mapCanvas, corners, pointColor, opacity).translate(point.x, point.y);

      if (pointData.voidgate) {
        tooltip = `${tooltip}<br/>Voidgate: ${pointData.voidgate.x}, ${pointData.voidgate.y}`
        if (showVoidgates) {
          hexSymbol = hexSymbolVoidgate(mapCanvas, corners).translate(point.x, point.y);
        }
      }

      if (pointData.cosmpiercer) {
        tooltip = `${tooltip}<br/>Cosmpiercer (Rank ${pointData.cosmpiercer.level})`
        if (showCosmpiercers) {
          hexSymbol = hexSymbolCosmpiercer(mapCanvas, corners).translate(point.x, point.y);
        }
      }

      let tile = mapCanvas.use(hexSymbol)
          .attr('data-tippy-content', tooltip)
          .attr('data-tippy-delay', '[150, 200]')
          .on('click', handleClick, { x: xCoord, y: yCoord })
          .addClass('noSelect');
    }
  });

  if (showVoidgates) {
    Grid.rectangle({ width: 58, height: 31 }).forEach(hex => {
      const point = hex.toPoint();
      let xCoord = hex.x + xStart;
      let yCoord = hex.y + yStart;
      let key = `${xCoord}${yCoord}`;
      let pointData = mapData[key];

      if (pointData != null) {
        if (pointData.voidgate != null && pointData.voidgate.links != null) {
          for (let i = 0; i < pointData.voidgate.links.length; i++) {
            let outboundPoint = getMapDataFromVoidgate(pointData.voidgate.links[i]);
            if (outboundPoint != null && outboundPoint.point != null) {
              var line = mapCanvas.line(point.x + 18, point.y + 18, outboundPoint.point.x + 18, outboundPoint.point.y + 18).stroke({ width: 1, color: "#2c6015" }).attr('pointer-events', 'none');
            }
          }
        }
      }
    });
  }

  Grid.rectangle({ width: 58, height: 31 }).forEach(hex => {
    const point = hex.toPoint();
    let xCoord = hex.x + xStart;
    let yCoord = hex.y + yStart;
    let key = `${xCoord}${yCoord}`;
    let pointData = mapData[key];

    if (pointData != null) {
      if (pointData.voidgate && showVoidgates) {
        var path = 'M 0 200 C 0 0 250 0 250 200';
        var text = mapCanvas.text(function (add) {
          add.tspan(pointData.voidgate.name)
        });

        text.path(path).font({
          family: 'Casanova Scotia'
          , size: 16
          , fill: "#ffffff"
          , opacity: 0.6
          , anchor: 'middle'
        }).translate(point.x - 108, point.y - 62);
        text.textPath().attr('startOffset', '50%').attr('pointer-events', 'none');
      }

      if (pointData.cosmpiercer && showCosmpiercers) {
        let fixedY = point.y;
        var path = 'M 0 0 C 0 200 250 200 250 0';

        if (pointData._id == "3134"
          || pointData._id == "4034"
          || pointData._id == "2534") {
          path = 'M 0 200 C 0 0 250 0 250 200';
          fixedY -= 60;
        }
        else {
          fixedY -= 96;
        }

        var text = mapCanvas.text(function (add) {
          add.tspan(`${pointData.quadrant}-${pointData._id}`)
        });

        text.path(path).font({
          family: 'Casanova Scotia'
          , size: 12
          , fill: "#ffffff"
          , opacity: 0.6
          , anchor: 'middle'
        }).translate(point.x - 108, fixedY);
        text.textPath().attr('startOffset', '50%').attr('pointer-events', 'none');
      }
    }
  });

  tippy('use');

  $('#loading').hide();
  $('#map-container').show();
}