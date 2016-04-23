$(document.body).ready(function(){
	var updateDom = $('<div id="upModel"></div>');
	$("body").append(updateDom);
	updateDom.load("upgrade_model.html",function(){
		checkupdate();
	});
	
	var updateTimer = null;
	function checkupdate(){
		$.getJSON(baseUrl,{op:"upgrade",context:createContext("check"),key:$.cookie("key")}, function(data){
			checkresult(data);
			var hasupdate = data.data.hasupdate;
			if (hasupdate == "1") {//存在升级信息
				if (data.data.popup && data.data.popup == "force") {//强制升级
					showUpgrade(data,"force");
				}else{//非强制升级
					if(data.data.checkupdatetime && data.data.checkupdatetime == "true"){
						if(location.href.indexOf("dashboard.html") != -1){
							showUpgrade(data,"info");
						}
					}
				}
			}
		});
	}
	
	function showUpgrade(data,isforced){
		if (updateTimer) {clearTimeout(updateTimer);}
		if ($("#YKRouterOverLayId").length<=0 || ($("#YKRouterOverLayId").length>0 && $("#YKRouterOverLayId").is(":hidden"))) {
			if (isforced == "force") {
				$("#updatebox").find(".colse_df").hide();
				$("#noUpdate").hide();
				$("#atOnceUpate").css({"width":"100%"});
			}else{
				$("#updatebox").find(".colse_df").show();
				$("#noUpdate").show();
				$("#atOnceUpate").css({"width":"120px"});
			}
			
			$("#ver-now").html(data.data["newver"]);
			$("#update-size").html("("+data.data["size"]+")");
			var ref = data.data["descforweb"];
			if (ref != ""){
				 $("#updatereference").html('<li>' + ref + '</li>');
			}
							
			popup.showId("updatebox",{layerCss:{position:"fixed",left:"50%",top:"50%", marginLeft:"-220px",marginTop:"-101px"},closeBtn:".close",okBnt:".ok",cancelBtn:".cancel",
				okBtnClick:function(a,b){
					popup.hide(a,b,"hide");
					popup.showId("shengjitanceng",{layerCss:{position:"fixed",left:"50%", top:"50%", marginLeft:"-220px", marginTop:"-101px"},closeBtn:".close" });
						$("#baras").css("width","0%");
						$("#baras").animate({width:"100%"},480000,'linear',function(){
							popup.close($("#shengjitanceng"),"","hide");
						});
					$.getJSON(baseUrl, {op:"upgrade", context:createContext("start"), key:$.cookie("key")},function(data){
						checkresult(data);
						if (data['result'] == "0"){
							window.setTimeout(function(){getprocess();},1000);
						}else if(data.result == "10031"){
							upgradeError(data.error.desc);
						}else if(data.result == "10032"){
							upgradeError("下载失败，请重新检测升级版本！");
						}else{
							upgradeError("更新失败，请稍后重新检测升级版本！");
						}
						
					});				    
				},
				cancelBtnClick:	function(a,b){
					var setParam = {};
					setParam.setupdatetime = "true"; 
					$.getJSON(baseUrl, {op:"set", context:createSetContext(setParam), key:$.cookie("key")},function(data){
						checkresult(data);
					});				    
				}
			});
		}else{
			updateTimer = setTimeout(function(){
				showUpgrade(data,isforced);
			}, 5000);
		}
	}
	
	function upgradeError(msg){
		$("#online_error").html(msg);
		$("#baras").stop();
		if(timeout){
			clearTimeout(timeout);
		}
		updateokflag = true;
		popup.hide($("#shengjitanceng"),"","hide");
		popup.showId("onlineerrbox",{layerCss:{position:"fixed",left:"50%", top:"50%", marginLeft:"-220px", marginTop:"-101px"},
			closeBtn:".close",okBnt:".ok",
			okBtnClick:function(a,b){
				popup.close(a,b,"hide");
			} 
		});
	}
	
	var updateokflag = true;
	var timeout;

	function getprocess(){
		$.getJSON(baseUrl, {op:"upgrade", context:createContext("progress"), key:$.cookie("key")},
		function(data){ 
		   checkresult(data);
		   if (data.result == "0"){
			   var persent = data.data['persent']; 
			   if (parseInt(persent) == 100 && updateokflag){
				   updateokflag = false;
				   getprocess();
				   timeout = setTimeout(function(){cycleChackState(5000);},200000);
			   }else{
				   getprocess();
			   } 
		   }else{
			   if(data.result == "10032"){
				   upgradeError("下载失败，请重新检测升级版本！");
			   }else{
				   upgradeError("更新失败，请稍后重新检测升级版本！");
			   }
		   	}
		});
	}
});

