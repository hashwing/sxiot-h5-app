function magicCode(ssid, password) {
	var length = ssid.length + password.length + 1
	var magicCode = new Array
	magicCode[0] = 0x00 | (length >> 4 & 0xF)
	if(magicCode[0] == 0) {
		magicCode[0] = 0x08
	}
	magicCode[1] = 0x10 | (length & 0xF)
	var crc8 = CRC8Str(ssid)
	magicCode[2] = 0x20 | (crc8 >> 4 & 0xF)
	magicCode[3] = 0x30 | (crc8 & 0xF)
	return magicCode
}

function prefixCode(password) {
	var length = password.length
	var prefixCode = new Array
	prefixCode[0] = 0x40 | (length >> 4 & 0xF)
	prefixCode[1] = 0x50 | (length & 0xF)
	var crc8 = CRC8Hex(length)
	prefixCode[2] = 0x60 | (crc8 >> 4 & 0xF)
	prefixCode[3] = 0x70 | (crc8 & 0xF)
	return prefixCode
}

function sequence(index, data) {
	var content = new Array
	content[0] = index & 0xFF;
	for(var i = 1; i < data.length + 1; i++) {
		content[i] = data[i - 1]
	}
	var crc8 = CRC8Array(content)
	var sequenceCode = new Array
	sequenceCode[0] = 0x80 | crc8
	sequenceCode[1] = 0x80 | index

	for(var i = 0; i < data.length; i++) {
		sequenceCode[2 + i] = data[i] | 0x100
	}
	return sequenceCode
}

function dataCode(ssid, password) {
	var data = password + "1" + ssid
	data = data.split('').map(function(x) {
		return x.charCodeAt(0)
	})
	var index = 0
	var content = new Array
	var dataArr = new Array
	for(index = 0; index < parseInt(data.length / 4); index++) {
		for(var j = 0; j < 4; j++) {
			content[j] = data[index * 4 + j]
		}
		var sd = sequence(index, content);
		for(var k = 0; k < sd.length; k++) {
			dataArr.push(sd[k])
		}
	}

	if(data.length % 4 != 0) {
		var content = new Array
		for(var j = 0; j < data.length % 4; j++) {
			content[j] = data[index * 4 + j]
		}
		var sd = sequence(index, content);
		for(var k = 0; k < sd.length; k++) {
			dataArr.push(sd[k])
		}
	}
	return dataArr
}

// "Class" for calculating CRC8 checksums...
function CRC8(polynomial) { // constructor takes an optional polynomial type from CRC8.POLY
	if(polynomial == null) polynomial = CRC8.POLY.CRC8_DALLAS_MAXIM
	this.table = CRC8.generateTable(polynomial);
}

// Returns the 8-bit checksum given an array of byte-sized numbers
CRC8.prototype.checksum = function(byte_array) {
	var c = 0

	for(var i = 0; i < byte_array.length; i++) {
		b = CRC8.RByte(byte_array[i])
		c = this.table[(c ^ b) % 256]
	}
	c = CRC8.RByte(c)
	return c ^ 0x00;
}

CRC8.RByte = function(val) {
	var rval
	for(var i = 0; i < 8; i++) {
		if((val & (1 << i)) != 0) {
			rval |= 0x80 >> i
		}
	}
	return rval
}

// returns a lookup table byte array given one of the values from CRC8.POLY 
CRC8.generateTable = function(polynomial) {
	var csTable = [] // 256 max len byte array

	for(var i = 0; i < 256; ++i) {
		var curr = i
		for(var j = 0; j < 8; ++j) {
			if((curr & 0x80) !== 0) {
				curr = ((curr << 1) ^ polynomial) % 256
			} else {
				curr = (curr << 1) % 256
			}
		}
		csTable[i] = curr
	}

	return csTable
}

// This "enum" can be used to indicate what kind of CRC8 checksum you will be calculating
CRC8.POLY = {
	CRC8: 0xd5,
	CRC8_CCITT: 0x07,
	CRC8_DALLAS_MAXIM: 0x31,
	CRC8_SAE_J1850: 0x1D,
	CRC_8_WCDMA: 0x9b,
}

function CRC8Str(str) {
	var byte_array = str.split('').map(function(x) {
		return x.charCodeAt(0)
	})
	var crc8 = new CRC8()
	return checksum = crc8.checksum(byte_array)
}

function CRC8Array(arr) {
	var crc8 = new CRC8()
	return crc8.checksum(arr)
}

function CRC8Hex(hex) {
	var byte_i = [hex]
	var crc8 = new CRC8()
	return crc8.checksum(byte_i)
}

function getWifiName() {
		var wifiManager, wifiInfo;
		var Context = plus.android.importClass("android.content.Context");
		var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
		var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");
		wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
		wifiInfo = wifiManager.getConnectionInfo();
		var ssid = wifiInfo.getSSID() || '';
		if(ssid.length == 0) {
			return null;
		}
		//一些手机上获取SSID是有值的，但是实际IP为空，真实为未连接
		var i = parseInt(wifiInfo.getIpAddress());
		var ipStr = (i & 0xFF) + "." +
			((i >> 8) & 0xFF) + "." +
			((i >> 16) & 0xFF) + "." +
			(i >> 24 & 0xFF);
		if(ipStr == "0.0.0.0") {
			return null;
		}

		if(ssid != "<unknown ssid>" && ssid.toUpperCase() != "0X") {
			return ssid.replace(/\"/g, "");
		}
		return null;
};