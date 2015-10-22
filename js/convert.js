var ContextElement = require('./contextElement')

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement instance.')

	var parser = el.getBufferParser()
	var attributes = el.getMapping().attributes

	for (var i in attributes) {
		var attr = attributes[i]
		var size = null
		var bigEndian = true
		var signed = false

		if (attr.type === 'integer') {
			size = parseInt(attr.value) * 8
			signed = true
		} else {
			return cb('Unsupported data type ' + attr.type)
		}

		var method = 'word' + size + (bigEndian ? 'b' : 'l') + (signed ? 's' : 'u')

		if (typeof parser[method] !== 'function') {
			return cb('Unsuported binary parser method ' + method)
		}

		parser[method](attr.name)
	}

	cb()
}
