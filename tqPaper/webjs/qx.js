var _ssoId;
var freePaperName;
var paidPaperName;
var _userId;
var scannext = false;
var _href = window.location.href;
var specialIfAcessUrl = "amuc/api/read/specialAccess";
var ordinaryIfAccessUrl = "amuc/api/read/ifAccess";
var pattern = [];
var issueId = null;
if (~_href.indexOf('paperSpecial')) {
    pattern = /paperSpecial\/\d+/;
} else {
    pattern = /[0-9]{6}\/[0-9]{2}/;
}
if (~_href.indexOf('bigScreen')) {
  window.sessionStorage.setItem('advFlag', 'true');
}
var curdate = _href.match(pattern);
var startIndex = _href.lastIndexOf('_');
var lastIndex = _href.lastIndexOf('.');
var paperLayout = _href.slice(startIndex, lastIndex);
var apply = {
    init: function() {
        _userId = doGetCookie("username_fouNder");
        var userName = encodeURI(encodeURI(_userId));
        _ssoId = doGetCookie("uid_fouNder");
        apply.setCookie("curdate", curdate);
        apply.setCookie("paperLayout", paperLayout);
        if (~_href.indexOf('?')) {
            apply.setCookie("skipHref", _href.split('?')[0] + '?' + encodeURI(_href.split('?')[1]));
        }
        else {
            apply.setCookie("skipHref", _href);
        }
    },
    setCookie: function(sName, sValue) {
        if (sValue == "") sValue = "";
        //cookie过期时间为关闭浏览器时就过期
        document.cookie = sName + "=" + (sValue) + ";path=/";
    }
}

var newsMap = '';
// 权限校验
function ifAccess() {
    checkAdv()
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
        // 普通报纸
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
// 广告弹框 10s后自动关闭
function checkAdv() {
    var t = 10;
    var timerAdv = null;
    // 将弹框的行为存入session中
    var storage = window.sessionStorage;
    var advFlag = storage.getItem('advFlag');
    // 如果没有登录则显示弹框
    if ((_userId==undefined|| _userId =="undefined" || _userId=="" || _userId == null) && !advFlag) {
        $(".adv-bj").show();
    }
    timerAdv = setInterval(function() {
        t -= 1;
        $('#time').html(t < 10 ? '0' + t : t);
        if (t <= 0) {
            clearInterval(timerAdv);
            storage.setItem('advFlag', 'true');
            $(".adv-bj").hide();
        }
    }, 1000);
    // 点击关闭按钮
    $('#close').on('click', function() {
        clearInterval(timerAdv);
        $(".adv-bj").hide();
        storage.setItem('advFlag', 'true');
    });
}

var timer = null;
function getUserId() {
    _userId = doGetCookie("username_fouNder");
    $('.tipMsg').show();
    // 如果没有权限，未登录显示登录按钮，已经登录显示购买按钮
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
}

function checkPower(url, data, cb) {
    jQuery.support.cors = true;
    $.ajax({
        type: "get",
        url: xyUrl + url,
        async: true,
        data: data,
        success: function(datas) {
            var datas = JSON.parse(datas);
            if (datas == false || datas == 'false') {
                newsMap = $('.newsconimg map').remove();
                $('.newslist h3 a').attr('href', function(index, oldvalue) {
                    $(this).attr('data-a', oldvalue);
                    return '#';
                });
                timer = setInterval(getUserId, 500);
                $(".newsnextright a").click(function() {
                    $(this).attr('href', 'javascript:void(0)');
                });
                $(".newsnextleft a").click(function() {
                    $(this).attr('href', 'javascript:void(0)');
                });
                $('.newsside ul li.oneclick3 div').attr('id', '')
                $('.newsside ul li.oneclick3 div').css('display', 'none')
                apply.init();
                clickDialog();
            } else {
                apply.init();
                $('.tipMsg').hide();
                // clearInterval(timer);
            }
        },
        error: function(a, b, c) {
            console.log(a, b, c)
        }
    });
}
function clickDialog() {
    var _ssoId = doGetCookie("uid_fouNder");
    $('.pay-btn').click(function() {
        window.location.href = 'http://' + window.location.host + '/amucsite/amuc/pcColfees/putOrder.html?siteID=' + siteID + "&curdate=" + curdate + "&paperLayout=" + paperLayout
    });
    $('.active-btn').click(function() {
        window.location.href = "http://" + window.location.host + "/amucsite/amuc/ucmember/ucSite.html?uid="+_ssoId+"&username="+_userId + "&siteID=" + siteID + "&curdate="+ curdate + "&paperLayout=" + paperLayout + "&selected=1";
    })
}

function isShowHide() {
    var _ssoId = doGetCookie("mid_fouNder");
    if (!_ssoId) {
        $('.buyBtn, .activBtn').hide();
        $('.btnssoActive').show();
    } else {
        $('.btnssoActive').hide();
        $('.buyBtn, .activBtn').show();
    }
}
