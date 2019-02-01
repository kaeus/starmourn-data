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
  "Ibyssian Brotherhood": "Navy"
}

class Voidgate {
  constructor(name, x, y, dest) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.dest = dest;
  }
}

class Cosmpiercer {
  constructor(name, x, y, level) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.level = level;
  }
}

