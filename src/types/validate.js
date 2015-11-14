export default {
	min: (current, value) => Math.max(current, value),
	max: (current, value) => Math.min(current, value),
}
