var ContextElement = require('../js/contextElement')
var convert = require('../js/convert')

var elem = new ContextElement(new Buffer('f03d29100000118032332e31342c2032332e32302c20313031342c2035352e3538', 'hex'))

console.log(elem.getPayloadId())

elem.setMapping({
	attributes: [
		{
			name: 'temp1',
			type: 'asciiFloat',
			value: '5',
		},
		{
			name: 'skip1',
			type: 'skip',
			value: '2',
		},
		{
			name: 'temp2',
			type: 'asciiFloat',
			value: '5',
		},
		{
			name: 'skip2',
			type: 'skip',
			value: '2',
		},
		{
			name: 'humidity',
			type: 'asciiInteger',
			value: '4',
		},
		{
			name: 'skip3',
			type: 'skip',
			value: '2',
		},
		{
			name: 'pressure',
			type: 'asciiFloat',
			value: '5',
		},
	]
})

convert(elem, function (err) {
	console.log(err)
	console.log(elem.getData())
})