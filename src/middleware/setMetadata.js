import handleAdapter from '../handleAdapter'

export default (config) => {
	return (req, res, next) => {
		handleAdapter(req, config, next, (err) => {
			if (err) {
				err = new Error(err)
				err.statusCode = 400
			}
			next(err)
		})
	}
}
