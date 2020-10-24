
$(function(){
	index();
	BindPreNextPeriod();
	day();
	pdf();
})

function index(){
	var url="../../../layout/"+"index.html";
	$("#index").attr("href",url);
}

function day(){
	var paperdate = $('#paperdate').text();
	paperdate = paperdate.replace(/[^0-9]/mg,'-').match(/.{10}/);
	var nowDate =  new Date(paperdate);
	var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	var week = weekArray[nowDate.getDay()];
	$("#week").html(week);
}

function BindPreNextPeriod(){
	var paperdate = $('#paperdate').text();
	paperdate = paperdate.replace(/[^0-9]/mg,'-').match(/.{10}/);
	var nowDate =  new Date(paperdate);
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth()+1;
	var day = nowDate.getDate();
	var prev = "";
	var next ="";
	var prevfront="";
	var nextfront="";
	$.ajax({
		url: "../../../layout/"+year+appendZero(month)+"/period.xml",		
		async : false,
		success: function(xmlData){
		if(xmlData==null || xmlData=="") return;
		for(var i=day-1;i>0;i--){
			var pDate = $(xmlData).find("period[id='"+i+"']").find('period_date').text();
			if(pDate.length != 0){
				prev = pDate;
				prevfront = $(xmlData).find("period[id='"+i+"']").find('front_page').text();
				break;
			}
		}
		
		for(var i=day+1;i<=31;i++){
			var nDate = $(xmlData).find("period[id='"+i+"']").find('period_date').text();
			if(nDate.length != 0){
				next = nDate;
				nextfront = $(xmlData).find("period[id='"+i+"']").find('front_page').text();
				break;
			}
		}			
		}		
		});
    prevDate = new Date(prev);
    nextDate = new Date(next);
	for(var k =1;k<3;k++){
	if (isNaN(prevDate.getDate())){	
		$.ajax({
		url: "../../../layout/"+year+appendZero(month-k)+"/period.xml",		
		async : false,
		success: function(xmlData){
		if(xmlData==null || xmlData=="") return;
		for(var i=31;i>0;i--){
			var pDate = $(xmlData).find("period[id='"+i+"']").find('period_date').text();
			if(pDate.length != 0){
				prev = pDate;
				prevfront = $(xmlData).find("period[id='"+i+"']").find('front_page').text()
				prevDate = new Date(prev);
				break;
			}
		}	
		}		
		});	
	}
	}
	
	for(var k =1;k<3;k++){
	if (isNaN(nextDate.getDate())){
		$.ajax({
		url: "../../../layout/"+year+appendZero(month+k)+"/period.xml",		
		async : false,
		success: function(xmlData){
		if(xmlData==null || xmlData=="") return;
		for(var i=1;i<=31;i++){
			var pDate = $(xmlData).find("period[id='"+i+"']").find('period_date').text();
			if(pDate.length != 0){
				next = pDate;
				nextfront = $(xmlData).find("period[id='"+i+"']").find('front_page').text()
				nextDate = new Date(next);
				break;
			}
		}	
		}		
		});	
	}
	}
	
	if(isNaN(prevDate.getDate())){
		$('#goPrePeriod').hide();
	}
	
	if(isNaN(nextDate.getDate())){
		$('#goNextPeriod').hide();
	}
	
	
    $('#goPrePeriod').on('click',function(e){
        goDistPeriodByDate(prevDate,prevfront);
    });
    $('#goNextPeriod').on('click',function(e){
        goDistPeriodByDate(nextDate,nextfront);
    });
}


function goDistPeriodByDate(distdate,front){

	
    window.location.href="../../../layout/"+distdate.getFullYear()+appendZero(distdate.getMonth()+1)+'/'+appendZero(distdate.getDate())+'/'+front;
}
 

function appendZero(num){
	var n = parseInt(num,10);
	if(n<10){
		return "0"+n;
	}
	return n;
}

function pdf(){
	pdfUrl =  $('#pdfUrl').text();
	layout = $('#layout').text();
	$('#layoutlist li a').each(function(){ 
		if($(this).text()==layout){
			$(this).html(layout+'<a href="'+pdfUrl+'" download><img class="pdf posAbsolute" src="../../../../js/images/09.png" class="pull-right"></a>');
		}
		});
}

function zoomIn() {
	if(ozoom.style.zoom){
		newZoom= parseInt(ozoom.style.zoom)+10+'%'
		ozoom.style.zoom =newZoom;
	}else{
		var zoom = $("#ozoom");
		var size =  parseInt(zoom.css("font-size"));
		zoom.css("font-size",size+1+"px");
	}
  
  } 
function zoomOut() {
  if(ozoom.style.zoom){
	  newZoom= parseInt(ozoom.style.zoom)-10+'%'
      ozoom.style.zoom =newZoom;
  }else{
		var zoom = $("#ozoom");
		var size =  parseInt(zoom.css("font-size"));
		zoom.css("font-size",size-1+"px");
	}
}

function zoomDe() {
  if(ozoom.style.zoom){
	 ozoom.style.zoom='100%';
  }else{
		var zoom = $("#ozoom");
		zoom.css("font-size","14px");
	}
}
  
 $(function () {
	$("#articlelist li").each(function(){ 
		if($(this).find("a").text()==""){
			$(this).find("a").text("无题");
			var $li = $(this).remove();
			$li.appendTo($("#articlelist")); 
		}
		});
});

//提交表单
function per_submit()
{
  var flag = true;
  
 // alert("content="+form1.contentKey.value);
  if(form1.contentKey.value==""){
  	return;
  }
  if( flag == true ) 
  {
  	document.form1.submit(); 
  } 
}

//加入收藏
 
        function AddFavorite(sURL, sTitle) {
 
            sURL = encodeURI(sURL); 
        try{   
 
            window.external.addFavorite(sURL, sTitle);   
 
        }catch(e) {   
 
            try{   
 
                window.sidebar.addPanel(sTitle, sURL, "");   
 
            }catch (e) {   
 
                alert("加入收藏失败，请使用Ctrl+D进行添加,或手动在浏览器里进行设置.");
 
            }   
 
        }
 
    }