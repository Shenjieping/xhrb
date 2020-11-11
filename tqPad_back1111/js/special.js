$(window).ready(function(){
    var specials = 'getPaperSpecials'; // 获取专题接口
    var specailIssues = 'getPaperSpecialIssues'; // 获取专题下面的期
    var paperId = $('.papger-id').text().trim(); // 报纸id
    var specialId = getQueryString('id'); // 专题id
    var specialName = getQueryString('name'); // 专题名称
    // 如果是专题显示期数，报纸显示往期
    if (checkSpecial()) {
        $('.bDate').text('期数');
    }
    // 获取专题，期数接口
    ajaxDate(specials, {id: paperId}, function(data) {
        var list = data.specials || [];
        if (!list || list.length === 0) {
            $('.special-box').hide();
            return;
        }
        specialList = list;
        for (var i = 0; i < list.length; i++) {
            var active = list[i].id == specialId ? 'act' : '';
            var params = '?id=' + list[i].id + '&name=' + list[i].name || '专题';
            // var params = '?id=' + list[i].id;
            $(".special-list").append('<li><a href="'+ list[i].pl_urlPad + params + '" class=' + active + '>'+ list[i].name +'</a></li>');
        }
        if (checkSpecial()) {
            var _href = location.href;
            var special = _href.match(/paperSpecial\/\d+/g)[0];
            if (!specialId && !specialName) {
                for (var i = 0; i < specialList.length; i++) {
                    var pl_url_h = specialList[i].pl_urlPad ? specialList[i].pl_urlPad.match(/paperSpecial\/\d+/g)[0] : '';
                    if (pl_url_h == special) {
                        location.href = _href + '?id=' + specialList[i].id + '&name=' + specialList[i].name;
                        return;
                    }
                }
            }
            ajaxDate(specailIssues, {id: specialId}, function(data) {
                var list = data.issues || [];
                if (!list || list.length === 0) {
                    return;
                }
                for (var i = 0; i < list.length; i++) {
                    var paramsList = '?id=' + specialId + '&name=' + specialName || '专题';
                    // var paramsList = '?id=' + specialId;
                    $(".stage-list").append('<li><a href="'+ list[i].pl_urlPad + paramsList +'">'+ list[i].name +'</a></li>');
                }
            });
        }
    });
    var chunkList = $('.sub-nav>div div');
    for (var c = 0; c < chunkList.length; c++) {
        if (specialId && specialName && specialId !== 'null' && specialId !== 'null') {
            var firstA = chunkList[c].children[0];
            var paramsList = '?id=' + specialId + '&name=' + specialName || '专题';
            // var paramsList = '?id=' + specialId;
            var href = firstA.getAttribute('href');
            firstA.setAttribute('href', href + paramsList);
        }
    }
});
// 获取参数，放回object
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return decodeURI(r[2]); return null;
}
// 判断是否为专题
function checkSpecial() {
    var _href = location.href;
    return ~_href.indexOf('paperSpecial');
}
// 获取数据接口
function ajaxDate(url, data, cb) {
    $.ajax({
        url: xyUrl + url,
        async: false,
        data: data,
        dataType : "json",
        type: 'GET',
        success: function(data) {
            cb(data);
        },
        error: function(err) {
            console.log('服务器请求出错!', err);
        }
    });
}