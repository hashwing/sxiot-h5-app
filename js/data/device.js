var DeviceType = new Array();

function GetDeviceList(id) {
	hui("#device-list").html('');
	Get(
		api_base + '/son/find?gateway_id=' + id,
		function(msg) {
			msg.forEach(function(v, i) {
				switch(v.brand_id) {
					case "range":
						RangeTemplate.Create({
							device_id: v.device_id,
							device_alias: v.device_alias,
							device_unit: v.device_unit
						})
						DeviceType[v.device_id] = RangeTemplate;
						LinkDevice(v.device_id);
						break;
					case "switch":
						SwitchTemplate.Create({
							device_id: v.device_id,
							device_alias: v.device_alias,
							device_unit: v.device_unit
						})
						DeviceType[v.device_id] = SwitchTemplate;
						LinkDevice(v.device_id);
						break;
					case "data":
						DataTemplate.Create({
							device_id: v.device_id,
							device_alias: v.device_alias,
							device_unit: v.device_unit
						})
						DeviceType[v.device_id] = DataTemplate;
						LinkDevice(v.device_id);
				}
			});
			msg.forEach(function(v, i) {
				switch(v.brand_id) {
					case "range":
						RangeTemplate.Change({
							device_id: v.device_id,
							device_alias: v.device_alias,
							device_unit: v.device_unit
						})
						break;
					case "switch":
						SwitchTemplate.Change({
							device_id: v.device_id,
							device_alias: v.device_alias,
							device_unit: v.device_unit
						})
						break;
				}
				SendMsg(v.device_id,"update") 
				hui('#name-' + v.device_id).longTap(function() {
					hui.prompt('新的设备名称', ['取消','确定'], function(name){
        				UpdateDevice(v.device_id,id,name)
    				}, '新的设备名称');
				});
			});
		},
		function(e) {
			hui.toast('网络错误');
		}
	)

	//	DataTemplate.Create({
	//		device_id: "a123",
	//		device_alias: "温度",
	//		device_unit: "℃"
	//	})
	//	DeviceType['a123'] = DataTemplate;
	//	LinkDevice('a123');
	//	RangeTemplate.Create({
	//		device_id: "a124",
	//		device_alias: "亮度",
	//		device_unit: "%"
	//	})
	//	DeviceType['a124'] = RangeTemplate;
	//	LinkDevice('a124');
	//	SwitchTemplate.Create({
	//		device_id: "a126",
	//		device_alias: "灯开关",
	//		device_unit: "%"
	//	})
	//	DeviceType['a126'] = SwitchTemplate;
	//	LinkDevice('a126');
	//	SwitchTemplate.Change({
	//		device_id: "a125",
	//		device_alias: "灯开关",
	//		device_unit: "%"
	//	})
	//	RangeTemplate.Change({
	//		device_id: "a124",
	//		device_alias: "亮度",
	//		device_unit: "%"
	//	})
	//	SwitchTemplate.Change({
	//		device_id: "a126",
	//		device_alias: "灯开关",
	//		device_unit: "%"
	//	})
}

function AddGateway(gid) {
	hui.prompt('请输入设备名称', ['取消', '确定'], function(name) {
		Post(
			api_base + '/device/add', {
				gateway_id: gid,
				device_alias: name
			},
			function(msg) {
				GetGateway()
				hui.toast('添加成功')
			},
			function(e) {
				hui.iconToast('添加失败', 'warn');
			}
		)
	}, '例如 : 我的设备');
}

function GetGateway() {
	hui.loading('获取网关列表。。。');
	Get(
		api_base + '/device/find',
		function(msg) {
			hui('#gateway-id').html('')
			if (msg==null){
				hui.loading(false, true);
				return
			}
			msg.forEach(function(v, i) {
				var status=`<span style="color:red;font-size:13px">离线</span>`
				if (v.device_status){
					status=`<span style="color:green;font-size:13px">在线</span>`
				} 
				var html = `<li id="` + v.device_id + `">
            	<a href="">
	                <div class="hui-media-list-img"><span class="iconfont icon-luyouqi"></span></div>
	                <div class="hui-media-content">
	                    <h1 id="device-name">` + v.device_alias + `</h1> 
	                    <p>状态:`+status+`</p>
	                </div>
            	</a>
        	</li>`
				hui('#gateway-id').html(hui('#gateway-id').html() + html)
			});
			msg.forEach(function(v, i) {
				hui('#' + v.device_id).longTap(function() {
					//					
					var actionbuttons = [{
						title: "编辑"
					}, {
						title: "删除"
					}];
					var actionstyle = {
						title: "请选择操作",
						cancel: "取消",
						buttons: actionbuttons
					};
					plus.nativeUI.actionSheet(actionstyle, function(e) {
						if(e.index == 1) {
							hui.prompt('新的设备名称', ['取消','确定'], function(name){
        						UpdateGateway(v.id,v.device_id,name)
    						}, '新的设备名称');
						}
						if(e.index == 2) {
							hui.confirm('您确认要删除该设备吗？', ['取消', '确定'], function() {
								DelGateway(v.device_id);
							});
						}
					});
				});
				if (v.device_status){
					hui('#' + v.device_id).click(function() {
						toDesc(v.device_id, v.device_alias)
					});
				}
			});
			hui.loading(false, true);
		},
		function(e) {
			hui.toast('网络错误');
			hui.loading(false, true);
		}
	)
}

function DelGateway(gid) {
	Post(
		api_base + '/device/del', {
			device_id: gid,
		},
		function(msg) {
			GetGateway() 
			hui.toast('删除成功')
		},
		function(e) {
			hui.iconToast('删除失败', 'warn');
		}
	)
}

function UpdateGateway(id,gid,name) {
	Post(
		api_base + '/device/update', {
			id: id,
			gateway_id: gid,
			device_alias:name
		},
		function(msg) {
			GetGateway() 
			hui.toast('更新成功')
		},
		function(e) {
			hui.iconToast('更新失败', 'warn');
		}
	)
}

function UpdateDevice(id,gid,name) {
	Post(
		api_base + '/son/update', {
			device_id: id,
			device_name:name
		},
		function(msg) {
			GetDeviceList(gid)
			hui.toast('更新成功')
		},
		function(e) {
			hui.iconToast('更新失败', 'warn');
		}
	)
}