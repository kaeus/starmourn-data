var regionColors = {
  "Narchspace": "DimGray",
  "Voniken Krel": "firebrick",
  "Celestine Ascendancy": "blue",
  "Diamond Belt": "cyan",
  "Song Dominion": "purple",
  "Vyan Shroud": "magenta",
  "Fatar Shroud": "yellow",
  "Nabian States": "BlueViolet",
  "Y'saari Covenant": "turquoise",
  "Hreysil Cloud": "orange",
  "Grensuhlian": "LightBlue",
  "Selassian Dynasty": "goldenrod",
  "Zinari Imperium": "SkyBlue",
  "Scatterhome": "ForestGreen",
  "Ibyssian Brotherhood": "Navy",
  "Iron Corsairs": "firebrick",
  "Arcturus": "green",
  "Syndicate": "magenta",
}

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