    //二维码生成begin
        $(document).ready(function () {
            $('.Phone').click(function () {
                var url = window.location.href;
                var padUrl = url.replace('pc', 'pad');
                // $.getScript("/tqPaper/webjs/jquery.qrcode.min.js", function () {
                    $(".Phonecode").html("");
                    $(".Phonecode").qrcode({ render: "canvas", width: 200, height: 200, text: padUrl });
                // });
            });
        });
    //二维码生成end
    
    //PC自动跳转手机页start
    var Mobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (Mobile.Android() || Mobile.BlackBerry() || Mobile.iOS() || Mobile.Opera() || Mobile.Windows());
        }
    };

    if(window.location.href.indexOf("gomobile=false")<0){
        if (Mobile.any())
        {
            //跳转到首页
            window.location.href= (window.location.href||"").replace("pc","pad");
        }
    }
    //PC自动跳转手机页end
    