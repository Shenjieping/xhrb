$(function(){
	var url = $("#list li:first a").attr("href");
  var _href = window.location.href;
  if (~_href.indexOf('bigScreen')) {
    window.sessionStorage.setItem('advFlag', 'true');
  }
  window.location.href=url;
})
