/* cookie鍏煎灏佽*/ ;
(function (factory) {
    var registeredInModuleLoader = false;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init(converter) {
        function api(key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                // We're using "expires" because "max-age" is not supported by IE
                attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                var stringifiedAttributes = '';

                for (var attributeName in attributes) {
                    if (!attributes[attributeName]) {
                        continue;
                    }
                    stringifiedAttributes += '; ' + attributeName;
                    if (attributes[attributeName] === true) {
                        continue;
                    }
                    stringifiedAttributes += '=' + attributes[attributeName];
                }
                return (document.cookie = key + '=' + value + stringifiedAttributes);
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    var name = parts[0].replace(rdecode, decodeURIComponent);
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                    cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api.call(api, key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));

//棣栭〉瑙ｅ喅鏂规

$(function(){
    var chunkList = $('.Chunkiconlist p');
    var _href = location.href;
    var node = _href.substring(_href.lastIndexOf('/') + 1);
    node = decodeURIComponent(node);
    if (chunkList[0] && node) {
        setTimeout(function() {
            var first = chunkList[0].children[0].getAttribute('href');
            var last = chunkList[chunkList.length - 1].children[0].getAttribute('href');
            if (node === first) {
                $('.newsnextleft').hide();
            }
            if (node === last) {
                $('.newsnextright').hide();
            }
        }, 50)
    }
    this_input();
    //input澶卞幓鐒︾偣
    function this_input(){
        $("[_placeholder]").each(function(){
            var t_input=$(this);
            var val_input=t_input.val();
            t_input.bind({
                focus: function(){
                    var _this=$(this);
                    if(_this.val()==val_input){
                        _this.val("");
                    }
                },
                blur:function(){
                    var _this=$(this);
                    if(_this.val()==""){
                        _this.val(val_input);
                    }
                }
            });

        })

    }

    //缁煎悎椤�

    $('.SynthesizeUp ul li').hover(function(){
        $(this).addClass('cur');
    },function(){
        $(this).removeClass('cur')
    })


    //鍒楄〃椤�
//	$('.Therestlist ul li').hover(function(){
//		$(this).addClass('curshow');
//	},function(){
//		$(this).removeClass('curshow')
//	})
    var specialId = checkSpecial();
    if (specialId) {
        $('.oneclick2').hide();
        $('.oneclick5').show();
    }
    else {
        $('.oneclick2').show();
        $('.oneclick5').hide();
    }

    $('.newsside ul li.oneclick1').click(function(e) {
        if($(this).find('.Chunkiconbox').is(':visible')){
            $(this).find('.Chunkiconbox').hide();
        }else{
            $(this).find('.Chunkiconbox').show();
            $('#Sharelist').hide();
            $('.Phonecode').hide();
            $('.special-stage-list').hide();
        }
        if($(".time-control").is(':visible')){
            $(".time-control").hide();
        }

    });
    $('#startDate').click(function(e) {
        $('.Chunkiconbox').hide();
        $('#Sharelist').hide();
        $('.Phonecode').hide();
        $(".time-control").toggle();

    });
    // $('.newsside ul li.oneclick3').hide();
    $('.newsside ul li.oneclick3').click(function(e) {
        if($(this).find('#Sharelist').is(':visible')){
            $(this).find('#Sharelist').hide();
        }else{
            $(this).find('#Sharelist').show();
            $('.Chunkiconbox').hide();
            $('.Phonecode').hide();
            $('.special-stage-list').hide();
        }
        if($(".time-control").is(':visible')){
            $(".time-control").hide();
        }

    });

    $('.newsside ul li.oneclick4').click(function(e) {
        if($(this).find('.Phonecode').is(':visible')){
            $(this).find('.Phonecode').hide();
        }else{
            $(this).find('.Phonecode').show();
            $('.Chunkiconbox').hide();
            $('#Sharelist').hide();
            $('.special-stage-list').hide();
        }
        if($(".time-control").is(':visible')){
            $(".time-control").hide();
        }

    });
    $('.newsside ul li.oneclick5').click(function(e) {
        if($(this).find('.special-stage-list').is(':visible')){
            $(this).find('.special-stage-list').hide();
        }else{
            $(this).find('.special-stage-list').show();
            $('.Chunkiconbox').hide();
            $('#Sharelist').hide();
        }
        if($(".time-control").is(':visible')){
            $(".time-control").hide();
        }

    });

    /*$(document).click(function(e) {
     if($('.Chunkiconbox').is(':visible')){
     alert(0)
     $('.Chunkiconbox').hide()
     }

     });*/

})

//棣栭〉鍚堜綔浼欎即
function clickHonce(leftBtn, rightBtn, btnsPrent, num, i) {
    var lenLi = $(btnsPrent).find("ul li").length;
    var distance = $(btnsPrent).find("ul li").innerWidth() +
        parseFloat($(btnsPrent).find("ul li").css("margin-right")) +
        parseFloat($(btnsPrent).find("ul li").css("border-left-width")) +
        parseFloat($(btnsPrent).find("ul li").css("border-right-width"));

    $(btnsPrent).find("ul").css("width", distance * lenLi);
    var i = i == null ? 0 : i;
    var midnum = num % 2 ? (num + 1) / 2 : num / 2; // 4
    var leftskew = 0;

    // 澶т簬涓€灞忥紝鏄剧ず涓棿锛屾渶鍚庝笉瓒充竴灞忥紝
    if (i >= midnum && i < lenLi - midnum) {
        leftskew = (midnum - i - 1) * distance; // 澶氬噺1
    } else if (i >= lenLi - midnum) { // 闃堝€�
        leftskew = (num - lenLi) * distance;
    }
    $(btnsPrent).find("ul").css('marginLeft', leftskew);
    // 淇i鍊�
    i = i < lenLi - num ? i : lenLi - num;
    //添加闭包外部访问函数
    window.setTherestlistSelectedIndex=function(index){
        i=index;
    }
    $(leftBtn).click(function () {
        if (lenLi > num) {
            if (!$(this).parents(btnsPrent).find("ul").is(":animated")) {
                if (i > 0) {
                    i--;
                } else {
                    i = 0;
                }
                $(this).parents(btnsPrent).find("ul").animate({
                    "margin-left": -distance * i
                }, 500);
            }
        }
    })
    $(rightBtn).click(function () {
        if (lenLi > num) {
            if (!$(this).parents(btnsPrent).find("ul").is(":animated")) {
                if (i < lenLi - num) {
                    i++;
                } else {
                    i = lenLi - num;
                }
                $(this).parents(btnsPrent).find("ul").animate({
                    "margin-left": -distance * i
                }, 500);
            }
        }
    })
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function checkSpecial() {
    var _href = location.href;
    return ~_href.indexOf('paperSpecial');
}
//棣栭〉鍚堜綔浼欎即璋冪敤

// Load ,绋嬪簭娣诲姞cur锛屽湪 ready涔嬪悗
$(window).on('load',function(){
    // 浼樺厛浣跨敤 绋嬪簭娣诲姞鐨勫綋鍓嶇姸鎬�
    Cookies.set('botindex',$('.Therestlist ul li.cur').index());

    var _botindex = parseInt(Cookies.get('botindex'));
    var _slideindex = 0;
    if (_botindex) {
        _slideindex = _botindex;
        $('.Therestlist ul li').eq(_botindex).addClass('cur').siblings().removeClass('cur');
    }

    clickHonce(".restleft", ".restright", ".Therestcon", 7, _slideindex);

    $('.Therestlist ul li').click(function () {
        Cookies.set('botindex', $(this).index());
        $(this).addClass('cur').siblings().removeClass('cur');
    });

})