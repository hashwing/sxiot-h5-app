function GetNews() {
	Get(
		api_base + '/news/find',
		function(msg) {
			hui('#news-list').html('')
			if(msg == null) {
				hui.loading(false, true);
				return
			}
			msg.forEach(function(v, i) {
				var html = `<li>
            			<a href="">
	                	<div class="hui-media-list-img"><img src="../img/device.jpg" /></div>
	                	<div class="hui-media-content">
	                    	<h1 id="device-name">` + v.news_title + `</h1> 
	                    	<p>` + v.news_content + `</p>
	                	</div>
            		</a>
        			</li>`
	            hui('#news-list').html(hui('#news-list').html() + html)
				hui.loading(false, true);
			})
		},
		function(e) {
			hui.toast('网络错误');
			hui.loading(false, true);
		}
	)
}