//$(function(){
//	var uerName = doGetCookie('username_fouNder');
//	var userId = doGetCookie('uid_fouNder');
//	var siteID = $(".siteID").html();
//	if(uerName){
//		$(".userIcon").hide();
//		$(".userName").html(uerName).show();
//		$('.buyPaper').click(function(){
//			choiceOrder();
//		});
//		$(".activePaper").click(function(){
//			activateOrder();
//		})
//	}else{
//		var userId = doGetCookie('uid_fouNder');
//	    var paperName = $('.paperName').html();
//		$(".buyPaper").click(function(){
//			window.location.href = ''+ SSO_url +'/SSOv2/user/ssoLogin?code=szb&redirectUrl='+ userUrl +'sso/setCookie.html?&isAppType=app&anyUrl='+ userUrl +'amucsite/amuc/colfees/choiceOrderApp.html?siteID='+ siteID +''
//		});
//		$(".activePaper").click(function(){
//			window.location.href = ''+ SSO_url  +'/SSOv2/user/ssoLogin?code=szb&redirectUrl='+ userUrl +'sso/setCookie.html?&isAppType=app'
//		})
//		$(".userIcon").show();
//		$(".userName").hide();
//	}
//	function choiceOrder(){
//		window.location.href = ''+ userUrl +'amucsite/amuc/colfees/choiceOrderApp.html?siteID='+ siteID +'';
//	}
//	function activateOrder(){
//		window.location.href = ''+ userUrl +'amucsite/amuc/colfees/activateApp.html?ssoid='+ userId +'';
//	}
//	
//	
//	$(".personCenter").attr('href',''+ userUrl +'amucsite/amuc/ucmember/ucApp.html?uid=' + userId + '&userName=' + uerName +'');
//		
//	$(".userName").click(function(){
//		$(".personList").toggle();
//	})
//	$(".logo a").attr("href", ''+ SSO_url +'/SSOv2/user/ssoLogin?code=szb&redirectUrl='+ userUrl +'sso/setCookie.html?&isAppType=app&anyUrl='+ userUrl +'amucsite/amuc/colfees/choiceOrderApp.html?siteID='+ siteID +'')
//	
//})