export default (config) => {
	return (req, res, next) => {
		config.method(req, config, req.data, next)
	}
}
