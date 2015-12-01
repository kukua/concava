export default {
	int8 (name) {
		this.data.setValue(name, this.buffer.readInt8(this.pointer))
		this.pointer += 1
	},
	uint8 (name) {
		this.data.setValue(name, this.buffer.readUInt8(this.pointer))
		this.pointer += 1
	},
	int16 (name) {
		this.data.setValue(name, this.buffer.readInt16BE(this.pointer))
		this.pointer += 2
	},
	uint16 (name) {
		this.data.setValue(name, this.buffer.readUInt16BE(this.pointer))
		this.pointer += 2
	},
	int32 (name) {
		this.data.setValue(name, this.buffer.readInt32BE(this.pointer))
		this.pointer += 4
	},
	uint32 (name) {
		this.data.setValue(name, this.buffer.readUInt32BE(this.pointer))
		this.pointer += 4
	},
	int64 (name) {
		var value = (Math.pow(2, 32) * this.buffer.readInt32BE(this.pointer)) +
			((this.buffer[this.pointer] & 0x80 === 0x80 ? 1 : -1) * this.buffer.readUInt32BE(this.pointer + 4))
		this.data.setValue(name, value)
		this.pointer += 8
	},
	uint64 (name) {
		var value = (Math.pow(2, 32) * this.buffer.readInt32BE(this.pointer)) +
			(this.buffer.readUInt32BE(this.pointer + 4))
		this.data.setValue(name, value)
		this.pointer += 8
	},
	'float' (name) {
		this.data.setValue(name, this.buffer.readFloatBE(this.pointer))
		this.pointer += 8
	},
	'double' (name) {
		this.data.setValue(name, this.buffer.readDoubleBE(this.pointer))
		this.pointer += 8
	},
	integer (name, length) {
		length = parseInt(length)
		var value = parseInt(this.buffer.toString('hex', this.pointer, this.pointer + length), 16)
		this.data.setValue(name, value)
		this.pointer += length
	},
	ascii (name, length) {
		length = parseInt(length)
		var value = this.buffer.toString('ascii', this.pointer, this.pointer + length)
		this.data.setValue(name, value)
		this.pointer += length
	},
	asciiFloat (name, length) {
		var err = this.getType('ascii').call(this, name, length)
		if (err) return err
		this.data.setValue(name, parseFloat(this.data.getValue(name)))
	},
	asciiInteger (name, length) {
		var err = this.getType('ascii').call(this, name, length)
		if (err) return err
		this.data.setValue(name, parseInt(this.data.getValue(name), 10))
	},
	skip (name, bits) {
		this.pointer += parseInt(bits)
	},
}
