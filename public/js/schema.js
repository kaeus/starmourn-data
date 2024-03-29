var schema = {
  "headerTemplate": "{{self.quadrant}}-{{self._id}}",
  "type": "object",
  "required": [
    "_id",
  ],
  "properties": {
    "quadrant": {
      "options": {
        "hidden": true
      },
    },
    "_id": {
      "type": "string",
      "description": "Space Coordinates",
      "minLength": 4,
      "options": {
        "hidden": true
      },
      "default": "4040"
    },
    "region": {
      "type": "string",
      "enum": [
        "Narchspace",
        "Voniken Krel",
        "Celestine Ascendancy",
        "Diamond Belt",
        "Song Dominion",
        "Vyan Shroud",
        "Fatar Shroud",
        "Nabian States",
        "Y'saari Covenant",
        "Hreysil Cloud",
        "Grensuhlian",
        "Selassian Dynasty",
        "Zinari Imperium",
        "Scatterhome",
        "Ibyssian Brotherhood",
        "Iron Corsairs",
        "Syndicate",
        "Arcturus",
      ]
    },
    "planets": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "desc", "x", "y"],
        "properties": {
          "name": {
            "type": "string",
          },
          "desc": {
            "type": "string",
          },
          "x": {
            "type": "integer"
          },
          "y": {
            "type": "integer"
          }
        }
      }
    },
    "stations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "x", "y"],
        "properties": {
          "name": {
            "type": "string",
          },
          "x": {
            "type": "integer"
          },
          "y": {
            "type": "integer"
          }
        }
      }
    },
    "suns": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "x", "y"],
        "properties": {
          "name": {
            "type": "string",
          },
          "x": {
            "type": "integer"
          },
          "y": {
            "type": "integer"
          }
        }
      }
    },
    "cosmpiercer": {
      "type": "object",
      "required": ["level"],
      "properties": {
        "level": {
          "type": "integer"
        }
      }
    },
    "voidgate": {
      "type": "object",
      "required": [
        "x",
        "y",
        "name",
        "links"
      ],
      "properties": {
        "x": {
          "type": "integer"
        },
        "y": {
          "type": "integer"
        },
        "name": {
          "type": "string",
        },
        "links": {
          "type": "array",
          "format": "checkbox",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "Aleph",
              "Narchspace",
              "VonikenKrel",
              "Celestine",
              "DiamondBelt",
              "Song",
              "Syndicate",
              "Fatar",
              "Nabian",
              "Hreysil",
              "Grensuhlian",
              "Selassian",
              "Neutralspace",
              "IronCorsairs",
              "Arcturus",
              "Zinari",
              "Scatterhome",
              "Ibyssian",
              "Laskaird"
            ]
          }
        }
      }
    }
  }
}