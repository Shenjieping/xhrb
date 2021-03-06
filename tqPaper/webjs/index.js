$(function(){
    var arr = [];
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    $(".newslist li a").click(function(){
        var _this = $(this)
        var src = "";
        var hasClick = _this.attr("data-click");
        if (!hasClick || hasClick == 'false') {
            src = _this.attr("href");
            _this.attr("href", "javascript:void(0)");
            if (src == "#" || src == "javascript:void(0)") {
                _this.attr("data-click","false");
                $(".newsreturn").hide();
            } else {
                _this.attr("data-click", "true");
                $(".newsconrightcontent").toggle();
                $(".newslist ul li").hide();
                $(".newsreturn").show();
                $(".Ciframe").attr("src", src);
                _this.attr("href", src);
            }
        } else {
            // src = _this.attr("data-href");
            src = _this.attr("href");
            $(".newsconrightcontent").toggle();
            $(".newslist ul li").hide();
            $(".newsreturn").show();
            $(".Ciframe").attr("src",src);
            _this.attr("href", src);
        }
        return false;
    });

    $(".newsreturn").click(function(){
        $('iframe[name="tqb"]').attr('src', '');//清除地址，以防返回退出的时候，语音播报不停止
        $(".articleContent").toggle();
        $(".newsconright").css("padding","40px 0 19px 19px");
        $(".newslist ul li").show();
        $(this).hide();
        $(".newsconrightcontent").hide();
    })

    $("area").click(function(){
        $(".newsreturn").show();
        var _this=$(this)
        var src="";
        var hasClick=_this.attr("data-click");
        if(!hasClick){
            src = _this.attr("href");
            _this.attr("href","javascript:void(0)");
            _this.attr("data-click","true");
            _this.attr("data-href",src);

        }else{
            src = _this.attr("data-href");
        }

        $(".newsconrightcontent").show();
        $(".Ciframe").attr("src",src);

    })

    var _url = window.location.href;
    var start = _url.indexOf('node_');
    var pLayout =  _url.substr(start+5,3);
    //console.log(pLayout);
    $(".Therestlist li").each(function(){
        var word = $(this).find(".layoutNum").html();
        if(word == pLayout){
            $(this).addClass('cur').siblings().removeClass('cur');
        }
    })

    var $TherestlistUl_p=$(".Therestlist ul");
    var TherestlistLen=$TherestlistUl_p.find("li").length;
    var TherestlistSelectedIndex=$(".Therestlist ul li.cur").index();
    if((TherestlistLen - TherestlistSelectedIndex) < 7){
        $TherestlistUl_p.css("marginLeft","-"+(153*(TherestlistLen - 7))+"px");
    }else{
        $TherestlistUl_p.css("marginLeft","-"+(153*TherestlistSelectedIndex)+"px");
    }
    $(window).load(function(){
        setTimeout(function(){
            setTherestlistSelectedIndex(TherestlistSelectedIndex);
        },500);
        });
})