var ContextElement = require('./contextElement')
var VM = require('vm2').VM

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

	var attributes = el.getMapping().attributes

	for (var i in attributes) {
		var attr = attributes[i]

		if ( ! Array.isArray(attr.metadatas)) continue

		attr.metadatas.forEach(function (meta) {
			if (meta.name !== 'calibrate') return

			var vm = new VM({
				timeout: 1000,
				sandbox: {
					val: el.getAttributeValue(attr.name)
				},
			})
			var value = vm.run('(' + decodeURI(meta.value) + ')(val)')
			el.setAttributeValue(attr.name, value)
		})
	}

	cb()
}
