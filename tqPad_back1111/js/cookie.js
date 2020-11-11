//设置cookie
function setCookie(sName, sValue){
	if (sValue == "") sValue = "0";
	//cookie过期时间为关闭浏览器时就过期
	document.cookie = sName + "=" + escape(sValue) + ";path=/";
}
//获取cookie
function doGetCookie(strName){
	var theValue = null;
	var aCookie = document.cookie.split("; ");

	for (var i=0; i < aCookie.length; i++)
	{
		var aCrumb = aCookie[i].split("=");
		if (strName == aCrumb[0]) theValue = unescape(aCrumb[1]);
	}
	if (theValue == "0") theValue = "";
	return theValue;
}
//删除cookie
function delCookie(name)
{
    setCookie(name,"");
}

var _href = window.location.href;
var pattern = /[0-9]{6}\/[0-9]{2}/;
var curdate = _href.match(pattern);
//var paperLayout = _href.substr(-7,2);
var startIndex = _href.lastIndexOf('_');
var lastIndex = _href.lastIndexOf('.');
var paperLayout =  _href.slice(startIndex+1,lastIndex);


setCookie("curdate",curdate);
setCookie("paperLayout",paperLayout);