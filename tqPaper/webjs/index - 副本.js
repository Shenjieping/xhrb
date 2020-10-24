$(function(){
	var arr = [];
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
		this.splice(index, 1);
		}
	};
	
	$(".newslist li a").click(function(){
		var _this=$(this)
		var src="";
		var hasClick=_this.attr("data-click");
		if(!hasClick){
			 src = _this.attr("href");
			_this.attr("href","javascript:void(0)");
			_this.attr("data-click","true");
			_this.attr("data-href",src);
			
		}else{
			 src = _this.attr("data-href");
		}
		
		$(".newsconright").css("padding","40px 0 0 0");
		$(".articleContent").toggle();
		$(".newslist ul li").hide();
		$(".backlist").show();
		$(".articleContent .articles").attr("src",src);

	})
	
	$(".backlist").click(function(){
		$(".articleContent").toggle();
		$(".newsconright").css("padding","40px 0 19px 19px");
		$(".newslist ul li").show();
		$(this).hide();
	})
	
	$("area").click(function(){
		$(".backlist").show();
		var _this=$(this)
		var src="";
		var hasClick=_this.attr("data-click");
		if(!hasClick){
			 src = _this.attr("href");
			_this.attr("href","javascript:void(0)");
			_this.attr("data-click","true");
			_this.attr("data-href",src);
			
		}else{
			 src = _this.attr("data-href");
		}
		$(".newsconright").css("padding","40px 0 0 0");
		$(".articleContent").show();
		$(".articleContent .articles").attr("src",src);
		$(".newslist ul li").hide();
	})
	
	var _url = window.location.href;
	var start = _url.indexOf('col');
	var pLayout =  _url.substr(start+3,3);
	console.log(pLayout);
	$(".Therestlist li").each(function(){
		var word = $(this).find(".layoutNum").html();
		if(word == pLayout){
			$(this).addClass('cur').siblings().removeClass('cur');
		}
	})
	
})
