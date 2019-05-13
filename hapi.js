const express = require('express')
const app = express()

const Joi = require('@hapi/joi');


app.get('/', (req, res) => res.send('Hello ;) !'))

var characteristics = []
const schema = Joi.object().keys({
    name: Joi.string().required(),
    tables: Joi.array().items(Joi.object({
	    data: Joi.string().required(),
	    name: Joi.string().required(),
	    columnHeaders: Joi.array().items(Joi.object({
		    name: Joi.string().required(),
		    dataType: Joi.string().required(),
	    }))
	})),
	metrics: Joi.array().items(Joi.object({
	    name: Joi.string().required(),
	    dataType: Joi.string().required(),
	    expressions: Joi.array().items(Joi.object({
		    formula: Joi.alternatives(
		        Joi.string(),
		        Joi.number()
		    ).required()
	    }))
	})),
	attributes: Joi.array().items(Joi.object({
	    name: Joi.string(),
	    attributeForms: Joi.array().items(Joi.object({
		    category: Joi.string(),
		    expressions: Joi.array().items(Joi.object({
			    formula:  Joi.alternatives(
		        Joi.string(),
		        Joi.number()
		    ).required(),
		    })),
		    dataType:Joi.string(),
	    }))
	})).options({ stripUnknown: true })
})

const schema2 = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
	properties: Joi.object({}).options({ stripUnknown: true }),
})

const schemas = {s1: schema, s2: schema2}

const listFunction = {
	s1: fn1 = data => {
		console.log('fn1 executed')
		for (var i = 0; i < data.metrics.length; i++) {
			characteristics.push(data.metrics[i].name)
		}
		console.log(characteristics)

	},
	s2: fn2 = data => {
		console.log('fn2 executed')
		var keysProp = Object.keys(data.properties)
		for(obj in keysProp){
			let prop = keysProp[obj]
			let propDetails = data.properties[prop]
			characteristics.push(propDetails.title)
		}
		console.log(characteristics)
	}
}

var expl2 ={
  "name":"On/Off Switch",
  "description": "A web connected switch",
  "properties": {
    "on": {
      "title": "On/Off",
      "type": "boolean",
      "description": "Whether the lamp is turned on",
      "links": [{"href": "/things/lamp/properties/on"}]
    },
     "brightness" : {
      "@type": "BrightnessProperty",
      "type": "integer",
      "title": "Brightness",
      "description": "The level of light from 0-100",
      "minimum" : 0,
      "maximum" : 100,
      "links": [{"href": "/things/lamp/properties/brightness"}]
    }
  }
}

var explr = {
		"name":"MapsIOT3",
		"tables":[
			{
				"data":"e30=",
				"name":"MAPS_TABLE",
				"columnHeaders":[
					{"name":"ID_Point","dataType":"DOUBLE"},
					{"name":"temperature","dataType":"DOUBLE"},
					{"name":"humidity","dataType":"DOUBLE"}
				]
			}
		],
		"metrics":[
			{
				"name":"temperature",
				"dataType":"number",
				"expressions":[
					{
						"formula":30,
					}
				]
			},
			{
				"name":"humidity",
				"dataType":"number",
				"expressions":[
					{
						"formula":60,
					}
				]
			}
		],
		"attributes":[
			{
				"name":"ID_Point",
				"attributeForms":[
					{
						"category":"ID",
						"expressions":[
							{
								"formula":"MAPS_TABLE.ID_Point",
								"temperature": 40
							}
						],
						"dataType":"string"
					}
				]
			}
		]
}

var expl3 = {"IDkey":"ESP-1","sensors":{"1":{"type":"humidity","value":0},"2":{"type":"temperature","value":0}}}


var shemas  = [schema,schema2]
var index = -1
for (var i = 0; i < shemas.length; i++) {
	let s = shemas[i]
	
	Joi.validate(device, s, function (err, s) {
		if(err === null)
			{
				index = i
				return;
			}
		else if(index === -1 && i === shemas.length-1 )
			console.log('model nn compatible')
	});
}

if(index>-1){
	var keys = Object.keys(schemas)
	listFunction[keys[index]](device)
}





// --------------------------------- Validation Schema Service ----------------------------------------



app.post('/ValidateSchema', function (req, res){
	let data = req.query
	console.log(data)
  	res.send('Valid');	
	
})


// --------------------------------- Running Local Server ----------------------------------------
console.log("Listening on port 3000");
app.listen(3000, '127.0.0.1')