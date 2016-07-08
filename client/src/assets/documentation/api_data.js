define({ "api": [
  {
    "type": "get",
    "url": "/units/convert",
    "title": "Convert a list of units",
    "description": "<p>Returns the conversions for the provided values of a unit.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://kung-funit.appspot.com/units/convert?q=1&source=km&target=m\nhttps://kung-funit.appspot.com/units/convert?q=1&q=2&source=kg&target=g\nhttps://kung-funit.appspot.com/units/convert?q=1&source=USD&target=EUR&date=2014-07-13\nhttps://kung-funit.appspot.com/units/convert?q=1&q=2&source=EUR&target=GBP&date=2016-06-23",
        "type": "json"
      }
    ],
    "name": "GetConversion",
    "group": "Units",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "q",
            "description": "<p>The value(s) that should be converted.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "source",
            "description": "<p>The symbolic representation of the unit to convert from.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target",
            "description": "<p>The symbolic representation of the unit to convert to.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>The optional date of the conversion rate that should be used.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Wrapping data container for the result.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.conversions",
            "description": "<p>A list containing all of the conversion results in the order requested.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.conversions[i]",
            "description": "<p>A specific conversion.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.conversions.convertedUnit",
            "description": "<p>The numeric result of the conversion.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "{\n  \"data\": {\n    \"conversions\": [\n      {\n        \"convertedUnit\": 1000\n      },\n      {\n        \"convertedUnit\": 2000\n      }, ...\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/units.js",
    "groupTitle": "Units"
  },
  {
    "type": "get",
    "url": "/units",
    "title": "Request all supported units",
    "description": "<p>Returns all supported unit classes, quantities and their corresponding units.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "https://kung-funit.appspot.com/units",
        "type": "json"
      }
    ],
    "name": "GetUnits",
    "group": "Units",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Wrapping data container for the result.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.classes",
            "description": "<p>A list containing all of the supported unit classes.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.classes[i]",
            "description": "<p>A specific unit class.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.classes.name",
            "description": "<p>The name of the unit class.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.classes.quantities",
            "description": "<p>All unit quantities that are subordinated to the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.classes.quantities[i]",
            "description": "<p>A specific quantity.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.classes.quantities.name",
            "description": "<p>The name of the quantity.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.classes.quantities.units",
            "description": "<p>All units that are subordinated to the quantity.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.classes.quantities.units[i]",
            "description": "<p>A specific unit.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.classes.quantities.units.name",
            "description": "<p>The name of the unit.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.classes.quantities.units.symbol",
            "description": "<p>The symbol of the unit, which is used for the conversion.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "{\n  \"data\": {\n    \"classes\": [\n      {\n        \"name\": \"SI base units\",\n        \"quantities\": [\n          {\n            \"name\": \"Length\",\n            \"units\": [\n              {\n                \"name\": \"Kilometre\",\n                \"symbol\": \"km\"\n              },\n              {\n                \"name\": \"Metre\",\n                \"symbol\": \"m\"\n              },\n              {\n                \"name\": \"Centimetre\",\n                \"symbol\": \"cm\"\n              }, ...\n            ]\n          }, ...\n        ]\n      }, ...\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/units.js",
    "groupTitle": "Units"
  }
] });
