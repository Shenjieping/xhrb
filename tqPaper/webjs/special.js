$(function() {
    var specialId = getQueryString('id'); // 专题id
    // var specialName = window.localStorage.getItem('specialName'); // 专题名字
    var specialName = getQueryString('name');
    var _href = location.href;
    var _pathname = location.pathname;
    window.currDomain = window.currDomain || {};
    var paperName = window.currDomain.name || '新华日报',
        paperUrl = window.currDomain.url || '/';
    var paperId = $('.papger-id').text().trim();
    var specialList = [];
    $('.special-title').html(specialName || '专题');
    // 根据报纸id, 请求专题列表
    ajaxDate('getPaperSpecials', {id: paperId}, function(data) {
        var list = data.specials || [];
        if (!list || list.length === 0) {
            $('.special-box').hide();
            return;
        }
        $('.special-box').show();
        specialList = list;
        for (var i = 0; i < list.length; i++) {
            var active = list[i].id == specialId ? 'act' : '';
            var params = '?id=' + list[i].id + '&name=' + list[i].name || '专题';
            // var params = '?id=' + list[i].id;
            $(".special-list").append('<li><a href="'+ list[i].pl_url + params + '" class=' + active + '>'+ list[i].name +'</a></li>');
        }
    });
    // 根据专题id，请求专题对应的期
    if (checkSpecial()) {
        var _href = location.href;
        var special = _href.match(/paperSpecial\/\d+/g)[0];
        if (!specialId && !specialName) {
            for (var i = 0; i < specialList.length; i++) {
                var pl_url_h = specialList[i].pl_url ? specialList[i].pl_url.match(/paperSpecial\/\d+/g)[0] : '';
                if (pl_url_h == special) {
                    location.href = _href + '?id=' + specialList[i].id + '&name=' + specialList[i].name;
                    return;
                }
            }
        }
        $('.special-box').css({'background-color': '#00a2ae', 'color': '#fff'});
        $('.news-title a').css({'background-color': '#fff', 'color': '#000'});
        ajaxDate('getPaperSpecialIssues', {id: specialId}, function(data) {
            var list = data.issues || [];
            if (!list || list.length === 0) {
                return;
            }
            for (var i = 0; i < list.length; i++) {
                var paramsList = '?id=' + specialId + '&name=' + specialName || '专题';
                // var paramsList = '?id=' + specialId;
                $(".Specialiconlist").append('<div><a href="'+ list[i].pl_url + paramsList +'">'+ list[i].name +'</a></div>');
            }
        });
    }
    $('#home-btn').attr('href', '/' + paperName + '/pc/layout/');
    $('#paper-name').attr('href', '/' + paperName + '/pc/layout/');
    $('#paper-name').text(paperName);

    // // 点击版面携带参数
    var chunkList = $('.Chunkiconlist p');
    for (var c = 0; c < chunkList.length; c++) {
        if (specialId && specialName && specialId !== 'null' && specialId !== 'null') {
            var firstA = chunkList[c].children[0];
            var paramsList = '?id=' + specialId + '&name=' + specialName || '专题';
            // var paramsList = '?id=' + specialId;
            var href = firstA.getAttribute('href');
            firstA.setAttribute('href', href + paramsList);
        }
    }
    // // 点击左右按钮，携带参数
    if (specialId && specialName && specialId !== 'null' && specialId !== 'null') {
        var next = $('.newsnextright a');
        var prve = $('.newsnextleft a');
        var paramsList = '?id=' + specialId + '&name=' + specialName || '专题';
        // var paramsList = '?id=' + specialId;
        next.attr('href', next.attr('href') + paramsList);
        prve.attr('href', prve.attr('href') + paramsList);
    }
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return decodeURI(r[2]); return null;
}
function checkSpecial() {
    var _href = location.href;
    return ~_href.indexOf('paperSpecial');
}

function ajaxDate(url, data, cb) {
    $.ajax({
        url: xyUrl + url,
        async: false,
        data: data,
        dataType : "json",
        // jsonp: "jsoncallback",
        type: 'GET',
        success: function(data) {
            cb(data);
        },
        error: function(err) {
            console.log('服务器请求出错!', err);
        }
    });
}