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

function parseInt10(num){
	return parseInt(num,10);
}

//日历框架
function tdlist(){
	for(var i= 0;i<6;i++){
		document.write('<tr height="20px" cellspacing="0">');
		for(var j=0;j<7;j++){
			var num = i*7+j;
			document.write('<td bgcolor="#fafafa" cellspacing="0" height="20px" class="default" style="cursor:default;" align=center><a href="#" id=AD'+num+'><span class="date" style="font-size:12px;" id=SD'+num+'></span></a></td>');
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
	date = r[2];
    var newData = r[1];
	return newData;
 }
 
 //构建日历
 function drawCal(y,m){
	var adArray = new Array();
	var sdArray = new Array();
	for(var i=0;i<42;i++){
		adArray[i] = $("#AD"+i);
		sdArray[i] = $("#SD"+i);
		adArray[i].attr("href","#");//将链接地址置空
		sdArray[i].text("");//清空日期table
		sdArray[i].removeClass("active");
		sdArray[i].css("display","inline");
	}
	var startDate = new Date(parseInt10(y),parseInt10(m)-1,1);//输入月份的第一天
	var endDate = new Date(parseInt10(y),parseInt10(m),0);//输入月份的最后一天
	var startIndex = startDate.getDay();
	var endIndex = endDate.getDate();
	//填充日历
	for(var i = 1;i<=endIndex;i++){
		var index = startIndex + i-1;
		sdArray[index].text(i);
		sdArray[index].css({
			"color":"#333",
			"cursor":"default",
			"display":"block",
			"background-color":"#fff",
			});

	}
	var dateStr = y+"-"+appendZero(m);
	
	//获取xml数据
	$.get("../../../layout/"+y+appendZero(m)+"/period.xml", function(xmlData){
		if(xmlData==null || xmlData==undefined) return;
		  $(xmlData).find("period").each(function(){
			  	var dateOld = $(this).find("period_date").text();
				var dateNew = dateOld.replace(/-/g, '/');
				var time = new Date(dateNew);
				var SY = time.getFullYear();
				var SM = time.getMonth()+1;
				var SD = time.getDate();
				var year=$("#year_box").val();
				var month = $("#month_box").val();
				if(SY==year && SM==month){
					var url = getPreUrlByDate(SY,SM,SD);
					var front_page = $(this).find("front_page").text();
					url += front_page;
					var id = startIndex+parseInt10(SD)-1;
					adArray[id].attr("href",url);
					sdArray[id].css({
						"background-color":"#96c319",
						"cursor":"pointer",
						"display":"block",
						"color":"#fff"
					});
					sdArray[id].addClass("active");
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


