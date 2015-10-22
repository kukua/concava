var ContextElement = require('./contextElement')

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

	var metadata = el.getMetadata()

	for (var i in metadata) {
		var attr = metadata[i]

		if ( ! Array.isArray(attr.metadatas)) continue

		var value = el.getAttributeValue(attr.name)

		attr.metadatas.forEach(function (meta) {
			if (meta.name === 'min' && meta.type === 'integer') {
				value = Math.max(value, meta.value)
			} else if (meta.name === 'min' && meta.type === 'integer') {
				value = Math.min(value, meta.value)
			}
		})

		el.setAttributeValue(attr.name, value)
	}

	cb()
}
