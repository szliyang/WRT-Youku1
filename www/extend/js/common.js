var showUGold = 1;
var fixedEnable = 1;
var customName = "标准版";
var AppManageEnable = 1;

var youkulogo = '<img src="extend/img/logo.png"/><span onclick=\'window.location.href="dashboard.html";\'>优酷土豆路由宝</span>';

var youkuHeadMenu = '<a href="##" id="logoutbtn">退出</a>'
        +'<a href="##" onclick="return qrcodeBox();">微信客服</a>'
		+'<a href="http://pcdnapi.youku.com/pcdn/entry/index?from=official" target="_blank">官网</a>'
        +'<a href="http://pcdnapi.youku.com/pcdn/entry/index?from=app_download" target="_blank">APP下载</a>';
		
var youkuFooter = '<p><span>系统版本：</span><span id="youkuversion"></span><span>　MAC地址：</span>'
          +'<span id="wanmac"></span><span>　WAN IP地址：</span><span id="wanIP" class="np"></span>'
          +'<span>　服务热线：400-805-8811</span><span>　微信公众号：ytluyoubao&nbsp;&nbsp;</span><span class="np">© 2015 优酷土豆路由宝</span>'
          +'</p>';

$(document.body).ready(function(){
	$(".logo").html(youkulogo);
	$(".nav_right").html(youkuHeadMenu);
	$(".footer").html(youkuFooter);
	$(".nav_right").delegate("#logoutbtn","click",function(){ weblogout();});
    $.getJSON(baseUrl,{op:"get",context:createContext("basic"),key:$.cookie("key")},function(data){
		checkresult(data);
		if(data.result==0){
			var hrefUrl = 'http://pcdnapi.youku.com/pcdn/market/index?pid='+encodeURIComponent(data.data.crypid)+'&rkey='+encodeURIComponent(data.data.rkey);
			var plugHtml = '<a href="'+hrefUrl+'" id="gotoPlug" target="_blank" style="width:85px;color:#ffff99;">扩展应用</a>';
			$.getJSON("http://pcdnapi.youku.com/pcdn/sysconf/entry?callback=?",{pid:data.data.crypid},function(datatmp){
			    if(datatmp.code==0 && typeof(datatmp.data.plugin) != "underfined" && datatmp.data.plugin==1){
			        $(".nav_right").css("width","285px");
			        $(".nav_right").append(plugHtml);
				}
			});
		}
	});
});
