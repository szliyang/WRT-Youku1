;(function($){
	$.fn.hcheckbox=function(options){
		$('span',this).each(function(){
			$(this).addClass('checkbox');
            if($(this).prev().is(':disabled')==false){
                if($(this).prev().is(':checked'))
				    $(this).addClass("checked");
            }else{
                $(this).addClass('disabled');
            }
		}).click(function(event){
				if(!$(this).prev().is(':checked')){
				    $(this).addClass("checked");
                    $(this).prev().checked = true;
                }
                else{
                    $(this).removeClass('checked');			
                    $(this).prev().checked = false;
                }
                event.stopPropagation();
			}
		).prev().hide();
	}
         $.fn.hradio = function(options){
      var _this=$(this);
         _this.on("click",".activ",function(e){
           _this.find(".activ").removeClass("hRadio_Checked");
           var that=$(this);
           if(that.hasClass("hRadio_Checked")){
             that.removeClass("hRadio_Checked");
           }else{
             that.addClass("hRadio_Checked");
           }     
         })
    };
})(jQuery)


























