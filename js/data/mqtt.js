var client
var client_id

function connect(id){
	client_id=id
	client = new Paho.MQTT.Client(mqtt_ip, mqtt_port, "app_"+client_id);
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	hui.loading('正在连接服务器。。。');
	client.connect({onSuccess:onConnect,userName:client_id,password:"123456",keepAliveInterval:40,reconnect:true});
}

function onConnect() {
  	hui.loading(false, true);
	hui.loading('获取设备列表。。。');
	GetDeviceList(client_id);
	hui.loading(false, true);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
  	hui.loading('网络连接中断，正在重连。。。');
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
	if (message.payloadString!="update"){
		console.log(message.payloadString)
		DeviceType[message.destinationName].Update({device_id:message.destinationName,data:message.payloadString});
	}
}

function LinkDevice(device_id){
	client.subscribe(device_id);
}

function SendMsg(device_id,send_data){
	message = new Paho.MQTT.Message(send_data);
  message.destinationName = device_id;
  client.send(message);
}
