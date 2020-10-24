var mySwiper;
var freePaperName;
var paidPaperName;
var scannext = true;
$(function(){
    var _nav = $('#J_nav');                         //导航
    var _navBtn = $('#J_page_btn');                 //导航按钮
    var _navMask = $('#J-nav-mask');				//导航遮罩层
    var _newsBtn = $('#J_news_btn');                //新闻列表按钮
    var _mainInside = $('#J_main_inside');         //滑动内容
    var _winHeight = $(window).height();       //高度
    var _winWidth = $(window).width();
    window.currDomain = window.currDomain || {};
    var authCode = window.currDomain.domain || "szb";
    // 判断是否pc设备，若是pc，需要更改touch事件为鼠标事件，否则默认触摸事件
    var touchEvents = {
        touchstart: "touchstart",
        touchmove: "touchmove",
        touchend: "touchend",

        initTouchEvents: function(){
            if(!this.isMobileUserAgent()){
                this.touchstart = "mousedown";
                this.touchmove = "mousemove";
                this.touchend = "mouseup";
            }
        },
        isMobileUserAgent: function(){
            return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
        }
    };
    touchEvents.initTouchEvents();
    
    
    var userId = doGetCookie('uid_fouNder');
    var _ssoId = doGetCookie("mid_fouNder");
    var uerName = doGetCookie('username_fouNder');
    var _href = window.location.href;
    setCookie("padSkipHref",_href);

    $('.go-login').on(touchEvents.touchstart, function() {
        login();
    });
    
    if(uerName){
    	$(".userIcon").hide();
		$(".userName").html('我的').show();
        $(".userNM").show();
    }
    
    var paperName = $('.paperName').html();

    hotArea();

	// $.ajax({
	// 	type: "get",
	// 	url: ''+ xyUrl +'/amuc/api/read/getUserPermission',
	// 	async: true,
	// 	data: {
	// 		"uid":  _ssoId,
	// 		"siteID":siteID
	// 	},
	// 	success:function(datas){
	// 		var datas = JSON.parse(datas);
	// 		var curPaperName = $(".paperName").text();
	// 		var curTime = $("#paperdate").text();
	// 		var newCurTime = curTime.replace(/[^\x00-\xff]/g,'-').substr(0,10);
	// 		for(var i in datas) {
	// 			var free = datas.free;
	// 			var paid = datas.chargeable;
	// 			var member = datas.isMember;
	// 			for(var j in free) {
	// 				var isFree = true;
	// 				if(free[j].paperName == curPaperName) {
	// 					for (var n in free[j].available_pd) {
	// 						if(free[j].available_pd[n] == newCurTime){
	// 							scannext = true;
	// 							break;
	// 						}
	// 					}
						
	// 				}

	// 			}
	// 			for(var k in paid) {
	// 				if(paid[k].paperName == curPaperName) {
	// 					for (var t in paid[k].available_pd) {
	// 						if(paid[k].available_pd[t] == newCurTime){
	// 							scannext = true;
	// 							break;
	// 						}
							
	// 					}
					
	// 				}
	// 			}
				
	// 		}
	// 		setPerssion(curPaperName, member);
	// 	}
	// });
window.onload = function(){
	

//首页
   
 }
	
var userName=encodeURI(encodeURI(uerName));
var _href = window.location.href;
var pattern = /[0-9]{6}\/[0-9]{2}/;
var curdate = _href.match(pattern);
var startCount = _href.indexOf('node');
var endCount = _href.indexOf('.html');
var paperLayout = _href.substring(startCount + 4, endCount);
$(".userName").parent().attr('href','http://'+ window.location.host +'/amucsite/amuc/ucmember/ucApp.html?code=' + authCode + '&uid='+ userId +'&username='+ userName +'&siteID='+siteID+'&curdate='+ curdate +'&paperLayout='+ paperLayout +'');

if(GLOBAL.pageName == 'index') {
    //大图左右滑动   swiper-wrapper
    mySwiper = new Swiper('.swiper-container', {
        loop: true,
        onSlideChangeEnd: function() {
            hotArea();
            $("#catalog").scrollTop(0);
            //显示遮罩
            $(".swiper-container area").on("click", function() {
                var _coords = $(this).attr("coords");
                var _ca = _coords.split(",");
                var minX = 0;
                var minY = 0;
                var maxX = 0;
                var maxY = 0;
                if(_ca && _ca.length > 0) {
                    for(var k in _ca) {
                        var num = parseFloat(_ca[k]);
                        if(k % 2 == 0) {
                            if(k == 0) {
                                minX = num;
                                maxX = num;
                            }
                            if(num < minX) {
                                minX = num;
                            }
                            if(num > maxX) {
                                maxX = num;
                            }

                        } else {

                            if(k == 1) {
                                minY = num;
                                maxY = num;
                            }
                            if(num < minY) {
                                minY = num;
                            }
                            if(num > maxY) {
                                maxY = num;
                            }
                        }
                    }
                    var width = maxX - minX + 3;
                    var height = maxY - minY + 3;
                    showArea(minY, minX, width, height);
                }
            });
        }
    });
    $(".buyPaper span,.activePaper span,.userImg").on('click',function(){
        login();
    })
    //点击返回按钮回到当前版面
    var __layout = $("#nowLayout").text();
    if(__layout && $.trim(__layout) != "") {
        var __index = $(".swiper-wrapper").children("div[lid=" + __layout + "]").index();
        __index = parseInt(__index);
        mySwiper.slideTo(__index, 0);
        $(".swiper-container").css("opacity",'1');
    }
    
    
    //时间控件点击事件
    $(".date.bDate").on("click", function(){
        $(".screen").show();
        $("html").addClass("alpha");
        if (checkSpecial()) {
            $('.special-stage').show();
        }
        else {
            $(".time-control").show();
        }
        navSlide();
        specailSlide();
        if(isCatalog){
            hideCatalog();
        }
    })
    
    
    $(".payTip").hide();
    $(".screen").hide();

}
    $(".swiper-container").css("opacity",'1');

    _nav.css('left',-( _winWidth)+'px');
    //点击版面切换效果
     function navSlide(type){
    	//获取状态
		var _navStatus = _navBtn.attr('data-status');   
		if(_navStatus == 'close' && type=='btn'){
			_nav.css('left',0);
			_navBtn.attr('data-status','open');
			_navMask.show();
			scrollTopVer();
		}else if(_navStatus == 'open'){
			_nav.css('left',-(_winHeight)+'px') 
			_navBtn.attr('data-status','close');
			_navMask.hide();
			$(".sub-nav").scrollTop(0);
		}    
    }
    function specailSlide(type) {
        var _navStatus = $('#specail-btn').attr('data-status');
        var _special = $('.specail-box');
        if (_navStatus == 'close' && type == 'btn') {
            _special.css('left', 0);
            $('#specail-btn').attr('data-status','open');
            _navMask.show();
            scrollTopVer();
        } else if (_navStatus == 'open') {
            _special.css('left',-(_winHeight)+'px');
			$('#specail-btn').attr('data-status','close');
			_navMask.hide();
			$(".specail-nav").scrollTop(0);
        }
    }
	//跳转到登录页面
	function login(){
        var anyUrl = window.location.href;
        anyUrl = encodeURIComponent(decodeURIComponent(anyUrl));
        // console.log(anyUrl);
		window.location.href = SSO_url  +'/user/ssoLogin?code=' + authCode + '&redirectUrl=http://'+ window.location.host +'/sso/setCookie.html?&isAppType=app&anyUrl='+anyUrl
        // var aa = SSO_url  +'/user/ssoLogin?code=szb&redirectUrl=http://'+ window.location.host +'/sso/setCookie.html?&isAppType=app&anyUrl='+anyUrl
        console.log(aa);
	}
	
	//跳转到选择套餐页面
	function choiceOrder(){
		window.location.href = 'http://'+ window.location.host +'/amucsite/amuc/colfees/choiceOrderApp.html?siteID='+ siteID +'';
	}
	//跳转到激活报卡页面
	function activateOrder(){
		window.location.href = 'http://'+ window.location.host +'/amucsite/amuc/colfees/activateApp.html?ssoid='+ userId +'&siteID='+ siteID +'';
	}
	
	function scrollTopVer(){
		var vers = $("#J_page_btn").text();
		$(".sub-nav").children('div').eq(0).addClass("sub-navDiv");
        $(".sub-navDiv div").each(function(){
        	var str = $.trim($(this).text());
        	var startIndex = str.indexOf('(');
        	var endIndex = str.indexOf(')');
        	var strNew = str.substring(startIndex+1,endIndex);
        	if(strNew == vers){
        		$(this).find('a').css("color","red");
        		$(".sub-nav").scrollTop($(this).offset().top);
        	}
        })
        
    }
    function getQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return decodeURI(r[2]); return null;
    }
    // 判断是否是专题
    function checkSpecial() {
        var _href = location.href;
        return ~_href.indexOf('paperSpecial');
    }
	
    function newsSlide(type){
        //获取状态
        var _newsStatus = _newsBtn.attr('data-status');
        if(_newsStatus == 'close' && type == 'btn'){
            $('#J_news_wrap').show();
            _mainInside.addClass('open');
            var layout_id = $('.swiper-slide-active').attr('lid');
            var list_url = "./list_" + layout_id + ".htm";

            $.get(list_url, function(rs){
                $('#J_news_wrap').html(rs);
            });

            //按钮
            _newsBtn.css('right', '100%').addClass('rotate').attr('data-status', 'open');
        } else if(_newsStatus == 'open'){
            _mainInside.removeClass('open');
            //按钮
            _newsBtn.css('right', '0').removeClass('rotate').attr('data-status', 'close');

        }
    }
	//获取热区坐标赋值给area标签
    function calc_hotarea(){
        var lid = $('.swiper-slide-active').attr('lid');
        var width = $('.swiper-slide-active > img').width();
        var height = $('.swiper-slide-active > img').height();
        var html_map_obj = $("#newbook_" + lid);
        var map_un_obj = eval("map_" + lid);
        var map_obj = map_un_obj.a;
        map_obj = eval(map_obj);

        var area_html = "";
        html_map_obj.html("");

        var map_list_obj = map_un_obj.l;
        map_list_obj = map_list_obj.substring(1, map_list_obj.length - 1);
        var list = map_list_obj.split(",");

        for(var i in map_obj){
            var map_item_len = map_obj[i].length;
            area_html = '<area shape="polygon" coords="';
            var area_array = [];
            for(j = 0; j < map_item_len; j++){
                if(j != 0 && j % 2 == 1){
                    area_array[j] = parseInt(height * map_obj[i][j] / 100);
                } else{

                    area_array[j] = parseInt(width * map_obj[i][j] / 100);
                }
            }
            area_html += area_array.join(",");
            area_html += '" href="' + list[i] + '">';
            area_html += '</area>';
            html_map_obj.append(area_html);
        }
    }

	//模拟热区遮罩
    function showArea(_top, _left, _width, _height){
        var width_ = parseInt(_width);
        var height_ = parseInt(_height);
        if($("#areaSharp").size() == 0){
            $(document.body).append("<div id='areaSharp' class='areaSharp' style='position:absolute; z-index: 5000;  '></div>");
        }
        var _$as = $("#areaSharp");
        _$as.css({
            top: _top + 50,
            left: _left + 15,
            width: width_ + "px",
            height: height_ + "px",
            "background-color": "#000",
            "opacity": "0.6"
        });
        $('#areaSharp').show();
        setTimeout("$('#areaSharp').hide()", 500);
    }
    
    
	//获取版面信息
    function getVersionData(layout_id, version){
        $('#J_page_btn').html(version);
        $('#J_page_id').html(layout_id);
        calc_hotarea();
        var next_div = $('#J_main_inside .swiper-slide-active').next();
        var prev_div = $('#J_main_inside .swiper-slide-active').prev();
        if(next_div.attr("isload") != 'true'){
            next_div.html('<img src="' + next_div.attr('onload_img') + '" usemap="#newbook_' + next_div.attr('lid') + '"/>');
            next_div.attr("isload", "true");

        }
        if(prev_div.attr("isload") != 'true'){
            prev_div.html('<img src="' + prev_div.attr('onload_img') + '" usemap="#newbook_' + prev_div.attr('lid') + '"/>');
            prev_div.attr("isload", "true");
        }
    }

    //获取热点
    function hotArea(){
        var layout_id = $('#J_main_inside .swiper-slide-active').attr('lid');
        var version = $('#J_main_inside .swiper-slide-active').attr('version');
        getVersionData(layout_id, version);
    }

    //设置cookies
    function setCookie(c_name, value, expiredays){
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    }

    // 判断是否微信
    function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        } else{
            return false;
        }
    }

    //读取cookies
   function setCookie(sName, sValue){
		if (sValue == "") sValue = "";
		//cookie过期时间为关闭浏览器时就过期
		document.cookie = sName + "=" + escape(sValue) + ";path=/";
	}


    //删除cookies
    function delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if(cval != null){
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
    //导航切换
    $("#page-btn").on('click', function(){
        specailSlide();
        navSlide('btn');
        if(isCatalog){
            hideCatalog();
        }
        $(".sub-navDiv div").find('a').css("color","");
        var vers = $("#J_page_btn").text();
        var pageId = $('#J_page_id').text();
        $(".sub-nav").children('div').eq(0).addClass("sub-navDiv");
        $(".sub-navDiv div").each(function(){
            var str = $.trim($(this).text());
            var aId = $(this).find('a').attr('data-id')
            var startIndex = str.indexOf('(');
            var endIndex = str.indexOf(')');
            var strNew = str.substring(startIndex+1,endIndex);
            // if(strNew == vers){
            //     $(this).find('a').css("color","red");
            // }
            if(aId == pageId){
                $(this).find('a').css("color","red");
            }
        })
    })
    $("#specail-btn").on(touchEvents.touchstart, function(){
        navSlide();
        if(isCatalog){
            hideCatalog();
        }
        specailSlide('btn');
    })
    $('.date-back').on(touchEvents.touchstart, function() {
        $('.screen').hide();
        $('.payTip').hide();
        $("html").removeClass("alpha");
        $(".time-control").hide();
        $('.special-stage').hide();
        return false;
    })
    
    //目录切换时间
    $("#catalog-btn").on("touchend",function(){
        $(".sub-nav").scrollTop(0);
        if(isCatalog){
            hideCatalog();
        }else{          
            showCatalog();
        }
        navSlide();
        specailSlide();
    });

    //导航遮罩
    _navMask.on(touchEvents.touchstart, function(){
        navSlide('btn');
        return false;
    })
    

    // 列表高度限制
    var _listHeight = $(window).height() - 60;
    $('#J_news_wrap').height(_listHeight)

    $('.swiper-container, #J_news_wrap').on(touchEvents.touchstart, function(event){
        navSlide();
        specailSlide();
        var swiperHeight = $('.swiper-container').height();
        $('#J_news_wrap').height(swiperHeight)
    })


    // 子导航切换
    _nav.find('li').on(touchEvents.touchstart, function(){
        $(this).siblings().removeClass('active').end().addClass('active');
    })

    //新闻列表
    _newsBtn.on(touchEvents.touchstart, function(){
        newsSlide('btn');
        return false;
    })

    // 判断是否微信
    if(isWeiXin()){
        $('.bds_weixin').attr('data-cmd', '');
        $('.bds_weixin').on(touchEvents.touchstart, function(){
            $('.J-mask-share').show();
        })
        $('.J-mask-share').on(touchEvents.touchstart, function(){
            $(this).hide();
        });
    } else{
        $('.bds_weixin').hide();
    }

    //判断是否显示引导
//  if(!getCookie('visited')){
//      setCookie('visited', 'true', 7);
//      $('#J-guide-mask').hide();
//      $('#J-guide-mask').on(touchEvents.touchstart, function(){
//          $(this).hide();
//          return false;
//      });
//  }

	
    $(".page-btn").on("click", function(){
        $(".catalog").toggle();
    })
	
	
    
    //时间控件遮罩效果
    $(".screen").on("touchstart", function(){
        $(this).hide();
        $('.payTip').hide();
        $("html").removeClass("alpha");
        $(".time-control").hide();
        $('.special-stage').hide();
        return false;
    })
    
    
	

	var isCatalog = false;
	//显示目录
	function showCatalog(){
        $('body').css('overflow', 'hidden');
		$("#catalog").animate({bottom:"0"},"fast",function(){
			var vers = $("#J_page_btn").text();
	        $(".verson span").each(function(){
	        	if($(this).text() == vers){
	        		$("#catalog").scrollTop($(this).offset().top);
	        	}
	        })
		});
	
		
		isCatalog = true;
	}
	//隐藏目录
	function hideCatalog(){
        $('body').css('overflow', 'auto');
		$("#catalog").animate({bottom:"-100%"},"fast",function(){
			$("#catalog").scrollTop(0);
		});
		
		isCatalog = false;
	}
	
	$(".closeBtn").on('touchstart',function(){
		$(".payTip").hide();
		$(".screen").hide();
		return false;
	})
//	var vs = $('.verson').find('span');
	
	
});




//引入fastClick初始化代码
if('addEventListener' in document){
    document.addEventListener('DOMContentLoaded', function(){
        FastClick.attach(document.body);
    }, false);
}