var max = 20;//正文最小字体
var min = 12;//正文最大字体
var path = "../../../layout/";
var prefix = "/node_";//前缀

var myScroll;
$(window).load(function(){
    var y;
    myScroll = new iScroll('main',{
        onScrollStart: function(){y = this.y;},
        onScrollEnd: function(){
	        var height = $(".caption").outerHeight();
            if(Math.abs(this.y) > height){
                $("#toTop").show("slow");
            }else{
                $("#toTop").hide("slow");
            }
        }
    });
		$(".content img").load(function(){
			myScroll.refresh();
		});
		scrollRefresh();
	//动态加载内容页面分析内容
	//autoLoadShareInfo();
});
var refreshFlag = null;
function scrollRefresh(){
	if($('#scroller').height()){
		myScroll.refresh();
		if(refreshFlag){
			clearInterval(refreshFlag);
			refreshFlag = null;
		}
	}else{
		if(!refreshFlag){
			refreshFlag = setInterval(scrollRefresh, 100);
		}
	}
}
//左滑动监听
$(window).on("swipeleft",function(){next()});
//右滑动监听
$(window).on("swiperight",function(){prev()});

var isOperate = true;



//蒙版监听
$("#mask").on("touchend",function(){
    $("#share").css("bottom","-100px");
    $("#share").hide("slow");
    $("#mask").hide("slow");
    isShare = false;
});

//字体加大
function fontLarger(){
    var $element = $(".content")
	var $element2 = $(".content p")
    var size = parseInt($element.css("font-size"));
    if(max > size){
        $element.css("font-size",(size+2)+"px");
		$element2.css("font-size",(size+2)+"px");
		myScroll.refresh();
		$("#operate li:eq(2) a").css("background-color","#D9383D");
    }else{
        $("#operate li:eq(1) a").css("background-color","#DDD");
        $("#operate li:eq(2) a").css("background-color","#D9383D");
    }
};
//字体见效小
function fontSmaller(){
    var $element = $(".content");
	var $element2 = $(".content p")
    var size = parseInt($element.css("font-size"));
    if(size > min ){
        $element.css("font-size",(size-2)+"px");
		$element2.css("font-size",(size-2)+"px");
		myScroll.refresh();
		$("#operate li:eq(1) a").css("background-color","#D9383D");		
    }else{
        $("#operate li:eq(2) a").css("background-color","#DDD");
        $("#operate li:eq(1) a").css("background-color","#D9383D");
    }	
};

//检查链接是否有效
function checkUrl(url){
    isUseful = false;
    $.ajax({   
		url:url, 
		type: 'GET',   
		async: false,
		success: function(xml){
            isUseful = true;
		}
	});
    return isUseful
}

//点击后返回到顶部
$("#toTop").on("touchend",function () {
    myScroll.scrollToElement(".caption",500);
    $("#toTop").hide("slow");
    return false;
});

//返回版面
function backPage(){
	// var layout = $("#nowLayout").text();
    // var url = location.href;
    // var re = /(\d{6})\/(\d{2})/;
    // if (~url.indexOf('paperSpecial')) {
    //     re = /paperSpecial\/\d+/
    // }
    // var r = url.match(re);
    // console.log(r);
	// if (r) {
	// 	location.href = path+r[0]+prefix+layout+".html";
	// }else{
	// 	location.href = path+r[0]+prefix+layout+".html";
    // }
    // 如果不是从首页进来的返回首页
    if (!!~document.referrer.indexOf('pad')) {
        history.back();
    } else {
        location.href = path;
    }
};

//setColor(0);//0 红色 1 蓝色 2 绿色 3 渐变红色
//设置顶部颜色
/* function setColor(c){
    if(c==0){
        $("header").addClass("red")
    }else if(c==1){
        $("header").addClass("blue")
    }else if(c==2){
        $("header").addClass("green")
    }else if(c==3){
        $("header").addClass("change-red")
    }
} */

//微信分享提示
function weixin(){
	if (typeof WeixinJSBridge == "undefined") {
	   alert("请先通过微信打开，再分享文章.");
	} else {
		$('#mcover').css('display', 'block');
	}	
}
