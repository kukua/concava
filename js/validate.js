var ContextElement = require('./contextElement')

module.exports = function (el, cb) {
	if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

	console.log('Validate')
	cb()
}
