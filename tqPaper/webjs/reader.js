/**
 * create by hudie on 2019/12/16
 *
 */
var _reader = {
	switch: true,//是否开启语音读报
	third_url: 'https://voice.xhby.net/api/?action=getAudioUrl',
	// appKey: '146a437e715681a2',
	appKey: '7b1debf122acc8cc',
	init: function(){
		var _that            = this,
		    articleIdPattern = /^.*?content_(\d{1,})\.html$/,
		    isSpecialPattern = /\/paperSpecial\//,
		    _article_id;
		if(_that.switch){
			//开启语音读报
			_that._href = window.location.href;
			_that.isSpecial = isSpecialPattern.test(_that._href);
			_article_id = _that._href.replace(articleIdPattern, '$1');
			_that.getUrl(_article_id);
		}
	},
	/**
	 * 获取音频地址
	 * @param sourceId
	 */
	getUrl: function(sourceId){
		if(!sourceId){
			return;
		}
		var _that = this,
		    _url  = _that.third_url + '&appKey=' + _that.appKey + '&sourceId=' + sourceId;
		$.ajax({
			type: 'get',
			url: _url,
			success: function(res){
				var url = res.aurl;
				url && _that.audioInit(url);
			},
			error: function(err){
				console.log('获取音频地址服务器请求出错!', err);
			}
		});
	},
	audioInit: function(url){
		var _that = this,
		    _html = '<i class="play-pause-btn play-icon" id="playPause"></i>' +
		    '   <audio id="audio" src="' + url + '">\n' +
		    '    <source src="" type="audio/mpeg">\n' +
		    '   </audio>\n' +
		    '  </div>\n' +
		    ' </div>';
		$('.Author').after(_html);
		_that.audio = document.getElementById('audio');
		_that.watchMusicState();
	},
	watchMusicState: function(){
		var _that = this,
		    audio = _that.audio;//获取音乐DOM节点
		//保持播放按钮与播放状态的统一性
		audio.addEventListener('playing', function(){	//播放状态Doing
			if(!_that.isAutoPlay){//这里因为会在音频加载的时候autoplay，会导致错乱，需要区分一下
				_that.pauseIcon();
			}
		});
		audio.addEventListener('pause', function(){ //暂停状态Doing
			if(!_that.isAutoPlay){
				_that.playIcon();
			}
		});
		audio.addEventListener('ended', function(){
			_that.playIcon();
		});
		$('.play-pause-btn').on({
			//某些手机系统的浏览器的click事件不能触发play事件，这里采用touchend进行兼容
			'touchend': function(e){
				playPause(e);
			},
			'click': function(e){
				playPause(e);
			}
		});
		function playPause(e){
			e.preventDefault();
			e.stopPropagation();
			if(audio.paused){
				_that.playAudio();
			}else{
				_that.pauseAudio();
			}
		}
	},
	/**
	 * 播放
	 */
	playAudio: function(){
		this.audio.play();
	},
	/**
	 * 暂停
	 */
	pauseAudio: function(){
		this.audio.pause();
	},
	pauseIcon: function(){
		$('#playPause').attr('class', 'pause-icon play-pause-btn');
	},
	playIcon: function(){
		$('#playPause').attr('class', 'play-icon play-pause-btn');
	},
};
(function(){
	_reader.init();
})();