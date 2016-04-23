$(document.body).ready(function(){
	var speed=300, ease='swing',centerLeft=110,centerTop=100;
    var featuresPanel=$('#routerFeaturesPanel');
    var currentBtn=null;
    var commitenableflag=false;
    var accmodevalue = "0";
    var oldconstatus = "1";
    var preheatshowflg=true;
    var bindedrouterflag=0; //是否绑定路由
    var inplanflag=0;  //是否加入计划 0:未加入计划, 1:加入计划，2:退出计划未生效
	var innerNetBaseSet={};
	var netObject;
	
	function setDevPos(){
		var min_height=800;
		var height=document.body.clientHeight || document.documentElement.clientHeight;
		if(height>min_height){
			$(".min_hj").css({"position":"fixed", "z-index":"1000", "bottom":"160px","width":"100%"});
		}else{
			$(".min_hj").css({"position":"static","width":"auto"});
		}
	}
	
	setDevPos();
	
	$(window).resize(function() {
		setDevPos(); 
	});
	
	checkcookie();
	
	if(showUGold==1){
		$(".router-manage").removeClass("router-manage2");
	}else{
		var speednoshow = '已连接互联网';
		$(".min_hj").load("dashboard_nogold.html",function(){setDevPos();});	
		$(".router-manage").addClass("router-manage2");
		$("#router_bhover_box").html(speednoshow);
	}
	
	function getCoinFromServer(){
		var pppoeVal = "";
		if (netObject.wan && netObject.wan.proto && netObject.wan.proto == "pppoe"){
			pppoeVal = "1";
		}else{
			pppoeVal = "0";
		}
		$.ajax({  
			type: "get",
            dataType: "json",
            timeout: 10000,
            url: "https://yun.youku.com/user/get_yjbpage?from=web&pid="+urlencode(innerNetBaseSet.pid)+"&wifiname="+urlencode(netObject.wifi.name)+"&pppoe="+pppoeVal+"&rkey="+urlencode(netObject.rkey)+"&version="+urlencode(netObject.curver)+"&callback=?&t="+new Date().getTime(),
            success:function (data) {
    			$(".min_hj").html(data.html);
    			bindedrouterflag = $("#is-bind").val();//获得是否绑定账号信息
    			speedObject.getUpSpeedOnly();
            },error:function () {
            	var _html = '<div class="purse"><span class="not_p"></span><p id="pursetext">未获取优金币数据，请检查网络连接是否正常或刷新页面。</p></div> ';
				$(".min_hj").html(_html);
				return false;
            }
        });
	}

	//打开面板
	$('#routerFeaturesPanel').find('.btn').on('click',function(){
		var that=$(this);
		currentBtn=that;
		that.animate({"left":centerLeft+"px","top":centerTop+"px"},speed,ease,function(){
			featuresPanel.animate({"opacity":0},speed,ease,function(){
				$(this).hide();
				$('#'+that.attr('data-panel')).show().css('opacity',1);
			});
		});
	});
	  
	//关闭面板
	$('span.close_btn').on('click',function(){
		var that=$(this),
		pos=that.attr('data-pos'),
		arrPos=pos.split('|'),
		closePanel=that.parent();
		closePanel.animate({"opacity":0},speed,ease,function(){
		  $(this).hide();
		  featuresPanel.show().css('opacity',1);
			if(currentBtn.length>=1){
			 currentBtn.animate({'left':arrPos[0]+'px','top':arrPos[1]+'px'},speed,ease);
		   }
		 
		});
	});
		   
	$("#click_event").on("mouseenter",function(){
		$(this).hide();
		$('#hidden_enent').show();
	}); 
	
	$('#hidden_enent').on("mouseleave",function(){
		$(this).hide();
		$("#click_event").show();
	});
		   
	$('.hover_show').on("click",function(){
		window.location.href="device.html";
	});
	 
	$('.hover_show_ri').on("click",function(){
		window.location.href="wan.html";
	});
	 
	$(".set-btn .mode-btn").on("click",function(){
		if(commitenableflag){
			commitenableflag = false;
			var lightmode = "0";
			var lightmodeclass="sun";
			 $(".set-btn .mode-btn").removeClass("current");
			 $(this).addClass("current");
			 if($(this).is(".default-mode")){
			   $(".Putout").hide();
			   $(".quantian").show();
			   lightmode = "0";
			   lightmodeclass="sun";
			 }else{
				$(".quantian").hide();
			   $(".Putout").show();
			   lightmode = "1";
			   lightmodeclass="moon";
			 }
			 var setParam = {};
			 setParam.lightmode = lightmode;
			 setParam.lighttime = innerNetBaseSet.lighttime;
			 $.getJSON(baseUrl,{op:"set",context:createSetContext(setParam),key:$.cookie("key")},function (data) {
				 checkresult(data);
				 commitenableflag=true;
				 featuresPanel.find(".btn[data-panel='panelLight']").html('<span class="'+lightmodeclass+'"></span>');
			 });
		}
	});
	 
	$(".wifiqiangdu>div").on("click",function(){
		if(commitenableflag){
			commitenableflag = false;
			$(".wifiqiangdu>div").find(".active_rida").removeClass("active_rida_cur");
			var activeitem = $(this).find(".active_rida");
			activeitem.addClass("active_rida_cur");
			if(innerNetBaseSet.strengthmode && innerNetBaseSet.strengthmode != activeitem.attr("data-value")){
				var setParam = {};
				var wifi = {};
				wifi.wifi_txpwr = activeitem.attr("data-value");
				setParam.wifi = wifi;
				var signalmode = activeitem.attr("data-class");
				$.getJSON(baseUrl,{op:"set",context:createSetContext(setParam),key:$.cookie("key")},function (data) {
					checkresult(data);
					commitenableflag=true;
					featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="'+signalmode+'"></span>');
					innerNetBaseSet.strengthmode = activeitem.attr("data-value");
				});
			}
		}  
	});
	 
	$(".model_fangke").on("click",function(){
		if(commitenableflag){
			commitenableflag = false;
			$(".restart").show();
			var wifiguest = "true";
			var wifiguestflag = "visitor_Open";
			if($(this).hasClass("guanbi")){
				$(this).removeClass("guanbi");
				wifiguest = "true";
				wifiguestflag = "visitor_Open";
			}else{
				$(this).addClass("guanbi");
				wifiguest = "false";
				wifiguestflag = "visitor_Close";
			}
			 
			var setParam = {};
			var wifi = {};
			wifi.wifi_guest = wifiguest;
			setParam.wifi = wifi;
			$.getJSON(baseUrl,{op:"set",context:createSetContext(setParam),key:$.cookie("key")},function (data) {
				checkresult(data);
				var timer=null,delay=10000;
				$(".restart").html("正在重启Wi-Fi... <span>"+Math.ceil(delay/1000)+"</span>秒"); 
				if(timer) clearInterval(timer);
				timer=setInterval(function(){
					if(delay<=0){
						clearInterval(timer);
						timer=null;
						commitenableflag=true;
						$(".restart").hide();
						featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="'+wifiguestflag+'"></span>');
					}else{
						delay-=1000;
						$(".restart").html("正在重启Wi-Fi... <span>"+Math.ceil(delay/1000)+"</span>秒"); 
					} 
				},1000); 
			});
		 }  
	});
	 
	$(".min_hj").delegate(".tan_moshi","click",function(){
		$("#stException").hide();
		speedObject.getUpSpeed();//获得pid之后，开始调用云端接口获取上行数据信息；
		popup.showId("preloadbandwidth",{layerCss:{position:"fixed",left:"50%",top:"50%"}});
	});
	
//	var timer=null;
//	var upgradeflag = false;
//	var progressupnum = 0;

//	function checkupdate(){
//		$.getJSON(baseUrl,{op:"upgrade",context:createContext("check"),key:$.cookie("key")}, function(data){
//			if ($("#YKRouterOverLayId").length<=0 || ($("#YKRouterOverLayId").length>0 && $("#YKRouterOverLayId").is(":hidden"))) {
//				console.log(data);
//				checkresult(data);
//				var hasupdate = data.data["hasupdate"];
//				if (hasupdate == "1"){
//					
//					$("#ver-now").html(data.data["newver"]);
//					$("#update-size").html("("+data.data["size"]+")");
//					var ref = data.data["descforweb"];
//					if (ref != ""){
//						 $("#updatereference").html('<li>' + ref + '</li>');
//					}
//									
//					popup.showId("updatebox",{layerCss:{position:"fixed",left:"50%",top:"50%", marginLeft:"-220px",marginTop:"-101px"},closeBtn:".close",okBnt:".ok",cancelBtn:".cancel",
//						okBtnClick:function(a,b){
//							popup.hide(a,b,"hide");
//							popup.showId("shengjitanceng",{layerCss:{position:"fixed",left:"50%", top:"50%", marginLeft:"-220px", marginTop:"-101px"},closeBtn:".close" });
//								$("#baras").css("width","0%");
//								$("#baras").animate({width:"100%"},480000,'linear',function(){
//									popup.close($("#shengjitanceng"),"","hide");
//								});
//							$.getJSON(baseUrl, {op:"upgrade", context:createContext("start"), key:$.cookie("key")},function(data){
//								checkresult(data);
//								if (data['result'] == "0"){
//									window.setTimeout(function(){getprocess();},500);
//								}    
//							});				    
//						},
//						cancelBtnClick:	function(a,b){
//							var setParam = {};
//							setParam.setupdatetime = "true"; 
//							$.getJSON(baseUrl, {op:"set", context:createSetContext(setParam), key:$.cookie("key")},function(data){
//								checkresult(data);
//							});				    
//						}
//					});
//				}
//			}
//		});
//	}

//	var updateokflag = true;
//	var timeout;
//
//	function getprocess(){
//		$.getJSON(baseUrl, {op:"upgrade", context:createContext("progress"), key:$.cookie("key")},
//		function(data){ 
//		   checkresult(data);
//		   if (data.result == "0"){
//			   var persent = data.data['persent']; 
//			   if (parseInt(persent) == 100 && updateokflag){
//				   updateokflag = false;
//				   getprocess();
//				   timeout = setTimeout(function(){cycleChackState(5000);},200000);
//			   }else{
//				   getprocess();
//			   } 
//		   }else{
//			   if(data.result == "10032"){
//				   $("#online_error").html("下载失败，请重新检测升级版本！")
//			   }else{
//				   $("#online_error").html("更新失败，请稍后重新检测升级版本！") 
//			   }
//			   $("#baras").stop();
//			   if(timeout){
//				   clearTimeout(timeout);
//			   }
//			   updateokflag = true;
//			   popup.hide($("#shengjitanceng"),"","hide");
//			   popup.showId("onlineerrbox",{layerCss:{position:"fixed",left:"50%", top:"50%", marginLeft:"-220px", marginTop:"-101px"},
//				   closeBtn:".close",okBnt:".ok",
//				   okBtnClick:function(a,b){
//					   popup.close(a,b,"hide");
//				   } 
//			   });
//		   	}
//		});
//	}
	
	$(".min_hj").delegate(".close_bi","click",function(){ 
		$(".lvjing").hide();
		preheatshowflg = false;
	});

	$("#logoutbtn").on("click",function(){ weblogout();});
	
	function getdashboardinfo_yougold(){
		$.getJSON(baseUrl,{op:"get",context:createContext("network"),key:$.cookie("key")},function(data){
			checkresult(data);
			if(data.result==0){
				netObject = data.data;
				var urlparam = "pid=" + urlencode(urlencode(netObject.crypid))+ "&wifiname=" + urlencode(netObject.wifi.name);
				if (netObject.wan && netObject.wan.proto && netObject.wan.proto == "pppoe"){
					urlparam += "&pppoe=1";
				}else{
					urlparam += "&pppoe=0";
				}
				if (netObject.curver) {
					urlparam += "&version="+netObject.curver;
				}
				
				innerNetBaseSet.addfixedurl = "https://yjb.youku.com/pcdn/about/fixed_income.html?fromwhere=1&" + urlparam;
				innerNetBaseSet.quitfixedurl = "https://yjb.youku.com/pcdn/about/fixed_income/quit.html?" + urlparam;
				
				var arr = data.data.uptime.split(',');
				var run_time = '';
				if(arr[0] != '0')
					run_time += arr[0] + '天';
				if(arr[0] != '0' || arr[1] != '0')
					run_time += arr[1] + '小时';
				run_time += arr[2] + '分钟';
				$("#run_time").html("已运行"+run_time);
				$("#dev_count").html(data.data.devicecount);
				$("#dev_count2").html(data.data.devicecount);
				
				innerNetBaseSet.pid = data.data.crypid;
				innerNetBaseSet.pcdnurltokenwithssid = data.data.pcdnurltokenwithssid;	 
				innerNetBaseSet.rkey = data.data.rkey;
				innerNetBaseSet.creditmode = data.data.creditmode;	
				innerNetBaseSet.wifiname = data.data.wifi.name;	
				
				autoUpgrade.checkAuto(data.data.crypid);//检查是否自动更新信息
				
				var constatus = data.data.toweb;
				if(constatus == '1'){
					oldconstatus = "1";
					getCoinFromServer();//从云端获取钱袋中的信息
					$("#dspeed2").html(data.data.down_rate);
					$("#uspeed2").html(data.data.up_rate); 
					if (data.data.acc_up_rate <= 0) {
						$(".forIncomeCount").text("0");
					}else{
						$(".forIncomeCount").text(data.data.acc_up_rate);
					}
				}else{
					oldconstatus = "0";
					$(".router_righthover").hide();
					$(".coins").hide();
					$(".weilianwang").show();
					var _html = '<div class="purse"><span class="not_p"></span><p id="pursetext">未连接互联网&nbsp;<a href="wan.html" style="color:#5da9d3;">连网设置</a></p></div> ';
					$(".min_hj").html(_html);
				}
			  
				if(data.data && data.data.wifi){
					if(data.data.wifi.status=="true"){
						$("#visitorsModel").find(".fangke_close").hide();
						$("#wifiStrength").find(".closing").hide();
						$("#wifiStrength").find(".wifiqiangdu").show();
						$("#visitorsModel").find(".wifi_opens").show();
					  
						innerNetBaseSet.strengthmode = data.data.wifi.strengthmode;
						$(".wifiqiangdu>div").find(".active_rida").removeClass("active_rida_cur");
						var activeitem = $(".wifiqiangdu>div").find("span[data-value="+data.data.wifi.strengthmode+"]");
						activeitem.addClass("active_rida_cur");
						featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="'+activeitem.attr("data-class")+'"></span>');
					  
						innerNetBaseSet.guestMode = data.data.wifi.guestMode;
						$(".restart").hide();
						if(data.data.wifi.guestMode == "true"){
							$(".model_fangke").removeClass("guanbi");
							featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="visitor_Open"></span>');
						}else{
							$(".model_fangke").addClass("guanbi");
							featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="visitor_Close"></span>');
						}

					}else{
						if (data.data.wifi_5G && data.data.wifi_5G.status=="true") {
							$("#visitorsModel").find(".fangke_close").hide();
							$("#wifiStrength").find(".closing").hide();
							$("#wifiStrength").find(".wifiqiangdu").show();
							$("#visitorsModel").find(".wifi_opens").show();
						  
							innerNetBaseSet.strengthmode = data.data.wifi.strengthmode;
							$(".wifiqiangdu>div").find(".active_rida").removeClass("active_rida_cur");
							var activeitem = $(".wifiqiangdu>div").find("span[data-value="+data.data.wifi.strengthmode+"]");
							activeitem.addClass("active_rida_cur");
							featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="'+activeitem.attr("data-class")+'"></span>');
						}else{
							$("#visitorsModel").find(".wifi_opens").hide();
							$("#wifiStrength").find(".wifiqiangdu").hide();
							$("#visitorsModel").find(".fangke_close").show();
							$("#wifiStrength").find(".closing").show();
							featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="wifi_colse"></span>');
							featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="visitor_wifi_colse"></span>');
						}
						
					}	
							  
				}  
				if(data.data && data.data.lightmode){
					if(data.data.lightmode == "0"){
						$(".set-btn .mode-btn").removeClass("current");
						$(".default-mode").addClass("current");
						$(".Putout").hide();
						$(".quantian").show();
						featuresPanel.find(".btn[data-panel='panelLight']").html('<span class="sun"></span>');
					}else{
						$(".set-btn .mode-btn").removeClass("current");
						$(".night-mode").addClass("current");
						$(".quantian").hide();
						$(".Putout").show();
						featuresPanel.find(".btn[data-panel='panelLight']").html('<span class="moon"></span>');
					}
					$("#lighttime").html(data.data.lighttime+"自动熄灭")
					innerNetBaseSet.lightmode = data.data.lightmode;
					innerNetBaseSet.lighttime = data.data.lighttime;   
				}
			  
//				if(data.data.checkupdatetime && data.data.checkupdatetime == "true"){
//					window.setTimeout(function(){checkupdate()}, 5000);
//				}
				$("#youkuversion").html(data.data.curver);
				$("#wanmac").html(data.data.MacAddr);
				$("#wanIP").html(data.data.wanIP);
				saveincookie(data.data.curver,data.data.MacAddr,data.data.wanIP);
				
				commitenableflag = true;
			}
		});
	}
	
	function refreshdata_yougold(){
		$.getJSON(baseUrl,{op:"get",context:createContext("network"),key:$.cookie("key")},function(data){
			checkresult(data);
			if(data.result==0){
				netObject = data.data;
				var arr = data.data.uptime.split(',');
				var run_time = '';
				if(arr[0] != '0')
					run_time += arr[0] + '天';
				if(arr[0] != '0' || arr[1] != '0')
					run_time += arr[1] + '小时';
				run_time += arr[2] + '分钟';
				$("#run_time").html("已运行"+run_time);
				$("#dev_count").html(data.data.devicecount);
				$("#dev_count2").html(data.data.devicecount);
				
				innerNetBaseSet.pid = data.data.crypid;
				innerNetBaseSet.pcdnurltokenwithssid = data.data.pcdnurltokenwithssid;	  
				
				var constatus = data.data.toweb;
				if(constatus == '1'){
					if(constatus != oldconstatus){
						$(".weilianwang").hide();
						$(".router_righthover").show(); 
						getCoinFromServer();
					}
					if (data.data.acc_up_rate <= 0) {
						$(".forIncomeCount").text("0");
					}else{
						$(".forIncomeCount").text(data.data.acc_up_rate);
					}
					$("#dspeed2").html(data.data.down_rate);
					$("#uspeed2").html(data.data.up_rate); 
					oldconstatus = "1";
				}else{
					if(constatus != oldconstatus){
						$(".router_righthover").hide();
						$(".weilianwang").show();
					}
					$(".coins").hide();
//					$("#pursetext").html("未连接互联网&nbsp;<a href='wan.html' style='color:#5da9d3;'>连网设置</a>");
//					$(".purse").show();
					var _html = '<div class="purse"><span class="not_p"></span><p id="pursetext">未连接互联网&nbsp;<a href="wan.html" style="color:#5da9d3;">连网设置</a></p></div> ';
					$(".min_hj").html(_html);
					oldconstatus = "0";
				}  
			}
		});
	}

	function formatyougold(orgstr){
		var targetnum = parseInt(orgstr);
		var re=/(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
		var targetstr = orgstr;
		if(targetnum>=10000){
			orgstr = (Number(targetnum/10000)).toFixed(2);
			targetstr = orgstr.replace(re,"$1,") + "万";
		}else{
			if(orgstr!=''&&!isNaN(orgstr)){
				targetstr = orgstr.replace(re,"$1,");
			} 
		}
		return targetstr;
	}

	function setcreditmode(mode){
		var setParam = {};
		setParam.creditmode = mode; 
		$.getJSON(baseUrl,{op:"set",
		  context:createSetContext(setParam),
		  key:$.cookie("key")},
		 function(data){});   
	}
	
	function getdashboardinfo_nogold(){
		 $.getJSON(baseUrl,
			{op:"get",
			 context:createContext("network"),
			 key:$.cookie("key")},
			function(data){
			   checkresult(data);
			   if(data.result==0){
					var arr = data.data.uptime.split(',');
					var run_time = '';
					if(arr[0] != '0')
						run_time += arr[0] + '天';
					if(arr[0] != '0' || arr[1] != '0')
						run_time += arr[1] + '小时';
					run_time += arr[2] + '分钟';
					$("#run_time").html("已运行"+run_time);
					$("#dev_count").html(data.data.devicecount);
					$("#dev_count2").html(data.data.devicecount);
					
					innerNetBaseSet.pid = data.data.crypid;
					innerNetBaseSet.pcdnurltokenwithssid = data.data.pcdnurltokenwithssid;	 
					innerNetBaseSet.rkey = data.data.rkey;
					
					var constatus = data.data.toweb;
					if(constatus == '1'){
						oldconstatus = "1";
					}else{
						oldconstatus = "0";
						$(".router_righthover").hide();
						$(".weilianwang").show();
					}
				  
				  if(data.data && data.data.wifi){
					  if(data.data.wifi.status=="true"){
						  $("#visitorsModel").find(".fangke_close").hide();
						  $("#wifiStrength").find(".closing").hide();
						  $("#wifiStrength").find(".wifiqiangdu").show();
						   $("#visitorsModel").find(".wifi_opens").show();
						  
						  innerNetBaseSet.strengthmode = data.data.wifi.strengthmode;
						  $(".wifiqiangdu>div").find(".active_rida").removeClass("active_rida_cur");
						  var activeitem = $(".wifiqiangdu>div").find("span[data-value="+data.data.wifi.strengthmode+"]");
						  activeitem.addClass("active_rida_cur");
						  featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="'+activeitem.attr("data-class")+'"></span>');
						  
						  innerNetBaseSet.guestMode = data.data.wifi.guestMode;
						  $(".restart").hide();
						  if(data.data.wifi.guestMode == "true"){
							  $(".model_fangke").removeClass("guanbi");
							  featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="visitor_Open"></span>');
						  }else{
							  $(".model_fangke").addClass("guanbi");
							  featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="visitor_Close"></span>');
						  }

					  }else{
						  if (data.data.wifi_5G && data.data.wifi_5G.status=="true") {
							  $("#visitorsModel").find(".fangke_close").hide();
							  $("#wifiStrength").find(".closing").hide();
							  $("#wifiStrength").find(".wifiqiangdu").show();
							  $("#visitorsModel").find(".wifi_opens").show();
							  
							  innerNetBaseSet.strengthmode = data.data.wifi.strengthmode;
							  $(".wifiqiangdu>div").find(".active_rida").removeClass("active_rida_cur");
							  var activeitem = $(".wifiqiangdu>div").find("span[data-value="+data.data.wifi.strengthmode+"]");
							  activeitem.addClass("active_rida_cur");
							  featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="'+activeitem.attr("data-class")+'"></span>');
						  }else{
							  $("#visitorsModel").find(".wifi_opens").hide();
							  $("#wifiStrength").find(".wifiqiangdu").hide();
							  $("#visitorsModel").find(".fangke_close").show();
							  $("#wifiStrength").find(".closing").show();
							  featuresPanel.find(".btn[data-panel='wifiStrength']").html('<span class="wifi_colse"></span>');
							  featuresPanel.find(".btn[data-panel='visitorsModel']").html('<span class="visitor_wifi_colse"></span>');
						  }
					  }	
					  innerNetBaseSet.wifiname = data.data.wifi.name;			  
				  }  
				  if(data.data && data.data.lightmode){
						if(data.data.lightmode == "0"){
						   $(".set-btn .mode-btn").removeClass("current");
						   $(".default-mode").addClass("current");
						   $(".Putout").hide();
						   $(".quantian").show();
						   featuresPanel.find(".btn[data-panel='panelLight']").html('<span class="sun"></span>');
						}else{
						   $(".set-btn .mode-btn").removeClass("current");
						   $(".night-mode").addClass("current");
						   $(".quantian").hide();
						   $(".Putout").show();
						   featuresPanel.find(".btn[data-panel='panelLight']").html('<span class="moon"></span>');
						}
					   $("#lighttime").html(data.data.lighttime+"自动熄灭")
					   innerNetBaseSet.lightmode = data.data.lightmode;
					   innerNetBaseSet.lighttime = data.data.lighttime;   
				  }
				  
//				  if(data.data.checkupdatetime && data.data.checkupdatetime == "true"){
//					   window.setTimeout(function(){checkupdate()}, 5000);
//				  }
				  $("#youkuversion").html(data.data.curver);
				  $("#wanmac").html(data.data.MacAddr);
				  $("#wanIP").html(data.data.wanIP);
				  saveincookie(data.data.curver,data.data.MacAddr,data.data.wanIP);
				  
				  var urlparam = "pid=" + urlencode(urlencode(data.data.crypid))+ "&wifiname=" + urlencode(innerNetBaseSet.wifiname);
				  if (data.data.wan && data.data.wan.proto && data.data.wan.proto == "pppoe"){
					  urlparam += "&pppoe=1";
				  }else{
					  urlparam += "&pppoe=0";
				  }
				  
				  innerNetBaseSet.addfixedurl = "https://yjb.youku.com/pcdn/about/fixed_income.html?fromwhere=1&" + urlparam;
				  innerNetBaseSet.quitfixedurl = "https://yjb.youku.com/pcdn/about/fixed_income/quit.html?" + urlparam;
				  
				  if(data.data.sysinfo){
					  $("#sys-devname").html(data.data.sysinfo.devtype);
					  $("#sys-cpu").html(data.data.sysinfo.cpuhz);
				      $("#sys-memory").html(data.data.sysinfo.memTotal); 
				  }

				  $("#sys-version").html(data.data.curver);
				  $("#sys-ssid").html(data.data.wifi.name);
				  $("#sys-wanip").html(data.data.wanIP);
				  $("#sys-wanmac").html(data.data.MacAddr);
				  $("#sys-dns").html(data.data.wan.dns);
					
				  commitenableflag = true;
			   }
			});
		}	
		

	function refreshdata_nogold(){
		$.getJSON(baseUrl,
		  {op:"get",
		   context:createContext("network"),
		   key:$.cookie("key")},
		   function(data){
			 checkresult(data);
			 if(data.result==0){
				var arr = data.data.uptime.split(',');
				var run_time = '';
				if(arr[0] != '0')
					run_time += arr[0] + '天';
				if(arr[0] != '0' || arr[1] != '0')
					run_time += arr[1] + '小时';
				run_time += arr[2] + '分钟';
				$("#run_time").html("已运行"+run_time);
				$("#dev_count").html(data.data.devicecount);
				$("#dev_count2").html(data.data.devicecount);
				
				innerNetBaseSet.pid = data.data.crypid;
				innerNetBaseSet.pcdnurltokenwithssid = data.data.pcdnurltokenwithssid;	  
				
				var constatus = data.data.toweb;
				if(constatus == '1'){
					if(constatus != oldconstatus){
						$(".weilianwang").hide();
						$(".router_righthover").show(); 
					} 
					oldconstatus = "1";
				}else{
					if(constatus != oldconstatus){
						$(".router_righthover").hide();
						$(".weilianwang").show();
					}
					oldconstatus = "0";
				}  
		   }
		});
	}
	
	function getdashboardinfo(){
		if(showUGold==1){
		    getdashboardinfo_yougold();
		}else{
			getdashboardinfo_nogold();
		}
	}
	
	function refreshdata(){
		if(showUGold==1){
		    refreshdata_yougold();
		}else{
			refreshdata_nogold();	
		}
	}
	
	getdashboardinfo();	
	window.setTimeout(function(){
		var timer=null;
		timer=setInterval(function(){refreshdata();},5000);
	},5000);
	
	/**-----------自动升级部分开始------------**/
	var autoUpgrade = new Object();
	var autoTimer = null;
	/**是否提示自动升级**/
	autoUpgrade.checkAuto = function(_pid){
		$.ajax({
			url: "http://pcdnapi.youku.com/pcdn/update/config?pid="+urlencode(_pid),
			dataType: 'jsonp', 
			timeout: 10000,
			success: function(json){
				checkresult(json);
				if (json.code == 0) {
					autoUpgrade.auto = json.data.auto;
					if (json.data.set == 0) {//显示自动升级提示
						$(".upgradeSet").slideDown(500);
						autoUpgrade.autoCloseUpgrade();
					}else{//不显示自动升级提示
						$(".upgradeSet").hide();
					}
				}
			}
		});
	}
	
	autoUpgrade.autoCloseUpgrade = function(){
		if (autoTimer) {
			clearTimeout(autoTimer);
		}
		autoTimer = setTimeout(function(){
			$(".upgradeSet").slideUp(500);
		}, 10000);
	}
	
	/**自动升级忽略按钮**/
	$(".upgradeSet").on("click",".hideUpgrade",function(){
		$(".upgradeSet").slideUp(500);
		$.ajax({
			url: "http://pcdnapi.youku.com/pcdn/update/config?pid="+urlencode(innerNetBaseSet.pid)+"&auto="+urlencode(autoUpgrade.auto),
			dataType: 'jsonp', 
			timeout: 10000,
			success: function(json){
				checkresult(json);
				if (json.code == 0) {
					//保存成功
				}
			}
		});
	})
	/**自动升级查看按钮**/
	$(".upgradeSet").on("click",".toUpgrade",function(){
		$.ajax({
			url: "http://pcdnapi.youku.com/pcdn/update/config?pid="+urlencode(innerNetBaseSet.pid)+"&auto="+urlencode(autoUpgrade.auto),
			dataType: 'jsonp', 
			timeout: 10000,
			success: function(json){
				checkresult(json);
				if (json.code == 0) {
					location.href = 'upgrade.html?pagemode=autoupgrade&t='+new Date().getTime();
				}
			}
		});
	})
	
	/**-----------自动升级部分结束------------**/
	
	
	/**-----------带宽自运营部分开始------------**/
    var serverDataObj = new Object();//用于保存用户带宽和赚钱模式状态
    var speedObject = new Object();//带宽自运营对象，包含所有带宽自运营方法
    var speedTestResult;//用于保存测速结果，以便上传结果使用
    var animatet,ani_step = 1,isContinueRun = true,endValue,deviceUpload,isMaking = false;
    
    /**获取用户默认上行信息和赚钱模式**/
	speedObject.getUpSpeed = function(){
		$.ajax({  
			type: "get",
            dataType: "json",
            timeout: 10000,
            url: "https://yun.youku.com/user/get_network?from=web&pid="+urlencode(innerNetBaseSet.pid)+"&callback=?"+speedObject.makeTimeParam(),
            success:function (data) {
            	$("#preloadbandwidth").hide();
            	popup.showId("standIncome",{
        			layerCss:{position:"fixed",left:"50%",top:"50%", marginLeft:"-280px",marginTop:"-270px"},closeBtn:".btn_ced",okBnt:".ok",cancelBtn:".cancel",
        			okBtnClick:function(a,b){
        				popup.close(a,b,"hide");
        			},
        			cancelBtnClick:function(a,b){
        				if (animatet) {clearInterval(animatet);}
        				if (speedTimer) {clearTimeout(speedTimer);}
        				speedObject.resitingUI();
        				commitenableflag=true; 
        			},
					closeBtnClick:function(a,b){
        				if (animatet) {clearInterval(animatet);}
        				if (speedTimer) {clearTimeout(speedTimer);}
        				speedObject.resitingUI();
        				commitenableflag=true; 
        			}
        		});
            	
            	if (data.code != 0) {
    				$(".standIncome").find("#yunSucc").hide();
    				$(".standIncome").find("#yunError").show();
    				$(".bottomText").hide();
    				return false;
    			}
            	
            	$(".standIncome").find("#yunError").hide();
            	$(".standIncome").find("#yunSucc").show();
            	$(".bottomText").show();
            	
    			serverDataObj = data.data;
    			deviceUpload = serverDataObj.upload.device_upload;
    			speedObject.changeScale(serverDataObj.upload.device_upload);
    			speedObject.changeIncomeStyle();

    			var mode;
    			if (data.data.fixed_income_tips.state > 2) {//固定收益
    				if (data.data.upload.current_use_model!=0) {
    					$("#accmode").html('固定');
					}else{
						$("#accmode").html('暂停');
					}
    				innerNetBaseSet.accmode = data.data.upload.current_use_model;
				}else{//非固定收益
					if (data.data.upload.current_use_model != data.data.upload.use_model) {
						mode = data.data.upload.current_use_model;
					}else{
						mode = data.data.upload.use_model;
					}

					if(mode == 4){
	    				$("#accmode").html('激进');
	    			}else if(mode == 3){
	    				$("#accmode").html('固定');
	    			}else if(mode == 2){
	    				$("#accmode").html('平衡');
	    			}else if(mode == 1){
	    				$("#accmode").html('保守');
	    			}else if(mode == 0){
	    				$("#accmode").html('暂停');
	    			}
	    			innerNetBaseSet.accmode = mode;
				}
            },error:function () {
            	$("#preloadbandwidth").hide();
            	$("#YKRouterOverLayId").hide();
            	var _html = '<div class="purse"><span class="not_p"></span><p id="pursetext">未获取优金币数据，请检查网络连接是否正常或刷新页面。</p></div> ';
				$(".min_hj").html(_html);
            	$(".standIncome").find("#yunSucc").hide();
				$(".standIncome").find("#yunError").show();
				$(".bottomText").hide();
				return false;
            }
        });
	}
	/**获取用户默认上行信息和赚钱模式**/
	speedObject.getUpSpeedOnly = function(){
		$.ajax({  
			type: "get",
			dataType: "json",
			timeout: 10000,
			url: "https://yun.youku.com/user/get_network?from=web&pid="+urlencode(innerNetBaseSet.pid)+"&callback=?"+speedObject.makeTimeParam(),
			success:function (data) {
				if (data.code != 0) {
					$(".standIncome").find("#yunSucc").hide();
					$(".standIncome").find("#yunError").show();
					$(".bottomText").hide();
					return false;
				}
				
				$(".standIncome").find("#yunError").hide();
				$(".standIncome").find("#yunSucc").show();
				$(".bottomText").show();
				
				serverDataObj = data.data;
				deviceUpload = serverDataObj.upload.device_upload;
				speedObject.changeScale(serverDataObj.upload.device_upload);
				speedObject.changeIncomeStyle();
				
				var mode;
				
				if (data.data.fixed_income_tips.state > 2) {//固定收益
					if (data.data.upload.current_use_model!=0) {
						$("#accmode").html('固定');
					}else{
						$("#accmode").html('暂停');
					}
					innerNetBaseSet.accmode = data.data.upload.current_use_model;
				}else{//非固定收益
					if (data.data.upload.current_use_model != data.data.upload.use_model) {
						mode = data.data.upload.current_use_model;
					}else{
						mode = data.data.upload.use_model;
					}
					
					if(mode == 4){
						$("#accmode").html('激进');
					}else if(mode == 3){
						$("#accmode").html('固定');
					}else if(mode == 2){
						$("#accmode").html('平衡');
					}else if(mode == 1){
						$("#accmode").html('保守');
					}else if(mode == 0){
						$("#accmode").html('暂停');
					}
					innerNetBaseSet.accmode = mode;
				}
				
				
			},error:function () {
				var _html = '<div class="purse"><span class="not_p"></span><p id="pursetext">未获取优金币数据，请检查网络连接是否正常或刷新页面。</p></div> ';
				$(".min_hj").html(_html);
				$(".standIncome").find("#yunSucc").hide();
				$(".standIncome").find("#yunError").show();
				$(".bottomText").hide();
				return false;
			}
		});
	}
	
	/**根据速度改变刻度和显示的速度值**/
	speedObject.changeScale = function(st_upload){
		var netSpeedVal = st_upload/1024/1024;//转换单位为Mbps
		if (netSpeedVal<=0) {//带宽<=0
			$("#st_currSpeed").text(0);
			$("#testVal").text(0);
			$( "#slider-vertical" ).slider({value: 0});
			$(".dividingCurr").css("bottom","0");
		}else{//带宽>0
			if (netSpeedVal > 1.5) {
				netSpeedVal = Math.round(netSpeedVal);
			}else{
				netSpeedVal = Math.round(netSpeedVal*100)/100;
			}
			$("#st_currSpeed").text(speedObject.findBybps(netSpeedVal));
			$("#testVal").text(speedObject.findBybps(netSpeedVal));
			var numTemp = speedObject.findScale(netSpeedVal);
			$("#slider-vertical").find(".ui-slider-range").animate({height:numTemp+"%"});
			$("#slider-vertical").find(".ui-slider-handle").animate({bottom:numTemp+"%"});
			$(".dividingCurr").animate({bottom:numTemp+"%"});
		}
	}
	
	speedObject.makeAnimate = function(ranVal){
		if (isContinueRun) {
			clearInterval(animatet);
			animatet = window.setInterval(function(){
				if (ani_step < ranVal) {
					$("#slider-vertical").slider('value', ani_step++);
					$(".dividingCurr").css("bottom",$("#slider-vertical").slider("value")+"%");
				}else if(ani_step > ranVal){
					$("#slider-vertical").slider('value', ani_step--);
					$(".dividingCurr").css("bottom",$("#slider-vertical").slider("value")+"%");
				}else{
					speedObject.makeAnimate(speedObject.createRandom());
				}
				var currScaleVal = speedObject.findPercent($("#slider-vertical").slider("value"));
				$("#st_currSpeed").text(currScaleVal);
				$("#testVal").text(currScaleVal);
			}, 50);
		}else{
			clearInterval(animatet);
			animatet = window.setInterval(function(){
				if (ani_step < ranVal) {
					$("#slider-vertical").slider('value', ani_step++);
				}else if(ani_step > ranVal){
					$("#slider-vertical").slider('value', ani_step--);
				}else{
					clearInterval(animatet);
					isContinueRun = true;//随机效果停止后，把随即效果标识置为true
//					speedObject.showChangeRemind($("#slider-vertical").slider("value"));
				}
				var currScaleVal = speedObject.findPercent($("#slider-vertical").slider("value"));
				$(".dividingCurr").css("bottom",$("#slider-vertical").slider("value")+"%");
				$("#st_currSpeed").text(currScaleVal);
				$("#testVal").text(currScaleVal);
			}, 50);
		}
		
	}
	
	/**如果没有测速值返回，创建15-50之间随机数**/
	speedObject.createRandom = function(){
		var _max,_min;
		if (endValue) {
			if (endValue <= 15) {
				_max = endValue;
				_min = endValue + 10;
			}else{
				_max = endValue;
				_min = endValue - 10;
			}
		}else{
			_max = 50;
			_min = 15;
		}
		
		var _range = _max - _min;   
		var _rand = Math.random();
		return(_min + Math.round(_rand * _range));
	}
	
	/**根据上行速度取得相对刻度**/
	speedObject.findBybps = function(mbps){
		if (mbps > 0) {
			if (mbps > 100) {
				return scaleArr[scaleArr.length-1];
			}else{
				for (var i = 0,k = scaleArr.length; i < k; i++) {
					if (mbps == scaleArr[i]) {
						return scaleArr[i];
					}
					if (mbps > scaleArr[i] && mbps < scaleArr[i+1]) {
						if (scaleArr[i+1] - mbps > (scaleArr[i+1] - scaleArr[i]) / 2) {
							return scaleArr[i];
						}else{
							return scaleArr[i+1];
						}
					}
				}
			}
		}else{
			return 0;
		}
	}
	
	/**根据网速取得滑块位置**/
	speedObject.findScale = function(mbpsUnit){
		if (mbpsUnit > 0) {
			if (mbpsUnit > 100) {
				return percentArr[percentArr.length-1];
			}else{
				for (var i = 0,k = scaleArr.length; i < k; i++) {
					if (mbpsUnit == scaleArr[i]) {
						return percentArr[scaleArr.indexOf(scaleArr[i])];
					}
					if (mbpsUnit > scaleArr[i] && mbpsUnit < scaleArr[i+1]) {
						if (scaleArr[i+1] - mbpsUnit > (scaleArr[i+1] - scaleArr[i]) / 2) {
							return percentArr[scaleArr.indexOf(scaleArr[i])];
						}else{
							return percentArr[scaleArr.indexOf(scaleArr[i+1])];
						}
					}
				}
			}
		}else{
			return 0;
		}
	}
	
	/**根据滑块位置取得刻度值**/
	speedObject.findPercent = function(scaleTemp){
		if (scaleTemp <= 0) {
			return 0;
		}
		if (scaleTemp > percentArr[percentArr.length-1]) {
			return scaleArr[scaleArr.length-1];
		}
		for (var i = 0,k = percentArr.length; i < k; i++) {
			if (scaleTemp == percentArr[i]) {
				return scaleArr[percentArr.indexOf(percentArr[i])];
			}
			if (scaleTemp > percentArr[i] && scaleTemp < percentArr[i+1]) {
				if (percentArr[i+1] - scaleTemp > (percentArr[i+1] - percentArr[i]) / 2) {
					return scaleArr[percentArr.indexOf(percentArr[i])];
				}else{
					return scaleArr[percentArr.indexOf(percentArr[i+1])];
				}
				
			}
		}
	}
	
	var speedTimer;
	
	speedObject.checkSpeedStart = function(){
		speedObject.speedStartUI();
		$.ajax({  
			type: "get",
            dataType: "json",
            url: baseUrl,
            data:{op:"testspeed",context:createContext("start"),key:$.cookie("key")},
            timeout:10000,
            success:function (data) {
            	checkresult(data);
    			var returnData = data;
    			if(returnData.result == 0){
    				isMaking = true;//是不是测速中
    				speedObject.makeAnimate(speedObject.createRandom());
    				speedTimer = setTimeout(function(){speedObject.checkingSpeed()}, 3000);
    			}else if(returnData.result == -1){
    				$("#stException").show();
    				speedObject.changeScale(0);
    				speedObject.timeoutUI();
    				if (animatet) {clearInterval(animatet);}
    				if (speedTimer) {clearTimeout(speedTimer);}
    				isMaking = false;
    			}else{
    				speedObject.changeScale(0);
    				speedObject.speedTestError();
    				speedObject.resitingUI();
    				if (animatet) {clearInterval(animatet);}
    				if (speedTimer) {clearTimeout(speedTimer);}
    				isMaking = false;
    			}
                
            },error:function () {
            	speedObject.changeScale(0);
            	if (animatet) {clearInterval(animatet);}
				if (speedTimer) {clearTimeout(speedTimer);}
            	$(".standIncome").find("#yunSucc").hide();
				$(".standIncome").find("#yunError").show();
				$(".bottomText").hide();
				isMaking = false;
				return false;
            }
        });
	}
	var currSpingTime = 0;
	var errortimes = 0;
	speedObject.checkingSpeed = function(){
		if (speedTimer) {clearTimeout(speedTimer);}
		currSpingTime++;
		if(currSpingTime > 15){//测速时间超时
			$("#stException").show();
			speedObject.changeScale(0);
			speedObject.timeoutUI();
			if (animatet) {clearInterval(animatet);}
			if (speedTimer) {clearTimeout(speedTimer);}
			currSpingTime = 0;
			isMaking = false;
			return false;
		}
		
		$.ajax({  
			type: "get",
            dataType: "json",
            url: baseUrl,
            data:{op:"testspeed",context:createContext("check"),key:$.cookie("key")},
            timeout:10000,
            success:function (data) {
            	checkresult(data);
    			var returnData = data;
    			
    			if(returnData.result==0){
    				var sdtemp = returnData.data.upspeed/1024/1024;
    				sdtemp = sdtemp > 1.5 ? Math.round(sdtemp) : Math.round(sdtemp * 100) / 100;
    				endValue = speedObject.findScale(sdtemp);
    				if (returnData.data.progress<100) {//未完成测速,延迟2秒进行再次校验测速结果
    					speedTimer = setTimeout(function(){speedObject.checkingSpeed()}, 2000);
    				}else{
    					deviceUpload = speedTestResult = returnData.data.upspeed;
    					clearTimeout(speedTimer);
    					speedObject.resitingUI();
    					isContinueRun = false;//继续随机效果停止
    					isMaking = false;//是不是测速中，false为非测速中
    					speedObject.makeAnimate(speedObject.findScale(sdtemp));
    					currSpingTime = 0;
    				}
    			}else if(returnData.result == -1){
    				currSpingTime = 0;
    				$("#stException").show();
    				speedObject.changeScale(0);
    				speedObject.timeoutUI();
    				if (animatet) {clearInterval(animatet);}
    				if (speedTimer) {clearTimeout(speedTimer);}
    				isMaking = false;
    			}else{
    				currSpingTime = 0;
    				speedObject.changeScale(0);
    				$(".standIncome").find("#yunSucc").hide();
    				$(".standIncome").find("#yunError").show();
    				$(".bottomText").hide();
    				if (animatet) {clearInterval(animatet);}
    				if (speedTimer) {clearTimeout(speedTimer);}
    				isMaking = false;
    			}
            },error:function () {
				if(errortimes > 1){
					currSpingTime = 0;
					speedObject.changeScale(0);
					if (animatet) {clearInterval(animatet);}
					if (speedTimer) {clearTimeout(speedTimer);}
					$(".standIncome").find("#yunSucc").hide();
					$(".standIncome").find("#yunError").show();
					$(".bottomText").hide();
					isMaking = false;
					return false;	
				}else{
					speedObject.checkingSpeed();
					errortimes++;
				}
            }
        });
	}
	
	/**根据云接口信息初始化底部固定收益链接**/
	speedObject.makeBottomLink = function(){
		var linkArr = serverDataObj.fixed_income_tips.web;
		if (linkArr.length > 0) {
			var _html = "";
			for (var i = 0,k = linkArr.length; i < k; i++) {
				var tempObj = linkArr[i];
				if (tempObj.has_link == 1) {
					if (serverDataObj.fixed_income_tips.state == 1) {
						_html += '<a href="'+innerNetBaseSet.addfixedurl+'" target="_blank" style="color:#ff4400;">'+tempObj.tip+'</a>';
					}else if(serverDataObj.fixed_income_tips.state > 1){
						_html += '<a href="'+innerNetBaseSet.quitfixedurl+'" target="_blank">'+tempObj.tip+'</a>';
					}
				}else{
					_html += tempObj.tip;
				}
			}
			$("#standIncome").find(".bottomText").html(_html);
		}else{
			return false
		}
	}
	
	/**测速失败UI**/
	speedObject.speedTestError = function(){
		$(".dividingCurr").html('<span class="testError">检测失败</span>');
		$("#testVal").text("--");
	}
	
	/**初始化带宽检测UI**/
	speedObject.speedStartUI = function(){
		$(".testOperate").find(".testBut").addClass("testing").html('<img src="images/loading.gif" /><span>检测中...</span>');
		$(".testOperate").find(".saveBut").addClass("testing_save");
		$("#st_currSpeed").text("--");
	}
	
	/**正在保存按钮状态**/
	speedObject.speedSaveUI = function(){
		$(".testOperate").find(".saveBut").addClass("saveing").html('<img src="images/loading.gif" /><span>正在保存...</span>');
	}
	
	/**保存成功按钮状态**/
	speedObject.speedSaveSuccUI = function(){
		$(".testOperate").find(".saveBut").removeClass("saveing").addClass("savesucc").html('<img src="images/dui.png" /><span>保存成功</span>');
		window.setTimeout(function(){
			speedObject.resetSaveUI();
		}, 2000);
	}
	
	speedObject.resetSaveUI = function(){
		$(".testOperate").find(".saveBut").removeClass("saveing").removeClass("savesucc").removeClass("savefail").html("保 存");
	}
	
	speedObject.resitingUI = function(){
		var currDom = $(".testOperate").find(".testBut");
		if (currDom.html().indexOf("检测中")!=-1) {
			currDom.removeClass("testing").html('重新检测');
		}else{
			currDom.removeClass("testing").html('检测上行带宽');
		}
		$(".testOperate").find(".saveBut").removeClass("testing_save");
	}
	
	speedObject.timeoutUI = function(){
		$(".testOperate").find(".testBut").removeClass("testing").html('再测一次');
		$(".testOperate").find(".saveBut").removeClass("testing_save");
	}
	
	speedObject.saveFaildUI = function(){
		$(".testOperate").find(".saveBut").removeClass("saveing").addClass("savefail").html('<img src="images/wu.png" /><span>保存失败</span>');
		window.setTimeout(function(){
			speedObject.resetSaveUI();
		}, 2000);
	}
	
	speedObject.makeTimeParam = function(){
		return "&t="+new Date().getTime();
	}
	
	/**根据用户赚钱模式信息初始化带宽自运营右侧UI**/
	speedObject.changeIncomeStyle = function(){
		speedObject.makeBottomLink();
		$("#standIncome").find(".modeImgChecked").removeClass("modeImgChecked");
		
		if (serverDataObj.fixed_income_tips.state > 2) {	//固定收益 
			$("#standIncome").find(".freeNode").css("display","none");
			$("#standIncome").find(".regularNode").css("display","block");
			$("#standIncome").find(".m_3 .descText").text(serverDataObj.fixed_income_tips.fixed_type_desp);
			if (serverDataObj.upload.current_use_model!=0) {	//固定收益运行状态
				$("#standIncome").find(".m_3 .modeImg").addClass("modeImgChecked");
			}else{	//固定收益关闭状态
				$("#standIncome").find(".m_0 .modeImg").addClass("modeImgChecked");
			}
		}else{	//非固定收益
			$("#standIncome").find(".freeNode").css("display","block");
			$("#standIncome").find(".regularNode").css("display","none");
//			if (serverDataObj.upload.current_use_model != serverDataObj.upload.use_model) {//赚钱模式运行状态
//				$("#standIncome").find(".m_"+serverDataObj.upload.current_use_model+" .modeImg").addClass("modeImgChecked");
//			}else{	//赚钱模式关闭状态
				$("#standIncome").find(".m_"+serverDataObj.upload.use_model+" .modeImg").addClass("modeImgChecked");
//			}
		}
		
	}
	
	/**保存带宽和收益模式到云端**/
	speedObject.saveUpInfo = function(){
		var u_model = Number($(".modeImgChecked").parents(".incomeMode").attr("class").replace("incomeMode","").replace("m_",""));
		var toSaveUpload = speedObject.findBybps(deviceUpload / 1024 / 1024);
		toSaveUpload = toSaveUpload * 1024 * 1024;
		if (serverDataObj.upload.current_use_model != serverDataObj.upload.use_model && u_model == serverDataObj.upload.current_use_model) {
			//定时模式，并且保存状态与定时模式相同，先关闭定时模式
			$.ajax({  
				type: "get",
	            dataType: "json",
	            timeout: 10000,
	            url: "https://yun.youku.com/user/set_app_netmodel_autoadjust?callback=?",
	            data:{from:"web",pid:innerNetBaseSet.pid,t:speedObject.makeTimeParam()},
	            success:function (data) {
	            	if (data.code != 0) {
	            		speedObject.saveFaildUI();
	    				return false;
	    			}
	            },error:function () {
	            	speedObject.saveFaildUI();
					return false;
	            }
	        });
		}else if(serverDataObj.upload.current_use_model != serverDataObj.upload.use_model && u_model != serverDataObj.upload.current_use_model){
			if (serverDataObj.fixed_income_tips.state == 1) {
				//定时时段内，要是设置的模式与当前时段模式不一样，进行提示。
				var conflictText ='固定时段为'+speedObject.changeStyleToText(serverDataObj.upload.current_use_model)+'，到期后为'+speedObject.changeStyleToText(u_model)+'。';
				if (remindT) {clearTimeout(remindT);}
				$("#standIncome").find(".fixedIncomeRemind").text(conflictText).show();
				remindT = window.setTimeout(function(){
					$("#standIncome").find(".fixedIncomeRemind").hide();
				}, 2500);
			}
		}else{}//定时时段外，不需要做特殊操作，直接保存。
		//直接保存。
		$.ajax({  
			type: "get",
            dataType: "json",
            timeout: 10000,
            url: "https://yun.youku.com/user/set_network?callback=?",
            data:{from:"web",pid:innerNetBaseSet.pid,device_upload:toSaveUpload,use_model:u_model,speedtest_upload:speedTestResult,t:speedObject.makeTimeParam()},
            success:function (data) {
            	if (data.code == 0) {
            		deviceUpload = data.data.device_upload;
            		speedObject.speedSaveSuccUI();
            		speedObject.getUpSpeedOnly();
    			}else{
    				speedObject.saveFaildUI();
    				return false;
    			}
            },error:function () {
            	speedObject.saveFaildUI();
				return false;
            }
        });
	}
	
	$(".testOperate").on("click",".testBut",function(){
		if ($(this).hasClass("testing")) {
			return false;
		}
		$("#stException").hide();
    	speedObject.checkSpeedStart();
    });
	
	$(".testOperate").on("click",".saveBut",function(){
		if ($(this).hasClass("saveing") || $(this).hasClass("savesucc") || $(this).hasClass("testing_save")) {
			return false;
		}
		
		speedObject.speedSaveUI();
		speedObject.saveUpInfo();
	});
	
	$( "#slider-vertical").bind('slide', function(event, ui) {
		if (isMaking) {
			return false;
		}
		var currScale = ui.value;
		var rightScale = speedObject.findPercent(currScale);
		$("#st_currSpeed").text(rightScale);
		$("#testVal").text(rightScale);
		$(".dividingCurr").css("bottom",ui.value+"%");
		deviceUpload = rightScale*1024*1024;
	});
	
	$( "#slider-vertical").bind('slidestart', function(event, ui) {
		$(".dividingCurr").find(".speedRemindText").hide();
	});    
	
	$( "#slider-vertical").bind('slidestop', function(event, ui) {
		if (isMaking) {
			return false;
		}
		speedObject.showChangeRemind(ui.value);
	});
	
	var closeRemindT;
	speedObject.showChangeRemind = function(_value){
		if (closeRemindT) {clearTimeout(closeRemindT);}
		if (_value < 25) {
			$(".dividingCurr").find(".speedRemindText").css("bottom","50px").show();
		}else if(_value >= 25 && _value < 65){
			$(".dividingCurr").find(".speedRemindText").css("bottom","50px").show();
		}else if(_value >= 65){
			$(".dividingCurr").find(".speedRemindText").css("bottom","-40px").show();
		}
		closeRemindT = window.setTimeout(function(){
			$(".dividingCurr").find(".speedRemindText").hide();
		}, 3000);
	}
	
	var remindT;
	$(".incomeRight").on("click",".modeImg",function(){
		
		if($(this).hasClass("modeImgChecked")){
			return false;
		}
		if(Number($(this).parents(".incomeMode").attr("class").replace("incomeMode","").replace("m_","")) == 0 
				&& serverDataObj.fixed_income_tips.state > 1 
				&& serverDataObj.upload.device_can_block == 0){
			if (remindT) {clearTimeout(remindT);}
			$("#standIncome").find(".fixedIncomeRemind").text("您已参加固定收益，一天只能暂停一次。").show();
			remindT = window.setTimeout(function(){
				$("#standIncome").find(".fixedIncomeRemind").hide();
			}, 2500);
			return false;
		}
		
		$(".incomeRight").find(".modeImgChecked").removeClass("modeImgChecked");
		$(this).addClass("modeImgChecked");
	})
	
	speedObject.changeStyleToText = function(style){
		var textTemp;
		switch (Number(style)) {
		case 0:
			textTemp = "暂停";
			break;
		case 1:
			textTemp = "保守";
			break;
		case 2:
			textTemp = "平衡";
			break;
		case 3:
			textTemp = "固定";
			break;
		case 4:
			textTemp = "激进";
			break;
		default:
			break;
		}
		return textTemp;
	}
	/**-----------带宽自运营部分结束------------**/
});

