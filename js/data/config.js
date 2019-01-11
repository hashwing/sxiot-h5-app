var mqtt_ip='iot.ggproject.cn'
var mqtt_port=8884
var api_base='http://'+mqtt_ip+':9005/api/app'


function Get(url,success,err){
	var token=plus.storage.getItem("token")
	hui.getSxito(url,token,success, err)
}

function Post(url,pd,success, err){
	var token=plus.storage.getItem("token")
	hui.postSxito(url,token,pd,success, err)
}
