
var youkuFooter = '<p class="banben"><span>系统版本：</span><span id="youkuversion"></span>&nbsp;&nbsp;&nbsp;服务热线：400-805-8811</p>'
        +'<p class="weixin">微信公众号：ytluyoubao&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;© 2015 优酷土豆路由宝</p>';
		
var youkuFooter1 = '<p class="banben"><span>系统版本：</span><span id="youkuversion2"></span>&nbsp;&nbsp;&nbsp;服务热线：400-805-8811</p>'
        +'<p class="weixin">微信公众号：ytluyoubao&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;© 2015 优酷土豆路由宝</p>';

$(document.body).ready(function(){
	$(".foter").html(youkuFooter);
	$(".foterext").html(youkuFooter1);
	var tmpstr = window.location.href;
    if(tmpstr.match("ver")){
		$("#youkuversion").html(tmpstr.substr(tmpstr.indexOf("=")+1));
	};
});
