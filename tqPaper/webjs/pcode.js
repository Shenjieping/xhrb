

$(function(){

    var html = '<div style="width:100%;clear:both;text-align:center;">[手机扫一扫]<div id="canvas" style="display:block;width:150px;height:150px;margin-right:auto;margin-left:auto;"></div><div style="text-align:center;"><a  data-clipboard-text="" class="list_copy_link" id="copy_btn" style="color:blue;">复制pc链接</a></div><div>';
    $(".Scrollbox").append(html);

    var src = $('.Ciframe').attr("src");

    var url = "";
    if(src){
        url = window.location.protocol +"//"+ window.location.hostname + "/pad/"+(src || "").replace("../../../", "");
    }
    else {
        url = (window.location.href||"").replace("pc", "pad");
    }

    $('#canvas').qrcode({width: 150, height: 150, text: url});

    window.onload = function() {
        var pc_url = src || location.href;
        $("#copy_btn").attr('data-clipboard-text',pc_url);

        var btn = document.getElementById('copy_btn');
        var clipboard = new ClipboardJS(btn);

        clipboard.on('success', function(e) {
            alert('复制成功！')
        });
    }
});



