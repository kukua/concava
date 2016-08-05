export default {
	min: (val, limit) => (val < parseFloat(limit) ? null : val),
	max: (val, limit) => (val > parseFloat(limit) ? null : val),
}
