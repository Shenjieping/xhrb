//IP地址
var login_out = 'http://' + window.location.host + '/';
window.currDomain = window.currDomain || {};
var authCode = window.currDomain.domain || "szb";

//弹出窗口位置
var iWidth=976; //弹出窗口的宽度;
var iHeight=635; //弹出窗口的高度;
var iTop = (window.screen.availHeight-iHeight)/2; //获得窗口的垂直位置;
var iLeft = (window.screen.availWidth-iWidth)/2; //获得窗口的水平位置;
var window_site = "height=635, width=976,top="+iTop+",left="+iLeft+", toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no";

//设置cookie
function setCookie(sName, sValue){
	if (sValue == "") sValue = "";
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
function delCookie(name){
    setCookie(name,"");
}

//每5毫秒自动检测一次用户是否登录（也就是检测cookie是否存在）
window.onload=function(){
    // isLogin();
    ifAccess();
    var _ssoId = doGetCookie("uid_fouNder");
    if (_ssoId) {
        setUser();
    } else {
        window.setInterval("isLogin()",500);
    }
}

//判断处理cookie
function isLogin(){
    var _userId = doGetCookie("username_fouNder");
	var _ssoId = doGetCookie("uid_fouNder");
    //如果cookie中同时不包含这些，说明cookie中无用户信息，没登录
	if(_userId==undefined|| _userId =="undefined"  || _userId=="" || _userId == null){
		$("#sso-active").show().css("display","inline-block");
        $("#sso-inactive").hide();
        $("#exit-active").hide();
        $("#buy-inactive").hide();
	}else{
        window.location.reload();
    }
}	
function setUser() {
    var _ssoId = doGetCookie("uid_fouNder");
    var _userId = doGetCookie("username_fouNder");
    var cookieValue=doGetCookie("username_fouNder");  //将用户名存在cookie中
    var _href = window.location.href;
    var paperLayout = _href.match(/node_\S*\d+/g)[0].replace('node', '');
    if (~_href.indexOf('paperSpecial')) {
        pattern = /paperSpecial\/\d/;
    } else {
        pattern = /[0-9]{6}\/[0-9]{2}/;
    }
    var curdate = _href.match(pattern);
    $("#sso-active").hide();
    $('.adv-bj').hide();
    $("#sso-inactive").show().css("display","inline-block");
    $("#exit-active").show().css("display","inline-block");
    $("#buy-inactive").show().css("display","inline-block");
    $("#uname #name-text").text(cookieValue);  //为用户名赋值
    $("#uname").attr("href","http://" + window.location.host + "/amucsite/amuc/ucmember/ucSite.html?code=" + authCode + "&uid="+_ssoId+"&username="+_userId + "&siteID=" + siteID + "&curdate="+ curdate + "&paperLayout=" + paperLayout);
    $("#buyBtn").attr("href", 'http://' + window.location.host + '/amucsite/amuc/pcColfees/putOrder.html?code=' + authCode + '&siteID=' + siteID + "&curdate=" + curdate + "&paperLayout=" + paperLayout);
}


//sso注册
function register(){
	window.open (SSO_url+"/user/register?siteId=" + siteID,"newwindow", window_site);
}

//sso登录
function ssologin(){
	window.open(SSO_url + "/user/ssoLogin?siteId=" + siteID +"&code=" + authCode + "&redirectUrl=" + login_out + "sso/setCookie.html?", "newwindow", window_site);
}

//sso退出。设置好的 cookie会自动失效，只需设置效果即可
function exit(){
    if (window.confirm('是否退出系统')) {
        window.open(SSO_url+"/user/ssoLogout?code=" + authCode + "&from="+login_out+"sso/delCookie.html","newwindow", window_site);
        $("#sso-active").hide();
        $("#sso-inactive").css("display","block");
        setTimeout(function() {
            window.location.reload();
        }, 800);
    }
}


