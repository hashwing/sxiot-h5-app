var SwitchTemplate = {
	Create: function(switchObj) {
		var htmlStr = `<div class="hui-list device-desc-list" id="all-`+switchObj.device_id+`">
	        <ul>
	            <li>
	            	<a><span id="name-`+switchObj.device_id+`">` + switchObj.device_alias+`</span>
	            		<span class="device-val">
			            	<div class="hui-switch" id="` + switchObj.device_id + `"><span>off</span>
			            		<div class="hui-switch-in"></div>
			            	</div>
		            	</span>
	            	</a>
	            </li>
	        </ul>
   		</div>`;
		hui("#device-list").html(hui("#device-list").html()+htmlStr);
		
	},
	Change:function(switchObj){
		hui('#'+switchObj.device_id).switchBox(['off', 'on'], function(res) {
			if(res) {
				SendMsg(switchObj.device_id, "1")
			} else {
				SendMsg(switchObj.device_id, "0")
			}
		});
	},
	Update:function(switchObj){
		if (switchObj.data==1){
			hui("#"+switchObj.device_id).setSwitchVal(true)
		}else{
			hui("#"+switchObj.device_id).setSwitchVal(false)
		}	
	}
}

var RangeTemplate = {
	Create: function(rangeObj) {
		var htmlStr = `<div class="hui-list device-desc-list" id="all-`+rangeObj.device_id+`">
	        <ul>
	            <li>
	            	<span class="hui-range">
	                    	<span class="range-title" id="name-`+rangeObj.device_id+`">`+rangeObj.device_alias+`</span>
	    					<input type="range" name="" id="`+rangeObj.device_id+`" min="0" max="100" value="0" />
	    			</span>
	            </li>
	        </ul>
   		</div>`;
		hui("#device-list").html(hui("#device-list").html()+htmlStr);
		
	},
	Change:function(rangeObj){
		hui('#'+rangeObj.device_id).ranging(function(value){
			SendMsg(rangeObj.device_id, value)
		});
	},
	Update:function(rangeObj){
		hui("#"+rangeObj.device_id).val(rangeObj.data)
	}
}

var DataTemplate ={
	Create: function(dataObj){
		var htmlStr =`<div class="hui-list device-desc-list" id="all-`+dataObj.device_id+`">
	        <ul>
	            <li>
	            	<a ><span id="name-`+dataObj.device_id+`">`+dataObj.device_alias+`</span>
	            		<span class="device-val"><span class="hui-badge">
	            			<span id="`+dataObj.device_id+`">--</span> `+dataObj.device_unit+
	            		`</span></span>
	            	</a>
	            </li>
	        </ul>
   		</div>`
	    hui("#device-list").html(hui("#device-list").html()+htmlStr);
	},
	Update:function(dataObj){
		hui("#"+dataObj.device_id).html(dataObj.data)
	}
}


var RangesTemplate = {
	Create: function(rangeObj) {
		var htmlStr = `<div class="hui-accordion">
        <div class="hui-accordion-title">电灯</div>
        <div class="hui-accordion-content">
            <div class="hui-list">
                <ul>
                    <li>
                    	<span class="hui-range">
                    		<span class="range-title">可调电灯</span>
    						<input type="range" name="" id="range1" min="0" max="100" value="20" />
    					</span>
                    </li>
                    <li>
                    	<span class="hui-range">
                    		<span class="range-title">暖度:</span>
    						<input type="range" name="" id="range1" min="0" max="100" value="20" />
    					</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>`;
	},
	Update:function(switchObj){
	}
}