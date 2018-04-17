var mqtt_ip='119.29.154.98'
var mqtt_port=8083
var api_base='http://119.29.154.98:9005/api/app'


function Get(url,success,err){
	var token=plus.storage.getItem("token")
	hui.getSxito(url,token,success, err)
}

function Post(url,pd,success, err){
	var token=plus.storage.getItem("token")
	hui.postSxito(url,token,pd,success, err)
}
