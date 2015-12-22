import Converter from '../Converter'
import Calibrator from '../Calibrator'
import Validator from '../Validator'
import convertTypes from '../types/convert'
import validateTypes from '../types/validate'

var converter = new Converter(convertTypes)
var calibrator = new Calibrator()
var validator = new Validator(validateTypes)

export let convert = () => {
	return (req, res, next) => {
		converter.convert(req.data)
		next()
	}
}

export let calibrate = () => {
	return (req, res, next) => {
		calibrator.calibrate(req.data)
		next()
	}
}

export let validate = () => {
	return (req, res, next) => {
		validator.validate(req.data)
		next()
	}
}
