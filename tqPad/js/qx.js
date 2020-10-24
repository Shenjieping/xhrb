$(window).ready(function(){
    var _ssoId;
    var freePaperName;
    var paidPaperName;
    var _userId;
    var scannext = false;
    var _href = window.location.href;
    var specialIfAcessUrl = "amuc/api/read/specialAccess"; // 专题权限判断接口
    var ordinaryIfAccessUrl = "amuc/api/read/ifAccess"; // 普通报纸权限判断接口
    var pattern = null;
    var issueId = null;
    if (~_href.indexOf('paperSpecial')) {
        pattern = /paperSpecial\/\d+/;
    } else {
        pattern = /[0-9]{6}\/[0-9]{2}/;
    }
    var curdate = _href.match(pattern);
    var startIndex = _href.lastIndexOf('_');
    var lastIndex = _href.lastIndexOf('.');
    var paperLayout = _href.slice(startIndex, lastIndex);
    // 如果是详情页则不需要传 _
    if (checkContent()) {
        paperLayout = _href.slice(startIndex + 1, lastIndex);
    }

    var paperName = $('.paperName').html();
    var area = $('#J_nav .frame').find('.area');
    for (var i = 0; i < area.length; i++) {
        area[i].setAttribute('class', 'area')
        if (area[i].children[0].innerText === paperName) {
            area[i].setAttribute('class', 'area active');
        }
    }
    _userId = doGetCookie("username_fouNder");

    // 判断是否登录, 不用显示登录弹框
    // if(_userId == undefined|| _userId == "undefined"  || _userId == "" || _userId == null) {
    //     $('.no-login').show();
    //     $('body').css('overflow', 'hidden');
    // } else {
    // }
    ifAccess();
    // 权限控制
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
            // 专题权限判断
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
            // 普通报纸权限判断
            checkPower(ordinaryIfAccessUrl, dataParams);
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
                    $('.no-auth').show();
                    if (checkContent()) {
                        $("#content").html('本期报纸需要付费才能阅读，请您去网站购买');
                    } else {
                        // $(".catalog").toggle();
                        $('#catalog').on('click', 'a', function () {
                            $('.no-auth').css('z-index', '100001');
                            $('.close-noauth').show();
                            return false;
                        });
                        $('.close-noauth').on('click', function() {
                            $('.no-auth').css('z-index', '1');
                            $('.close-noauth').hide();
                        })
                    }
                } else {
                    console.log('有权限');
                }
            },
            error: function(a, b, c) {
                console.log(a, b, c)
            }
        });
    }
    // 判断是否是文章详情页
    function checkContent() {
        return !!~_href.indexOf('content_');
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
});
