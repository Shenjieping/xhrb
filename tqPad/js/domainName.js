/**
 * create by hudie on 2019/12/4
 *
 */
window.currDomain = window.currDomain || {};
var _domain = {
	init: function(){
		this.config = window.CONFIG['domain'] || null;
		this.initFootLink();
	},
	initFootLink: function(){
		var _html = '',
		    currUrl = location.href,
		    _config = this.config,
		    _domain = 'szb',
		    _name = '新华日报',
		    _url;
		if(_config){
			for(var i in _config){
				var _item = _config[i];
				if(_config.hasOwnProperty(i)){
					_html += '<div class="area' + (window.currDomain.domain === i ? ' active' : '') + '"><a href="' + _item.url + '">' + _item.name + '</a></div>\n';
					if(currUrl.indexOf(_config[i].url) !== -1){
						_domain = i;
						_name = _config[i].name;
						_url = _config[i].url;
					}
				}
			}
		}
		window.currDomain.domain = _domain;
		window.currDomain.name = _name;
		window.currDomain.url = _url;
		$('#nowLayout').after(_html);
	},
	config: {}
};
(function(){
	_domain.init();
})();