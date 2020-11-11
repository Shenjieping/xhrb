var startYear = 1990;
var lastYear = 2050;
var date = "";

//年份列表
function yearList(){
	for(var i=startYear;i<=lastYear;i++){
		document.write('<option value='+i+'>'+i+'</option>');
	}
}
//月份列表
function monthList(){
	for(var i = 1 ;i<=12;i++){
		var num = appendZero(i);
		document.write('<option value='+i+'>'+num+'</option>');
	}
}

//数字前加0
function appendZero(num){
	var n = parseInt(num,10);
	if(n<10){
		return "0"+n;
	}
	return n;
}

//数字去除0
function offZero(num){
	var n = parseInt(num,10);
	if(n<10){
		return n;
	}
	return n;
}


function parseInt10(num){
	return parseInt(num,10);
}

//日历框架
function tdlist(){
	for(var i= 0;i<6;i++){
		document.write('<tr>');
		for(var j=0;j<7;j++){
			var num = i*7+j;
			document.write('<td bgcolor="#fff" class="default" style="cursor:default;" align=center><a href="#" id=AD'+num+'><span class="date" style="font-family:Verdana, Arial;font-size:15px;" id=SD'+num+'></span></a></td>');
		}
		document.write('</tr>');
	}
}
//函数调用,加载日历
function loadCalendar(){
	var yearBox = $("#year_box");
	var monthBox = $("#month_box");
	var nowMonth = getNowMonth();
	var y;
	var m;
	if(nowMonth ==null ||nowMonth==""){
		var date = new Date();
		y = date.getFullYear();
		m = date.getMonth()+1;
	}else{
		y = nowMonth.substring(0,4);
    	m = nowMonth.substring(4,6);
	}
	m = parseInt10(m);
	yearBox.val(y);
	monthBox.val(m);
	drawCal(y,m);
}

//获取当前报纸的年月（根据url获取）
function getNowMonth()
 {
    var nowUrl = location.href; 
    var re =/(\d{6})\/(\d{2})/;
    var r = nowUrl.match(re);
	date = r ? r[2] : '';
    var newData = r ? r[1] : '';
	return newData;
 }
 // 获取当前的年月日
function getNowDate() {
    var _url = location.href;
    var re =/(\d{6})\/(\d{2})/;
    var r = _url.match(re);
    if (r) {
        // return r[0].substring(0, 4) + '/' + r[0].substring(4);
        return {
            year: r[1].substring(0, 4),
            month: r[1].substring(4),
            day: r[2]
        };
    }
    return {
        year: '',
        month: '',
        day: ''
    };
}
 
 //构建日历
 function drawCal(y,m){
 	
 	$("#data_table").find("img[class='div1']").remove();
     $(".date").css("border","none");
     $('.date').removeClass('date-handler')
	var adArray = new Array();
	var sdArray = new Array();
	for(var i=0;i<42;i++){
		adArray[i] = $("#AD"+i);
		sdArray[i] = $("#SD"+i);
		adArray[i].attr("href","#");//将链接地址置空
		sdArray[i].text("");//清空日期table
		sdArray[i].removeClass("active1");
		// sdArray[i].css("display","inline");
	}
	var startDate = new Date(parseInt10(y),parseInt10(m)-1,1);//输入月份的第一天
	var endDate = new Date(parseInt10(y),parseInt10(m),0);//输入月份的最后一天
	var startIndex = startDate.getDay();
	var endIndex = endDate.getDate();
	//填充日历
	for(var i = 1;i<=endIndex;i++){
		var index = startIndex + i-1;
		sdArray[index].text(i);
		// sdArray[index].css({
		// 	"color":"#333",
		// 	"cursor":"default",
		// 	"display":"block"
		// 	});

	}
	var dateStr = y+"-"+appendZero(m);
	
	//获取xml数据
	$.get("../../../layout/"+y+appendZero(m)+"/period.xml", function(xmlData){
		if(xmlData==null || xmlData=="") return;
		  $(xmlData).find("period").each(function(){
				var time = new Date($(this).find("period_date").text());
				var SY = time.getFullYear();
				var SM = time.getMonth()+1;
                var SD = time.getDate();
                var getDate = getNowDate();
				var year=$("#year_box").val();
				var month = $("#month_box").val();
				if(SY==year && SM==month){
				var url = getPreUrlByDate(SY,SM,SD);
				var front_page = $(this).find("front_page").text();
				url += front_page;
				var id = startIndex+parseInt10(SD)-1;
				adArray[id].attr("href",url);
                sdArray[id].addClass('date-handler');
				// sdArray[id].css({
				// 	"background":"#fff",
				// 	"cursor":"pointer",
				// 	"display":"block",
				// 	"color":"#000",
				// 	"border":"1px solid red",
				// 	"border-radius":"3px",
				// 	"margin-right":"5px"
					
				// });
				sdArray[id].parent('a').css("position","relative");
				var img = document.createElement('img');
				sdArray[id].parent('a').append(img);
				sdArray[id].siblings("img").addClass("div1");
				
				
				var setId = $("#date-btn").text();
                var offSetId = offZero(setId); 
                var nowMonth = offZero(getDate.month);
				var sdText = sdArray[id].text();
				for (var i = 0; i < sdText.length; i++) {
					if(offSetId == sdText && nowMonth == month && getDate.year == year){
						sdArray[id].addClass("active1");
						sdArray[id].remove("img");
					}else{
						sdArray[id].removeClass("active1");
//						sdArray[id].addClass("active1");
						// $(".div1").attr("src","http://120.27.196.241/xyv5/pad/paper/templet_new/numberPaper/images/01.png")
					}
				}
//				sdArray[id].addClass("active1");
				
			}
				
		  });	
	});		
	
}
//按日期获取地址前缀
function getPreUrlByDate(SY,SM,SD){
	//var localUrl = location.href;
	//var re = /([\s\S]+?)(\d{4}-\d{2}\/\d{2})[\/\\]/i;
	//var r = localUrl.match(re);
	//var url = r[1]+SY+"-"+appendZero(SM)+"/"+appendZero(SD)+"/";
	 var url = "../../../layout/"+SY+appendZero(SM)+"/"+appendZero(SD)+"/";
	return url;
}

function changeY(opt){
	var yearBox = $("#year_box");
	var monthBox = $("#month_box");
	var SY = parseInt10(yearBox.val());
	var SM = parseInt10(monthBox.val());
	SY = parseInt10(SY)+opt;
	if(SY < startYear || SY > lastYear) return;
	yearBox.val(SY);
	drawCal(SY,SM);
}

function changeMn(opt){
	var yearBox = $("#year_box");
	var monthBox = $("#month_box");
	var SY = parseInt10(yearBox.val());
	var SM = parseInt10(monthBox.val());
	SM = SM + opt;
	if(SM < 1){
		SY -= 1;
		SM = 12;
	}else if(SM > 12){
		SY += 1;
		SM = 1;
	}
	yearBox.val(SY);
	monthBox.val(SM);
	drawCal(SY,SM);
}

function changeDate(){
	var yearBox = $("#year_box");
	var monthBox = $("#month_box");
	var SY = parseInt10(yearBox.val());
	var SM = parseInt10(monthBox.val());
	drawCal(SY,SM);
}
