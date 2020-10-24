$(function() {
    var _href = window.location.href;
    var specialIfAcessUrl = "amuc/api/read/specialAccess";
    var ordinaryIfAccessUrl = "amuc/api/read/ifAccess";
    var pattern = [];
    var issueId = null;
    // var sso_url = "http://172.19.56.76:9080/SSOv2";		//sso地址
    window.currDomain = window.currDomain || {};
    var authCode = window.currDomain.domain || "szb";
    var login_out = 'http://' + window.location.host + '/';

    //弹出窗口位置
    var iWidth=976; //弹出窗口的宽度;
    var iHeight=635; //弹出窗口的高度;
    var iTop = (window.screen.availHeight-iHeight)/2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth-iWidth)/2; //获得窗口的水平位置;
    var window_site = "height=635, width=976,top="+iTop+",left="+iLeft+", toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no";

    if (~_href.indexOf('paperSpecial')) {
        pattern = /paperSpecial\/\d+/;
    } else {
        pattern = /[0-9]{6}\/[0-9]{2}/;
    }
    var curdate = _href.match(pattern);
    var startIndex = _href.lastIndexOf('_');
    var lastIndex = _href.lastIndexOf('.');
    var paperLayout = _href.slice(startIndex, lastIndex);
    // var paperLayout = $('.Author').html().split('：')[1];
    if (_href.indexOf('content_') > -1) {
        paperLayout = paperLayout.slice(1);
    }
    ifAccess();

    var newsMap = '';
    function ifAccess() {
        _ssoId = doGetCookie("mid_fouNder");
        var paperId = $(".papger-id").text().trim();
        var dataParams = {};
        if (~_href.indexOf('paperSpecial')) {
            // 专题
            issueId = curdate[0].split('/')[1];
            dataParams = {
                "uid": _ssoId,
                "siteID": siteID,
                "issueId": issueId,
                "paperLayout": paperLayout,
                "paperId": paperId
            }
            checkPower(specialIfAcessUrl, dataParams);
        }
        else {
            dataParams = {
                "uid": _ssoId,
                "siteID": siteID,
                "curdate": curdate[0],
                "paperLayout": paperLayout,
                "paperId": paperId
            }
            checkPower(ordinaryIfAccessUrl, dataParams);
        }
    }

    function checkPower(url, data, cb) {
        _userId = doGetCookie("username_fouNder");
        jQuery.support.cors = true;
        $.ajax({
            type: "get",
            url: xyUrl + url,
            async: true,
            data: data,
            success: function(datas) {
                var datas = JSON.parse(datas);
                if (datas == false || datas == 'false') {
                    $('.newsdetatext').html('请购买该报纸后再访问');
                    $('.tipMsg').show();
                    clickDialog();
                } else {
                    $('.tipMsg').hide();
                }
            },
            error: function(a, b, c) {
                console.log(a, b, c)
            }
        });
    }
    function clickDialog() {
        var _ssoId2 = doGetCookie("uid_fouNder");
        var _userId = doGetCookie("username_fouNder");
        if (_userId==undefined|| _userId =="undefined" || _userId=="" || _userId == null) {
            $('.pay-btn').hide();
            $('.active-btn').hide();
            $('.login-btn').show();
        }
        else {
            $('.pay-btn').show();
            $('.active-btn').show();
            $('.login-btn').hide();
        }
        $('.pay-btn').click(function() {
            window.location.href = 'http://' + window.location.host + '/amucsite/amuc/pcColfees/putOrder.html?siteID=' + siteID + "&curdate=" + curdate + "&paperLayout=" + paperLayout
        });
        $('.active-btn').click(function() {
            window.location.href = "http://" + window.location.host + "/amucsite/amuc/ucmember/ucSite.html?uid="+_ssoId2+"&username="+_userId + "&siteID=" + siteID + "&curdate="+ curdate + "&paperLayout=" + paperLayout + "&selected=1";
        });
        $('.login-btn').click(function() {
            window.open(SSO_url + "/user/ssoLogin?siteId=" + siteID +"&code=" + authCode + "&redirectUrl=" + login_out + "sso/setCookie.html?", "newwindow", window_site);
        })
    }
    var _ssoId = doGetCookie("uid_fouNder");
    if (!_ssoId) {
        window.setInterval("isLogin()",500);
    }
});
function isLogin(){
    var _userId = doGetCookie("username_fouNder");
    //如果cookie中同时不包含这些，说明cookie中无用户信息，没登录
	if(_userId==undefined|| _userId =="undefined"  || _userId=="" || _userId == null){
	}else{
        window.location.reload();
    }
}

function doGetCookie(cookie_name){
    var allcookies = document.cookie;
    //索引长度，开始索引的位置
    var cookie_pos = allcookies.indexOf(cookie_name);
    // 如果找到了索引，就代表cookie存在,否则不存在
    if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可
        //计算取cookie值得开始索引，加的1为“=”
        cookie_pos = cookie_pos + cookie_name.length + 1; 
        //计算取cookie值得结束索引
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1) {
            cookie_end = allcookies.length;
        }
        //得到想要的cookie的值
        var value = unescape(allcookies.substring(cookie_pos, cookie_end)); 
    }
    return value;
}