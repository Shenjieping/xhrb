/**
 * create by hd on 2019/10/23
 * 语音读报
 */
var _reader = {
	switch: true,//是否开启语音读报
	base_url: 'http://172.19.56.76:8090/app_if/',//环境切换时请修改该地址
	third_url: 'https://voice.xhby.net/api/?action=getAudioUrl',
	appKey: '7b1debf122acc8cc',
	speed: 5,//快进倒退的秒数
	sourceId: 0,
	currIndex: '',//上一篇下一篇，index
	_href: '',
	articleList: [],
	isSpecial: false,//是否是专题
	audio: null,
	audioCanPlay: false,
	isAutoPlay: true,
	init: function(){
		var _that = this,
		    datePattern = /^.*?([0-9]{6})\/([0-9]{2}).*?$/,
		    articleIdPattern = /^.*?content_(\d{1,})\.html$/,
		    isSpecialPattern = /\/paperSpecial\//,
		    paperId = $('.papger-id').text().trim(),
		    _date, _article_id;
		if(_that.switch){
			//开启语音读报
			_that._href = window.location.href;
			_that.isSpecial = isSpecialPattern.test(_that._href);
			_article_id = _that._href.replace(articleIdPattern, '$1');
			_that.getUrl(_article_id);
			//区分专题：专题内的稿件不做连续读报功能，仅支持单篇稿件读报即可，将上一篇和下一篇按钮置灰，不可点击。
			if(!_that.isSpecial){
				_date = _that._href.replace(datePattern, '$1$2');
				_that.getArticleList(paperId, _date, _article_id);
			}
			_that.audioInit();
		}else{
			$('body').show();
		}
	},
	/**
	 * 获取稿件列表，以便访问上一篇下一篇
	 * @param paperId
	 * @param date
	 * @param id
	 */
	getArticleList: function(paperId, date, id){
		var _that = this,
		    _url = _that.base_url + 'getArticlesByDate?paperId=' + paperId + '&siteID=' + siteID + '&date=' + date;
		$.ajax({
			type: 'get',
			url: _url,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			success: function(res) {
				if(res && res instanceof Array && res.length){
					_that.articleList = res;
					for(var i = 0; i < res.length; i++){
						if(res[i].fileId == id){
							_that.currIndex = i;
							break;
						}
					}
					_that.getAudioBtnStatus();
				}
			},
			error: function(err) {
				console.log('服务器请求出错!', err);
			}
		})
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
		    _url = _that.third_url + '&appKey=' + _that.appKey + '&sourceId=' + sourceId;
		$.ajax({
			type: 'get',
			url: _url,
			success: function(res) {
				_that.audioPlayInit(res);
			},
			error: function(err) {
				console.log('获取音频地址服务器请求出错!', err);
			}
		});
		setTimeout(function(){
			$('body').show();
		},1000)
	},
	audioInit: function(){
		var _that = this,
		    _html = '<div class="frame" id="audioPlayer">\n' +
		'  <div class="audio audio-player">\n' +
		'   <div class="controls"><span id="currentTime" class="current-time">0:00</span>\n' +
		'    <div class="slider" data-direction="horizontal">\n' +
		'     <div class="progress">\n' +
		'      <div class="pin" id="progress-pin" data-method="rewind"></div>\n' +
		'     </div>\n' +
		'    </div>\n' +
		'    <span class="total-time" id="audio_length_total"></span></div>\n' +
		'   <div class="btn-group">\n' +
		'    <div class="last-btn gray"><span class="basic-s-icon last-icon" id="last"></span></div>\n' +
		'    <div class="backward-btn"><span class="basic-s-icon backward-icon" id="backward"></span></div>\n' +
		'    <div class="play-pause-btn"><span class="basic-s-icon loading-icon" id="playPause"></span></div>\n' +
		'    <div class="forward-btn"><span class="basic-s-icon forward-icon" id="forward"></span></div>\n' +
		'    <div class="next-btn gray"><span class="basic-s-icon next-icon" id="next"></span></div>\n' +
		'   </div>\n' +
		'   <audio id="audio" src="" autoplay>\n' +
		'    <source src="" type="audio/mpeg">\n' +
		'   </audio>\n' +
		'  </div>\n' +
		' </div>';
		$('#content').before(_html);
		_that.audio = document.getElementById('audio');
		_that.audio.play();
		_that.audio.pause();
		_that.audio.currentTime = 0;
		_that.watchMusicState();
	},
	audioPlayInit: function(res){
		var _that = this;
		if(res.aurl){
			_that.audio.src = res.aurl;
			//默认的时候让所有的音频加载，否则在火狐ie等浏览器下由于jquery插件的存在导致onloadedmetadata事件不响应
			_that.audio.load();
		}else{
			_that.allGray();
		}
	},
	/**
	 * 播放
	 */
	playAudio: function(){
		this.isAutoPlay = false;
		this.audio.play();
		if(!this.audio.paused){
			this.pauseIcon();
		}
	},
	/**
	 * 暂停
	 */
	pauseAudio: function(){
		this.audio.pause();
		this.playIcon();
	},
	pauseIcon: function(){
		$('#playPause').attr('class', 'pause-icon');
	},
	playIcon: function(){
		$('#playPause').attr('class', 'play-icon');
	},
	watchMusicState: function(){
		var _that = this,
		    audio = _that.audio;//获取音乐DOM节点
		document.addEventListener('WeixinJSBridgeReady', function(){
			audio.play();
			audio.pause();
			audio.currentTime = 0;
			canPlay();
		}, false);
		audio.addEventListener('playing', function(){	//播放状态Doing
			if(!_that.isAutoPlay){
				_that.pauseIcon();
			}
		});
		audio.addEventListener('pause', function(){ //暂停状态Doing
			if(!_that.isAutoPlay){
				_that.playIcon();
			}
		});
		audio.addEventListener('canplay', canPlay);//监听audio是否加载完毕，如果加载完毕，则读取audio播放时间);
		audio.addEventListener('durationchange', canPlay);//监听audio是否加载完毕，如果加载完毕，则读取audio播放时间);
		audio.addEventListener('canplaythrough', function (){
			canPlay();
		});//监听audio是否加载完毕，如果加载完毕，则读取audio播放时间);
		audio.addEventListener('playing', function (){
			if(_that.isAutoPlay){
				audio.pause();
				audio.currentTime = 0;
			}
		});
		function canPlay(){
			var duration = audio.duration;
			if(duration){
				_that.audioCanPlay = true;
				audioDuration(duration);
				if($('#playPause').hasClass('loading-icon')){
					_that.playIcon();
				}
			}
		}
		audio.addEventListener('timeupdate', updateTime);
		audio.addEventListener('ended', function(){
			$('#playPause').removeClass().addClass('play-icon');
			audio.currentTime = 0;
		});
		$('.play-pause-btn').on({
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
			if(_that.audioCanPlay && audio.duration){
				if(audio.paused){
					_that.playAudio();
				}else{
					_that.pauseAudio();
				}
			}else{
				audio.load();
			}
		}
		$('.forward-btn').click(function(){
			var a = audio.currentTime + _that.speed,
			    b = a / audio.duration * 100;
			if(b > 100){
				b = 100
			}
			$('.progress').css('width', b + '%');
			audio.currentTime = a;
		});
		$('.backward-btn').click(function(){
			if($(this).hasClass('gray')){
				return;
			}
			var a = audio.currentTime - _that.speed,
			    b;
			if(a < 0){
				a = 0;
			}
			b = a / audio.duration * 100;
			$('.progress').css('width', b + '%');
			audio.currentTime = a;
		});
		$('#next').on('click', function(){
			if($(this).hasClass('gray')){
				return;
			}
			if($(this).parent('.next-btn').hasClass('gray')){
				console.log('没有下一篇');
				return;
			}
			var $nextId = parseInt(_that.currIndex) + 1;
			if(_that.articleList[$nextId]){
				_that.showArticle($nextId);
			}
		});
		$('#last').on('click', function(){
			if($(this).parent('.last-btn').hasClass('gray')){
				console.log('没有上一篇');
				return;
			}
			var $lastId = parseInt(_that.currIndex) - 1;
			if(_that.articleList[$lastId]){
				_that.showArticle($lastId);
			}
		});
		function updateTime(){
			var a = audio.currentTime,
			    b = a / audio.duration * 100;
			if(b > 100){
				b = 100;
			}
			audioDuration(audio.duration);
			$('.progress').css('width', b + '%');
			$('#currentTime').text(transTime(a));
		}
		function audioDuration(duration){
			document.getElementById('audio_length_total').innerHTML = transTime(duration);
		}
		/**
		 * 将秒转换为mm:ss
		 */
		function transTime(c){
			var a = !c || isNaN(c) ? 0 : Math.floor(c / 60),
			    b = !c || isNaN(c) ? 0 : Math.floor(c % 60);
			return a + ':' + (b < 10 ? '0' + b : b)
		}
		_that.getAudioBtnStatus();
	},
	/**
	 * 更新上一篇下一篇按钮的状态
	 */
	getAudioBtnStatus: function(){
		var alist = this.articleList;
		if(alist[parseInt(this.currIndex) + 1]){
			$('.next-btn').removeClass('gray');
		}else{
			$('.next-btn').addClass('gray');
		}
		if(alist[parseInt(this.currIndex) - 1]){
			$('.last-btn').removeClass('gray');
		}else{
			$('.last-btn').addClass('gray');
		}
	},
	/**
	 * 切换稿件
	 */
	showArticle: function(index){
		var _that = this,
		    _url = _that._href,
		    _currId = _that.articleList[_that.currIndex].fileId,
		    _id = _that.articleList[index].fileId,
				_ref = new RegExp(_currId + '(\.html)$');
		if(_ref.test(_url)){
			_url = _url.replace(_ref, _id + '$1');
			window.location.href = _url;
		}
	},
	allGray: function(){
		$('.backward-btn, .play-pause-btn, .forward-btn').addClass('gray');
	}
};
(function(){
	_reader.init();
})();