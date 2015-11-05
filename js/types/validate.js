module.exports = {
	min: function (current, valid) { return Math.max(current, valid) },
	max: function (current, valid) { return Math.min(current, valid) },
}
