var objectAssign = require('object-assign')
var binary = require('binary')

function ContextElement (buffer) {
	this.setBuffer(buffer)
	this.setBufferParser(this.createBufferParser())
	this.setData(this.getBufferParser().vars)
}

objectAssign(ContextElement.prototype, {
	setBuffer: function (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Given buffer is not a Buffer instance.')
		this._buffer = buffer
	},
	getBuffer: function () {
		return this._buffer
	},
	createBufferParser: function () {
		var parser = binary.parse(this.getBuffer())
		parser.word64bu('id')
		return parser
	},
	setBufferParser: function (parser) {
		this._parser = parser
	},
	getBufferParser: function () {
		return this._parser
	},
	setData: function (data) {
		this._data = data
	},
	getData: function () {
		return this._data
	},
	getAttributeValue: function (name) {
		return this.getData()[name]
	},
	getPayloadId: function () {
		return this.getAttributeValue('id')
	},
	setMetadata: function (metadata) {
		this._metadata = metadata
	},
	getMetadata: function () {
		return this._metadata
	},
})

module.exports = ContextElement
