var baseUrl="/cgi-bin/youku-uci?callback=?";
var baseSF="11";
var baseSF2="12";
var urlencode=encodeURIComponent;
var urldecode=decodeURIComponent;
var hostloginurl="login.html";

function createContext(arg){
 var requestObj = {};
 requestObj.context=arg;
 requestObj.t=new Date().getTime();
 return baseSF2+$.base64.encode(JSON.stringify(requestObj));
}

function createSetContext(arg){
 arg.t=new Date().getTime();
 return baseSF2+$.base64.encode(JSON.stringify(arg));
}

var weblogout = function(){
	$.getJSON(baseUrl,{op:"logout",key:$.cookie("key")},function(data){var a=data;});
	window.location.href=hostloginurl+"?t="+new Date().getTime();  	
}

var checkcookie = function(){
	if(!$.cookie("key")){
		window.location.href=hostloginurl+"?t="+new Date().getTime();
	}
}

var saveincookie = function(curver,wanmac,wanIP){
	$.cookie("curver",curver,{expires:0.25});
	$.cookie("wanmac",wanmac,{expires:0.25});
	$.cookie("wanIP",wanIP,{expires:0.25});
}

Date.prototype.format = function(format){ 
	var o = { 
	"M+" : this.getMonth()+1, //month 
	"d+" : this.getDate(), //day 
	"h+" : this.getHours(), //hour 
	"m+" : this.getMinutes(), //minute 
	"s+" : this.getSeconds(), //second 
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
	"S" : this.getMilliseconds() //millisecond 
	}

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	}

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
}

var getDateStr = function(str){
	var strDate = new Date(str);
	return strDate.format("yyyy-MM-dd hh:mm:ss");
}

var getfromcookie = function(){
	if($.cookie("curver")){
		$("#youkuversion").html($.cookie("curver"));
	}
	
	if($.cookie("wanmac")){
		$("#wanmac").html($.cookie("wanmac"));
	}
	
	if($.cookie("wanIP")){
		$("#wanIP").html($.cookie("wanIP"));
	}
}

var checkresult = function(data){
	checkcookie();
	if(data.result && (data.result==4031 || data.result==4033)){
		window.location.href=hostloginurl+"?t="+new Date().getTime();
	}
	
	if(data.result && (data.result==4034)){
		window.location.href="403.html?t="+new Date().getTime();
	}
}

var isMobile = function(){
	var u = navigator.userAgent;
    return (u.indexOf('Mobile')>-1)||!!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/Windows Phone/)||!!u.match(/Android/)||!!u.match(/MQQBrowser/);
};

//简单对话框
var publicoverLay=function(){
 //固定只出现一个遮罩层节点
 var overLay=$("#YKRouterOverLayId");
 if(overLay.length==0){
	var position="fixed",height="100%";
	var isIE6=function(){
        if ($.browser.msie && $.browser.version == "6.0") return true;
        return false;
    };
	if(isIE6()===true){
	     position="absolute";
	     height=brHeight();
    }
   overLay=$('<div id="YKRouterOverLayId"></div>').css({
	"background":"#000",
	"opacity":0.65,
	"z-index":2000,
	"left":0,
	"top":0,
	"position":position,
	"width":"100%",
	"height":height
	}).appendTo($(document.body));
 }
 overLay.show();
 return overLay; 
}; 
   
var qrcodeBox=function(option){
    //默认模板
     template='<div class="qrcodebox" id="showqrcode">'+
        '<a href="##" class="box_close"></a>'+
        '<h2>微信客服</h2>'+
        '<p>扫一扫添加微信公众号，把您的问题反馈给我们。</p>'+
        '<div class="qrimage"></div>'+
        '</div>';
     
	 var layer=$("#showqrcode"),overlay=null;
     if(layer.length==0){
		 layer=$(template).appendTo($(document.body));
		 layer.css("z-index",4000);
	 }
     layer.show();
     overlay=publicoverLay();
     layer.delegate(".box_close","click",function(e){
	   layer.hide();   
       overlay && overlay.fadeOut();
     });
};

function maxdata_post(options) {
	var iframepost=$("#iframepost");
	if(iframepost.length==0){
		iframepost=$('<iframe name="iframepost" id="iframepost" style="display:none"></iframe>').appendTo($(document.body));
	}
	
	var tempform = $("#postform");
	if(tempform.length==0){
		tempform=$('<form name="postform" id="postform" style="display:none"></form>').appendTo($(document.body));
	}else{
		tempform.remove();
		tempform=$('<form name="postform" id="postform" style="display:none"></form>').appendTo($(document.body));
	}

	tempform.attr("action", options.url);
	tempform.attr("method", "post");
	tempform.attr("enctype", "multipart/form-data");
	tempform.attr("encoding", "multipart/form-data");
	tempform.attr("target", "iframepost");
	
    for (var x in options.params) { 
		$('<textarea />').attr("name", x).val(options.params[x]).appendTo(tempform);
    } 
    tempform.submit(); 
	
	$(document.getElementById("iframepost"))
		.load(function () {
			iframeContents = document.getElementById("iframepost").contentWindow.document.body.innerHTML;
			var rsp = iframeContents.match(/^\{.*?\}$/);
			rsp = $.parseJSON(rsp[0]);
			options.success(rsp);
		});
	return false; 
}

$(document.body).ready(function(){
	$('.topmenu').on("click",function(){
		var _this=$(this);
		if(!_this.hasClass("current")){
			window.location.href=_this.attr("dataurl")+"?t="+new Date().getTime();
		}
	});
	
	getfromcookie();
});
