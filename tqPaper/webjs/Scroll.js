var Sys = (function(ua)
{
	var s = {};
	s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
	s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
	s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
	s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
	s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
	s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
	return s;
})(navigator.userAgent.toLowerCase());
Sys.IE6 && document.execCommand("BackgroundImageCache", false, true);
var getS = function(id)
{
	return "string" == typeof id ? document.getElementById(id) : id;
};

var getSS = function(p, e)
{
	return p.getElementsByTagName(e);
};
	
	function addListener(element,e,fn){
		element.addEventListener ? element.addEventListener(e, fn, false) : element.attachEvent("on" + e, fn);
	};
	function removeListener(element,e,fn){
		element.removeEventListener ? element.removeEventListener(e, fn, false) : element.detachEvent("on" + e, fn);
	};
	function create(elm,parent,fn){ 
		var element = document.createElement(elm);parent.appendChild(element);if (fn) fn(element);
	};
	var Css = function(e, o)
	{
		if (typeof o == "string")
		{
			e.style.cssText = o;
			return;
		}
		for (var i in o)
			e.style[i] = o[i];
	};
	function getobjpos(el,left){
		var val = 0;
		while (el != null) 
		{
			val += el["offset" + (left ? "Left" : "Top")];
			el = el.offsetParent;
		}
		return val;
	};
	var CurrentStyle = function(element)
	{
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	};
	var Bind = function(object, fun)
	{
		var args = Array.prototype.slice.call(arguments).slice(2);
		return function()
		{
			return fun.apply(object, args);
		}
	};
	var BindAsEventListener = function(object, fun, args)
	{
		var args = Array.prototype.slice.call(arguments).slice(2);
		return function(event)
		{
			return fun.apply(object, [event || window.event].concat(args));
		}
	};
	var Tween = {
		Linear: function(t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b; }
	};
	var Extend = function(destination, source)
	{
		for (var property in source)
		{
			destination[property] = source[property];
		}
	};
	var Class = function(properties)
	{
		var _class = function() { return (arguments[0] !== null && this.initialize && typeof (this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this; };
		_class.prototype = properties;
		return _class;
	};
	var Drag = new Class({
		options: {
			Limit: false,
			mxLeft: 0,
			mxRight: 9999,
			mxTop: 0,
			mxBottom: 9999,
			mxContainer: null,
			LockX: false,
			LockY: false,
			zIndex: 2,
			Onstart: function() { },
			Onmove: function() { },
			Onstop: function() { }
		},
		initialize: function(obj, options)
		{
			this._obj = obj;
			this._x = 0;
			this._y = 0;
			this._marginLeft = 0;
			this._marginTop = 0;
			this._fM = BindAsEventListener(this, this.Move);
			this._fS = Bind(this, this.Stop);
			var o = {};
			Extend(o, this.options);
			Extend(o, options || {});
			Extend(this, o);
			this.zIndex = Math.max(this.zIndex, Drag.zIndex || 0);
			if (this.mxContainer && this.Limit) //设置了限制 和 容器限制后 计算边界值 
			{
				this.mxLeft = getobjpos(this.mxContainer, 1);
				this.mxTop = getobjpos(this.mxContainer, 0);
				this.mxRight = getobjpos(this.mxContainer, 1) + this.mxContainer.offsetWidth - this._obj.offsetWidth;
				this.mxBottom = getobjpos(this.mxContainer, 0) + this.mxContainer.offsetHeight - this._obj.offsetHeight;
			}
			addListener(this._obj, "mousedown", BindAsEventListener(this, this.Start));
			Drag.zIndex = this.zIndex;
		},
		Start: function(e)
		{
			this._obj.style.zIndex = ++Drag.zIndex;
			this._x = e.clientX - this._obj.offsetLeft;
			this._y = e.clientY - this._obj.offsetTop;
			this._marginLeft = parseInt(this._obj.style.marginLeft) || 0;
			this._marginTop = parseInt(this._obj.style.marginTop) || 0;

			if (Sys.IE)
			{
				addListener(this._obj, "losecapture", this._fS);
				this._obj.setCapture();
			}
			else
			{
				e.preventDefault();
				addListener(window, "blur", this._fS);
			}
			addListener(document, "mousemove", this._fM);
			addListener(document, "mouseup", this._fS);
			this.Onstart();
		},
		Move: function(e)
		{
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var iLeft = e.clientX - this._x, iTop = e.clientY - this._y;
			  var temp_iTop=iTop;
			if (this.Limit)
			{
				iLeft = Math.min(Math.max(iLeft, this.mxLeft), this.mxRight);
				iTop = Math.min(Math.max(iTop, this.mxTop), this.mxBottom);
			}  
			if(iTop<0)
			{
			iTop=temp_iTop
			}
			if (!this.LockX) this._obj.style.left = iLeft - this._marginLeft + "px";
			if (!this.LockY) this._obj.style.top = iTop - this._marginTop + "px";
      
			this.Onmove();
		},
		Stop: function()
		{
			removeListener(document, 'mousemove', this._fM);
			removeListener(document, 'mouseup', this._fS);
			if (Sys.IE)
			{
				removeListener(this._obj, "losecapture", this._fS);
				this._obj.releaseCapture();
			}
			else
				removeListener(window, "blur", this._fS);
			this.Onstop();
		}
	});
	var Slider = new Class({
		options: {
			direction: true, //true为纵,false为横
			type: "Y", //分别为X,Y,N 
			shapechange: true, //是否该变滚动条的形状 
			topvalue: 0, //上或左偏差值 
			bottomvalue: 0, //下或右偏差值 
			border: 0, //处理ie下border的问题 
			step: 1, //键盘操作时候的步长 
			t: 0,
			b: 0,
			c: 0,
			d: 40,
			Onmove: function() { }
		},
		initialize: function(container, block, blockcontainer, options)
		{

			this.container = container;
			this.block = block;
			this.blockcontainer = blockcontainer;
			this.blockcontainer.style.display="";
			this.block.style.display="";
			var o = {};
			Extend(o, this.options);
			Extend(o, options || {});
			Extend(this, o);
			this.timer = null;
			this.ismove = false;
			var _self = this;
			/*==========================================================================================================================*/
			/*如果滚动条不是单独的图片可以用div模拟 这时候就得设置滚动条的长度或者宽度了 按比例设置*/
			this.type == "Y" && this.shapechange && (this.block.style.height = this.container.offsetHeight * (this.container.offsetHeight / getSS(this.container, "div")[0].scrollHeight) + "px");
			this.type == "X" && this.shapechange && (this.block.style.width = this.container.offsetWidth * (this.container.offsetWidth / getSS(this.container, "div")[0].scrollWidth) + "px");

			/*==========================================================================================================================*/
			var xc = this.blockcontainer ? this.blockcontainer : this.container;

//			addListener(xc, 'click', BindAsEventListener(this, this.Start));
//			addListener(this.block, 'click', BindAsEventListener(this, this.Bubble));
			/*==========================================================================================================================*/
			this.KeyBind(this.container); //键盘与鼠标滑轮部分参考的cloudgamer的 
			this.WheelBind(this.container);
			var oFocus = Sys.IE ? this.block : this.container;
			addListener(this.block, "mousedown", function() { _self.Stopmove(); oFocus.focus(); });
			/*==========================================================================================================================*/
			this.drag = new Drag(this.block, { Limit: true, mxContainer: xc, Onmove: Bind(this, this.Move) });
			this.drag[this.direction ? "LockX" : "LockY"] = true;
			this.border = (Sys.IE6 || Sys.IE7) ? this.border : 0; //ie6,7下 border也要算进去 不然有误差 ie8,却又不需要算 真是纠结............ 
			if (this.direction)
			{
				this.topvalue = this.drag.mxTop;
				this.bottomvalue =0 - this.drag.mxTop;
				this.drag.mxTop =this.drag.mxTop - this.topvalue + this.border;
				this.drag.mxBottom =  this.drag.mxBottom + this.bottomvalue + this.border;
				this.block.style.top = this.drag.mxTop + "px";

			}
			else
			{
				this.drag.mxLeft = this.drag.mxLeft - this.topvalue + this.border;
				this.drag.mxRight =  this.drag.mxRight + this.bottomvalue + this.border;
				this.block.style.left = this.drag.mxLeft + "px";

			}

			if (this.block.offsetHeight>= this.container.offsetHeight)
			{
			  
			   this.blockcontainer.style.display="none";
			}
			///修改结束
			
			this.Move();
		},
		Keycontrol: function(e)
		{
			this.Stopdefault(e);
			this.Stopmove();
		
			var l1 = this.direction ? "top" : "left", l2 = this.direction ? "offsetTop" : "offsetLeft", l3 = this.direction ? "mxTop" : "mxLeft", l4 = this.direction ? "mxBottom" : "mxRight";
			if (e.keyCode == 37 || e.keyCode == 38) this.block.style[l1] = Math.max(this.block[l2] - this.step, this.drag[l3]) + 'px';
			if (e.keyCode == 39 || e.keyCode == 40) this.block.style[l1] = Math.min(this.block[l2] + this.step, this.drag[l4]) + 'px';
			this.Move();
		},
		Wheelcontrol: function(e)
		{
			this.Stopmove();
			var t = Sys.Firefox ? e.detail : e.wheelDelta;
			
			var l1 = this.direction ? "top" : "left", l2 = this.direction ? "offsetTop" : "offsetLeft", l3 = this.direction ? "mxTop" : "mxLeft", l4 = this.direction ? "mxBottom" : "mxRight";
			var h1=this.direction ? "offsetHeight" : "offsetWidth";
			this.block.style[l1] = Sys.Firefox ? (t < 0 ? Math.max(this.block[l2] - 5, this.drag[l3]) + 'px' : Math.min(this.block[l2] + 5, this.blockcontainer[h1]-this.block[h1]) + 'px') : (t > 0 ? Math.max(this.block[l2] - 5, this.drag[l3]) + 'px' : Math.min(this.block[l2] + 5, this.blockcontainer[h1]-this.block[h1]) + 'px');
			this.Move();
			this.Stopdefault(e);
		},
		WheelBind: function(o)
		{
			addListener(o, Sys.Firefox ? "DOMMouseScroll" : "mousewheel", BindAsEventListener(this, this.Wheelcontrol));
		},
		KeyBind: function(o)
		{
			addListener(o, 'keydown', BindAsEventListener(this, this.Keycontrol));
			o.tabIndex = -1;
			Sys.IE || (o.style.outline = "none");
		},
		Move: function()
		{
			var c = getSS(this.container, "div")[0];
			/*=========================================================================================================================*/
			if (this.type == "Y") c.scrollTop = (c.scrollHeight - c.offsetHeight) * (this.block.offsetTop - this.drag.mxTop) / (this.blockcontainer.offsetHeight - this.block.offsetHeight + this.topvalue + this.bottomvalue)+17;
			if (this.type == "X") c.scrollLeft = (c.scrollWidth - c.offsetWidth) * (this.block.offsetLeft - this.drag.mxLeft) / (this.blockcontainer.offsetWidth - this.block.offsetWidth + this.topvalue + this.bottomvalue);
			/*上面为滚动条的计算方式*/
			/*=========================================================================================================================*/
			this.Onmove();
		},
		Start: function(e)
		{
			this.ismove = true;
			this.b = this.direction ? this.block.offsetTop : this.block.offsetLeft;
			if (this.direction)
			{
				var t = Sys.Chrome ? document.body.scrollTop : document.documentElement.scrollTop;
				var l = (e.clientY + t) <= this.block.offsetTop ? 0 : this.block.offsetHeight;
			}
			else
			{
				var t = Sys.Chrome ? document.body.scrollLeft : document.documentElement.scrollLeft;
				var l = (e.clientX + t) <= this.block.offsetLeft ? 0 : this.block.offsetWidth;
			}
			this.c = this.direction ? (e.clientY + t - l) : (e.clientX + t - l);
			this.t = 0;
			this.Run();
		},
		Run: function()
		{
			if (!this.ismove) return;
			clearTimeout(this.timer);
			if (this.t < this.d)
			{
				this.Runto(Math.round(Tween.Linear(this.t++, this.b, (this.c - this.b), this.d)));
				this.timer = setTimeout(Bind(this, this.Run), 5);
			}
			else
			{
				this.Runto(this.c);
				this.t = 0;
				this.ismove = true;
			}
		},
		Runto: function(i)
		{
			this.block.style[this.direction ? "top" : "left"] = i + "px";
			this.Move();
		},
		Bubble: function(e)
		{
			Sys.IE ? (e.cancelBubble = true) : (e.stopPropagation());
		},
		Stopdefault: function(e)
		{
			Sys.IE ? (e.returnValue = false) : (e.preventDefault());
		},
		Left: function(o)
		{
			this.Lrmove("mxTop", "mxLeft");
		},
		Right: function()
		{
			this.Lrmove("mxBottom", "mxRight");
		},
		Lrmove: function(t, b)
		{
			if (this.t != 0) return;
			this.ismove = true;
			this.b = this.direction ? this.block.offsetTop : this.block.offsetLeft;
			this.c = this.direction ? this.drag[t] : this.drag[b];
			this.Run();
		},
		Stopmove: function()
		{
			this.ismove = false; clearTimeout(this.time); this.t = 0;
		}
	}) 