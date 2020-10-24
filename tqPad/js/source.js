$(function() {
	var Id = window.location.search;
	var Id1 = Id.split("=")[1];
	console.log(Id1);
//	bannerAjax();
function Dswiper() {
	var swiper = new Swiper('#swiper_containerNav', {
		pagination: '.swiper-pagination',
		slidesPerView: 5.7,
		paginationClickable: true,
		freeMode: true,
	});
}

//设置图片轮播效果
function DswiperIn() {
	var InBanner = $('#InBanner');
	var slide = InBanner.find('.swiper-slide');
	var swiper = new Swiper('#InBanner', {
		pagination: '.swiper-pagination',
//		autoplay: 3000
	});
}

		
//页面传递参数,用以返回当前栏目
var params = window.location.href;
var name = 'id';
var columID = 0; 
var start = params.indexOf(name + "=");
if(start >= 0) {			
	start += name.length + 1;
	var end = params.indexOf("&", start);
	if(end > 0) {
		columID = params.substring(start, end);
	} else {
		columID = params.substring(start);
	}
}
	
//ajax数据初始化
var aID = [];
var navCon = $('#tiaoZid');
var tabColumn = $("#moelist");
var news = $("#NewslistCon");
var datajson = {
	siteId: 1,
	parentColumnId: 2,
	version: 0,
	columnType: 1,
	lastFileId: 0,
	count: 5,
	rowNumber: 5,
	topCount:[]
}
var artNum;
	
//初始化页面内容    http: //192.168.146.10:8080/nanfang_if/getColumns?siteId=6&parentColumnId=1&version=0&columnType=-1
function NavAjax() {
	$.ajax({
		url: 'http://172.19.32.152:81/app_if/getColumns',
		jsonp: 'jsoncallback',
		type: 'GET',
		dataType: 'JSONP',
		data: {
			siteId: 1,
			parentColumnId: 2,
			version: 0,
			columnType: 1
		},
		success: function(nav) {
			var html = '';
			if(nav.columns) {
				if(columID != 0){							
					datajson.parentColumnId = columID;
				}else{
					datajson.parentColumnId = nav.columns[0].columnId;
				}						
				for(var i = 0; i < nav.columns.length; i++) {
					var cn = '<div class="swiper-slide nav"><a href="javascript:void(0)"  data-topCount="'+nav.columns[i].topCount +'" data-columnId="'+nav.columns[i].columnId+'">' + nav.columns[i].columnName + '</a></div>';
					html += cn;
					aID.push(nav.columns[i].columnId);
					datajson.topCount.push(nav.columns[i].topCount);
//					for (var j = 0; j < 2; j++ ) {
//						if (nav.columns[j].topCount != 0) {	
//							debugger;
//							bannerAjax();	
//						}else{
//							$("#bannerOneCon").hide();
//						}
//					}
					
				
				}				
				navCon.html(html);
				tabColumn.html(html);
			}
				
			//获取文章列表
			aopenAjax();
			//制作轮播图
//			bannerAjax();
			
			
			Dswiper();
			var num=window.location.search.split("=")[1]-3;
			if(num){
				$(".NavSeiper .nav").eq(num).find('a').addClass("active");
			}else{
				$(".NavSeiper .nav").eq(0).find('a').addClass("active");
			}
			
		}

	})
	
}
	
	
//获取文章
http: //192.168.146.10:8080/nanfang_if/getArticles?columnId=6&version=0&lastFileId=0&count=20&rowNumber=0
function aopenAjax() {
	//当前条数
	var liLeng=$("#inListL").children().length;	
	$.ajax({
		url: 'http://172.19.32.152:81/app_if/getArticles',
		jsonp: 'jsoncallback',
		type: 'GET',
		dataType: 'JSONP',
		data: {
			siteId: 1,
			columnId: datajson.parentColumnId,
			version: datajson.version,
			lastFileId: datajson.lastFileId,
			count: datajson.count,
			rowNumber: datajson.rowNumber
		},
		success: function(data) {
			var html = '';
			var len=5;
			if(data.length>len){
				len=5
			}else{
				len=data.length;
			}
			
			var sum=parseInt(liLeng+len);
			
			if(sum < data.length){
				sum=parseInt(liLeng+len);
				$(".tuijian").text("总共为你推荐了"+(sum-liLeng)+"条文章")
			}else if(sum > data.length){
				sum=data.length;
				
				$(".tuijian").text("总共为你推荐了"+(sum-liLeng)+"条文章")
			}
			
			if(liLeng>=data.length){
				$(".tuijian").text("小编正在加紧备货中")
				return
			}
			if(data) {
				for(var i = liLeng; i < sum; i++) {		
					var cn = sppendHtml(data[i]);
					html += cn;
				}
				$('ul#inListL').prepend(html);			
			}
		}
	})
}
	

	
	//导航请求
	navCon.on('touchstart', 'a', function() {
		datajson.parentColumnId = $(this).attr('data-columnId');
		$('ul#inListL').empty(); 
//		$("div#bannerOneCon").empty();
		var num=$(this).parent().index();
		
		artNum = $(this).attr('data-topcount');
		
		
		$(this).addClass("active").parent().siblings().find('a').removeClass("active");
		 _index =  $(this).parent().index();
		 setTimeout(function(){
		 	window.location.href="http://172.19.32.152/xy/wap/index.html?id="+ aID[num];
		 },2000)
		 debugger;
		 bannerAjax();
	});
	
	
	
	
	
function bannerAjax() {
$.ajax({
		url: 'http://172.19.32.152:81/app_if/getArticles',
		jsonp: 'jsoncallback',
		type: 'GET',
		dataType: 'JSONP',
		data: {
			siteId: 1,
			columnId: datajson.parentColumnId,
			version: datajson.version,
			lastFileId: datajson.lastFileId,
			count: datajson.count,
			rowNumber: datajson.rowNumber
		},
		success: function(json) {
//			var artNum = datajson.topCount[1];
			var len = artNum;
			var html = '';
			if(len == 0){
				$("#bannerOneCon").hide();
			}else{
				if(json) {
					for(var j = 0; j < len; j++) {		
						var cn = apendHtml(json[j]);
						html += cn;
					}
					$('.banner').append(html);
					DswiperIn();		
				}
			}
			
		}
	})
	
}


//组图稿件
function apendHtml(data) {	
	var publicTime = data.publishtime.substring(5,11);
	if(data.bigPic == 1) {
		var html = '<div class="swiper-slide" style="height:364px;">' + 
				   '<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>' + 
				   '<div>'
					return html;
	} else if(data.articleType == 6) {	
		var html = '<div class="swiper-slide" style="height:325px;">' + 
				   '<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>'+
				   '</div>'
					return html;
	}else if(data.articleType == 2){			
		var html = '<div class="swiper-slide" style="height:325px;">' + 
				   '<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>'+
				   '</div>'
					return html;
	}else if(data.articleType == 3) {
		
		var html = '<div class="swiper-slide" style="height:325px;">' + 
					'<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>' +
				   '</div>'
					return html;
	}else if(data.articleType == 4) {
		
		var html = '<div class="swiper-slide" style="height:325px;">' + 
					'<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>' +
				   '</div>'
					return html;
	}else if(data.articleType == 0) {
		var html = '<div class="swiper-slide" style="height:325px;">' + 
					'<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>'+
				   '</div>'
					return html;
	}else if(data.articleType == 1) {	
		var html = '<div class="swiper-slide" style="height:325px;">' + 
					'<a href="' + data.shareUrl + '">' +
				   '<img style="width: 100%;" src="' + data.picMiddle + '">' +
				   '</a>'+
				   '<div class="wordText">' + 
				   '<p>' + data.title  + '</p>' +
				   '</div>'+
				   '</div>'
					return html;
	}
}
	
//判断文章类型
function sppendHtml(data) {	
	var publicTime = data.publishtime.substring(5,11);
	if(data.bigPic == 1) {
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleFour" data-fileId="' + data.fileId + '">' +
			'<a href="' + data.shareUrl + '">' +
			'<div class="L">' +
			'<div class="head">' + data.title + '</div>' +
			'<div class="info">' +
			'<div class="xinxi"><span class="lei '+ mgr4 +'">'+ data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'<div class="imgCon">' +
			'<img src="' + data.picMiddle + '">' +
			'</div>	' +
			'<div class="clear"></div>' +					
			'</a></li>';
		return html;
	} else if(data.articleType == 6) {
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleOne" data-fileId="' + data.fileId + '">' +
			'<a href="http://172.19.32.152/template/livePage.html?id=' + (data.linkID + 1) + '">' +
			'<div class="head">' + data.title + '</div>' +
			'<div class="info">' +
			'<div class="xinxi"><span class="lei '+ mgr4 +'">' + data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="biao"><span class="bet">直播</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</a>' +
			'</li>';
		return html;
	}else if(data.articleType == 4){
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleTwo" data-fileId="' + data.fileId + '">' +
			'<a href="' + data.shareUrl + '">' +
			'<div class="L">' +
			'<div class="head">' + data.title + '</div>' +
			'<div class="info">' +
			'<div class="xinxi"><span class="lei '+ mgr4 +'">' + data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'<div class="RimgCon">' +
			'<img src="' + ifimgtrue(data.picMiddle) + '">' +
			'</div>' +
			'<div class="clear"></div>' +
			'</a>' +
			'</li>';
		return html;
	}else if(data.articleType == 2){
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleTwo" data-fileId="' + data.fileId + '">' +
			'<a href="' + data.shareUrl + '">' +
			'<div class="L">' +
			'<div class="head">' + data.title + '</div>' +
			'<div class="info">' +
			'<div class="xinxi"><span class="lei '+ mgr4 +'">' + data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'<div class="RimgCon">' +
			'<img src="' + ifimgtrue(data.picMiddle) + '">' +
			'</div>' +
			'<div class="clear"></div>' +
			'</a>' +
			'</li>';
		return html;
	}else if(data.articleType == 3) {
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleTwo" data-fileId="' + data.fileId + '">' +
			'<a href="http://172.19.32.152/xy/wap/FeaturesList.html?id=' + data.linkID + '">' +
			'<div class="L">' +
			'<div class="head">' + data.title + '</div>' +
			'<div class="info">' +
			'<div class="xinxi"><span class="lei '+mgr4+'">' + data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'<div class="RimgCon">' +
			'<img src="' + ifimgtrue(data.picMiddle) + '">' +
			'</div>' +
			'<div class="clear"></div>' +
			'</a>' +
			'</li>';
		return html;
	}else if(data.articleType == 0) {
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleTwo" data-fileId="' + data.fileId + '">' +
			'<a href="' + data.shareUrl + '">' +
			'<div class="L">' +
			'<div class="head">' + data.title + '</div>' +
			'<div class="info">' +
			'<div class="xinxi"><span class="lei '+mgr4+'">' + data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>' +
			'<div class="RimgCon">' +
			'<img src="' + ifimgtrue(data.picMiddle) + '">' +
			'</div>' +
			'<div class="clear"></div>' +
			'</a>' +
			'</li>';
		return html;
	} else if(data.articleType == 1) {
		var mgr4="";
		if(data.source===""){
			mgr4="mgr0"
		}else{
			mgr4="mgr4"
		}
		var html = '<li class="styleTri" data-fileId="' + data.fileId + '">' +
			'<a href="' + data.shareUrl + '">' +
			'<div class="head">' + data.title + '</div>' +
			'<ul class="imglist">' +
			'<li><img src="' + data.pic0 + '"></li>' +
			'<li><img src="' + data.pic1 + '"></li>' +
			'<li><img src="' + data.pic2 + '"></li>' +
			'<div class="clear"></div>' +
			'</ul>' +
			'<div class="info">' +
//				'<div class="xinxi"><span class="lei '+mgr4+'">' + data.source + '</span><span class="time">' + publicTime + '</span></div>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</a>' +
			'</li>';
		return html;
	}
}

//快捷导航请求
tabColumn.on('touchstart', 'a', function() {
	datajson.parentColumnId = $(this).attr('data-columnId');
	$('ul#inListL').empty();
	$("div#bannerOneCon").empty();
	aopenAjax();
	$("#HandoverCon").hide();
	$("#indexHeader").show();
	$("#MaxCon").show();
})


//点击刷新功能
$("#GoRefresh").on("touchstart",function(){
	aopenAjax();
	$(".tuijian").show();
	setTimeout(function(){
		$(".tuijian").hide();
	},1000)
})


//设置占位图
function ifimgtrue(img) {
	if(img) {
		return img;

	} else {
		return 'images/z3.png';

	}
}


NavAjax();

});