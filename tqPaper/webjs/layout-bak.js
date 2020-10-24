
//首页解决方案

$(function(){
	
	this_input();
	//input失去焦点
	function this_input(){
		$("[_placeholder]").each(function(){
		var t_input=$(this);
		var val_input=t_input.val();
			t_input.bind({
				focus: function(){
					var _this=$(this);
					if(_this.val()==val_input){
						_this.val("");
					}
				},
				blur:function(){
					var _this=$(this);
					if(_this.val()==""){
						_this.val(val_input);
					}
				}
			});
	
		})
		
	}
	
	//综合页
	
	$('.SynthesizeUp ul li').hover(function(){
		$(this).addClass('cur');	
	},function(){
		$(this).removeClass('cur')	
	})
	
	
	//列表页
	$('.Therestlist ul li').hover(function(){
		$(this).addClass('curshow');	
	},function(){
		$(this).removeClass('curshow')	
	})
	
	$('.newsside ul li.oneclick1').click(function(e) {
		if($(this).find('.Chunkiconbox').is(':visible')){
			$(this).find('.Chunkiconbox').hide();
		}else{
			$(this).find('.Chunkiconbox').show();
			$('#Sharelist').hide();
			$('.Phonecode').hide();
		}
        
	});
	$('#startDate').click(function(e) {
		$('.Chunkiconbox').hide();
		$('#Sharelist').hide();
		$('.Phonecode').hide();
        
	});
	$('.newsside ul li.oneclick3').click(function(e) {
		if($(this).find('#Sharelist').is(':visible')){
			$(this).find('#Sharelist').hide();
		}else{
			$(this).find('#Sharelist').show();
			$('.Chunkiconbox').hide();
			$('.Phonecode').hide();
		}
        
	});
	
	$('.newsside ul li.oneclick4').click(function(e) {
		if($(this).find('.Phonecode').is(':visible')){
			$(this).find('.Phonecode').hide();
		}else{
			$(this).find('.Phonecode').show();
			$('.Chunkiconbox').hide();
			$('#Sharelist').hide();
		}
        
	});
	
	/*$(document).click(function(e) {
		if($('.Chunkiconbox').is(':visible')){
			alert(0)
			$('.Chunkiconbox').hide()	
		}
          
    });*/
	
})

//首页合作伙伴
	function clickHonce(leftBtn, rightBtn, btnsPrent, num) {
		var lenLi = $(btnsPrent).find("ul li").length;
		var distance = $(btnsPrent).find("ul li").innerWidth()
			+ parseFloat($(btnsPrent).find("ul li").css("margin-right"))
			+ parseFloat($(btnsPrent).find("ul li").css("border-left-width"))
			+ parseFloat($(btnsPrent).find("ul li").css("border-right-width"));
	
		$(btnsPrent).find("ul").css("width", distance * lenLi);
		var i = 0;
		$(leftBtn).click(function () {
			if (lenLi > num) {
				if (!$(this).parents(btnsPrent).find("ul").is(":animated")) {
					if (i > 0) { i--; } else { i = 0; }
					$(this).parents(btnsPrent).find("ul").animate({ "margin-left": -distance*i },500);
				}
			}
		})
		$(rightBtn).click(function () {
			if (lenLi > num) {
				if (!$(this).parents(btnsPrent).find("ul").is(":animated")) {
					if (i < lenLi-num) { i++; } else { i = lenLi-num; }
					$(this).parents(btnsPrent).find("ul").animate({ "margin-left": -distance * i }, 500);
				}
			}
		})
	}
	//首页合作伙伴调用
	$(function(){
		clickHonce(".restleft", ".restright", ".Therestcon", 7);
	})
	
	