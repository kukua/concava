export default {
	integer (name, length) {
		length = parseInt(length)
		var value = parseInt(this.buffer.toString('hex', this.pointer, this.pointer + length), 16)

		this.pointer += length
		this.data.setValue(name, value)
	},
	ascii (name, length) {
		length = parseInt(length)
		var value = this.buffer.toString('ascii', this.pointer, this.pointer + length)

		this.pointer += length
		this.data.setValue(name, value)
	},
	asciiFloat (name, length) {
		var err = this.getType('ascii').call(this, name, length)
		if (err) return err

		var value = parseFloat(this.data.getValue(name))

		this.data.setValue(name, value)
	},
	asciiInteger (name, length) {
		var err = this.getType('ascii').call(this, name, length)
		if (err) return err

		var value = parseInt(this.data.getValue(name), 10)

		this.data.setValue(name, value)
	},
	skip (name, bits) {
		this.pointer += parseInt(bits)
	},
}
