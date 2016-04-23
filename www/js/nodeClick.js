//form表单相关，主要是模拟radio 模拟select和保存按钮相关行为
//模拟radio
$.fn.toggleNode=function(className1,className2,callback){
  $(this).on('click',function(){
   var _this=$(this);
   if(_this.hasClass(className1)){
      _this.removeClass(className1).addClass(className2);
   }else if(_this.hasClass(className2)){
      _this.removeClass(className2).addClass(className1);
   }
   callback&&callback(_this);
  });
};
//模拟select
$.fn.selectNode=function(openClass,callback){
  var _this=$(this),
  selVal=_this.find('.sel-val'),
  optionColls=_this.find('.options'),
  optionItems=optionColls.find('li');
  var openCl=openClass || "select-open";
  selVal.on("click",function(e){
   if(_this.hasClass(openCl)){
     _this.removeClass(openCl);
   }else{
    _this.addClass(openCl);
   }
   e.stopPropagation();
  });
   optionItems.on('mouseenter',function(){
    optionItems.removeClass('hover');
    $(this).addClass('hover');
  }).on('click',function(e){
    selVal.html($(this).text());
    optionItems.removeClass('current');
    $(this).addClass('current');
     _this.removeClass(openCl);
     callback && callback($(this));
     e.stopPropagation();
  });
};
//模拟select自动定位序列
$.fn.selectCurrent=function(index){
  var _this=$(this),
  selVal=_this.find('.sel-val'),
  items=_this.find("li");
  items.removeClass("current");
  var currentItem=$(items.eq(index));
  currentItem.addClass("current");
  selVal.html(currentItem.find(".text").html()+'<i class="icon-arrow1"></i>');
};
//保存按钮状态转变
var formSaveBtnState=window.formSaveBtnState || {};
formSaveBtnState.loading=function(submitBtn,btnTxt){
  submitBtn.hide();
  var loadBtn=submitBtn.next(".loading");
  if(loadBtn.length==0){
	  $("#youkuloadingbtn").remove();
      var loadBtnTemplate='<span class="loading" id="youkuloadingbtn">{{loadingTxt}}</span>';
      loadBtnTemplate=loadBtnTemplate.replace(/{{loadingTxt}}/,btnTxt || submitBtn.text());
	  $(loadBtnTemplate).css("top",submitBtn.css("top"));
	  $(loadBtnTemplate).css("left",submitBtn.css("left"));
      submitBtn.after($(loadBtnTemplate));
    }else{
      btnTxt && loadBtn.html(btnTxt);
      loadBtn.css("display","inline-block");
    }     
}
formSaveBtnState.resetInit=function(submitBtn){
   var loadBtn=submitBtn && submitBtn.next(".loading");
   loadBtn.hide();
   submitBtn.show();
}
$(function(){
 $(document.body).on('click',function(){
  $('.select').removeClass("select-open");
 });
});
