var ContextElement = require('./contextElement')

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

	var attributes = el.getMapping().attributes

	for (var i in attributes) {
		var attr = attributes[i]

		if ( ! Array.isArray(attr.metadatas)) continue

		attr.metadatas.forEach(function (meta) {
			if (meta.name !== 'calibrate' || meta.type !== 'function') return

			eval('var __UNSAFE_FN = ' + decodeURI(meta.value))

			var value = el.getAttributeValue(attr.name)
			value = __UNSAFE_FN(value)
			el.setAttributeValue(attr.name, value)
		})
	}

	cb()
}
