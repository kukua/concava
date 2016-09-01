import Converter from '../Converter'
import Calibrator from '../Calibrator'
import Validator from '../Validator'
import defaultConvertTypes from '../types/convert'
import defaultValidateTypes from '../types/validate'

var converter = new Converter()
var calibrator = new Calibrator()
var validator = new Validator()

export let convert = (types) => {
	converter.setTypes(types || defaultConvertTypes)

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

export let validate = (types) => {
	validator.setTypes(types || defaultValidateTypes)

	return (req, res, next) => {
		validator.validate(req.data)
		next()
	}
}
