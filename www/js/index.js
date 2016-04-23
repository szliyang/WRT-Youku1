$(document.body).ready(function(){

	$(".nav_top>li").on('click',function(){
		var _this=$(this);
		$(".nav_top>li").removeClass("current");
		_this.addClass("current");
		
		$("#secodemenu").hide();
		if(_this.find("a").attr("id")=="topmenu5"){
			$("#secodemenu").show();
			$(".nav-lists>li").removeClass("current");
			$(".nav-lists>li:first").addClass("current");
		}
		
		var _clickTab = _this.find('a').attr('target');
 　　　 $("#iframepage").attr("src", _clickTab+"?t="+new Date().getTime());
		
	});

	$(".nav-lists>li").on('click',function(){
		var _this=$(this);
		$(".nav-lists>li").removeClass("current");
		_this.addClass("current");
		var _clickTab = _this.find('a').attr('target');
 　　　 $("#iframepage").attr("src", _clickTab+"?t="+new Date().getTime());
	});
	
	$("#logoutbtn").on("click",function(){
		$.getJSON(baseUrl,{op:"logout",key:$.cookie("key")},function(data){var a=data;});
		window.location.href=hostloginurl;  
	});
	
});

