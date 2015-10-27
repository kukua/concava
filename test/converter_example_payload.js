var fs = require('fs')
var ContextElement = require('../js/contextElement')
var convert = require('../js/convert')

var elem = new ContextElement(fs.readFileSync(__dirname + '/payload.data'))

console.log(elem.getBuffer(), elem.getPayloadId())

elem.setMapping({
	attributes: [
		{
			name: 'attr1',
			type: 'integer',
			value: '4',
			metadatas: [
				{
					name: 'min',
					type: 'integer',
					value: 100,
				},
				{
					name: 'max',
					type: 'integer',
					value: 1300,
				},
				{
					name: 'calibrate',
					type: 'function',
					value: 'function%28a%29%7Breturn%20a%2D58.3%7D',
				},
			],
		},
	]
})

convert(elem, function (err) {
	console.log(err)
	console.log(elem.getData())
})
