var SensorData = require('./SensorData')

var converters = {
	integer: function (name, length) {
		length = parseInt(length)
		var value = parseInt(this.buffer.toString('hex', this.pointer, this.pointer + length), 16)

		this.pointer += length
		this.data.setValue(name, value)
	},
	ascii: function (name, length) {
		length = parseInt(length)
		var value = this.buffer.toString('ascii', this.pointer, this.pointer + length)

		this.pointer += length
		this.data.setValue(name, value)
	},
	asciiFloat: function (name, length) {
		var err = this.converters.ascii.call(this, name, length)
		if (err) return err

		var value = parseFloat(this.data.getValue(name))

		this.data.setValue(name, value)
	},
	asciiInteger: function (name, length) {
		var err = this.converters.ascii.call(this, name, length)
		if (err) return err

		var value = parseInt(this.data.getValue(name), 10)

		this.data.setValue(name, value)
	},
	skip: function (name, bits) {
		this.pointer += parseInt(bits)
	},
}

module.exports = function (data, cb) {
	if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

	var attributes = data.getMetadata().getAttributes()
	var context = {
		data: data,
		buffer: data.getBuffer(),
		pointer: 8,
		converters: converters,
	}

	for (var i = 0; i < attributes.length; i += 1) {
		var attr = attributes[i]
		var method = attr.getType()
		var fn = converters[method]

		if (typeof fn !== 'function') {
			return cb('Unsuported converter: ' + method)
		}

		var err = fn.call(context, attr.getName(), attr.getValue())

		if (err) {
			return cb(err)
		}
	}

	cb()
}
