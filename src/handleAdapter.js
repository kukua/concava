import SensorData from './SensorData'
import SensorAttribute from './SensorAttribute'

export default (req, config, skip, cb) => {
	var method = config.method

	if (typeof method !== 'function') return skip()

	var args = [req, config, req.data, { SensorData, SensorAttribute }, cb]

	if (method.length === 4) args.splice(3, 1)

	method.apply(null, args)
}
