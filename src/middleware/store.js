import handleAdapter from '../handleAdapter'

export default (config) => {
	return (req, res, next) => {
		handleAdapter(req, config, next, next)
	}
}
