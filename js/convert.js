var ContextElement = require('./contextElement')

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement instance.')

	var parser = el.getBufferParser()
	var metadata = el.getMetadata()

	for (var i in metadata) {
		var attr = metadata[i]
		var size = null
		var bigEndian = true
		var signed = false

		if (attr.type === 'integer') {
			size = attr.length * 8
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
