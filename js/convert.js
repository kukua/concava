var ContextElement = require('./contextElement')

var converters = {
	integer: function (name, length) {
		length = parseInt(length)
		var value = parseInt(this.buffer.toString('hex', this.pointer, this.pointer + length), 16)

		this.pointer += length
		this.el.setAttributeValue(name, value)
	},
	ascii: function (name, length) {
		length = parseInt(length)
		var value = this.buffer.toString('ascii', this.pointer, this.pointer + length)

		this.pointer += length
		this.el.setAttributeValue(name, value)
	},
	asciiFloat: function (name, length) {
		var err = this.converters.ascii.call(this, name, length)
		if (err) return err

		var value = parseFloat(this.el.getAttributeValue(name))

		this.el.setAttributeValue(name, value)
	},
	asciiInteger: function (name, length) {
		var err = this.converters.ascii.call(this, name, length)
		if (err) return err

		var value = parseInt(this.el.getAttributeValue(name), 10)

		this.el.setAttributeValue(name, value)
	},
	skip: function (name, bits) {
		this.pointer += parseInt(bits)
	},
}

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement instance.')

	var attributes = el.getMapping().attributes
	var context = {
		el: el,
		buffer: el.getBuffer(),
		pointer: 8,
		converters: converters,
	}

	for (var key in attributes) {
		var attr = attributes[key]
		var method = attr.type
		var fn = converters[method]

		if (typeof fn !== 'function') {
			return cb('Unsuported converter: ' + method)
		}

		var err = fn.call(context, attr.name, attr.value, attr.metadatas)

		if (err) {
			return cb(err)
		}
	}

	cb()
}
