// JavaScript Document


(function($) { 
   $.fn.touchwipe = function(settings) {
     var config = {
    		min_move_x: 20,
 			wipeLeft: function() {},
 			wipeRight: function() {},
			preventDefaultEvents: true
	 };
     
     if (settings) $.extend(config, settings);
 
     this.each(function() {
    	 var startX;
		 var isMoving = false;

    	 function cancelTouch() {
    		 this.removeEventListener('touchmove', onTouchMove);
    		 startX = null;
    		 isMoving = false;
    	 }	
    	 
    	 function onTouchMove(e) {
    		 if(config.preventDefaultEvents) {
    			 e.preventDefault();
    		 }
    		 if(isMoving) {
	    		 var x = e.touches[0].pageX;
	    		 var dx = startX - x;
	    		 if(Math.abs(dx) >= config.min_move_x) {
	    			cancelTouch();
	    			if(dx > 0) {
	    				config.wipeLeft();
	    			}
	    			else {
	    				config.wipeRight();
	    			}
	    		 }
    		 }
    	 }
    	 
    	 function onTouchStart(e)
    	 {
    		 if (e.touches.length == 1) {
    			 startX = e.touches[0].pageX;
    			 isMoving = true;
    			 this.addEventListener('touchmove', onTouchMove, false);
    		 }
    	 }    	 
    		 
		 this.addEventListener('touchstart', onTouchStart, false);
     });
 
     return this;
   };
 
 })(jQuery);


$(function(){
	
	$(window).resize(tryResize);

	
	$('.navicon').on('click',function(){
		$('.navs').addClass('navsshow');
		$('.navmask').addClass('navmaskshow');
	});
	$(document).on("click touchend",".navmaskshow",function(e){
		$('.navs').removeClass('navsshow');
		$('.navmask').removeClass('navmaskshow');
	})

	//下拉
	$('.navs ul li').each(function(index, element) {
        $(this).find('h3').on("click",function(){
			$(this).parent().toggleClass('cur');
			$(this).next().slideToggle();
			if($(this).next().css('display')=="block"){
				$(this).parent().siblings().removeClass('cur').find('.navsdrop').slideUp();	
			}
		});
    });
	
	

	$('.Fixedicon').click(function(){
		$('.Newscon').addClass('Newsconshow')
		$(this).hide();
		$('.iconright').show();	
		
	})
	
	$('.iconright').click(function(){
		$(this).hide();
		$('.Fixedicon').show();	
		$('.Newscon').removeClass('Newsconshow')
			
	})
	
	
	
	
})


  