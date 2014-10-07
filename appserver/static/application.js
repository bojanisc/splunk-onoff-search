//fgnass.github.com/spin.js#v1.3.3
!function(a,b){a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=k.substring(0,k.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(n.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",n.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a){for(var b={x:a.offsetLeft,y:a.offsetTop};a=a.offsetParent;)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}function h(a,b){return"string"==typeof a?a:a[b%a.length]}function i(a){return"undefined"==typeof this?new i(a):(this.opts=f(a||{},i.defaults,o),void 0)}function j(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}n.addRule(".spin-vml","behavior:url(#default#VML)"),i.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function g(a,g,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~g}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:h(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)g(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)g(i);return b(a,m)},i.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var k,l=["webkit","Moz","ms","O"],m={},n=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};i.defaults={},f(i.prototype,{spin:function(b){this.stop();var c,d,f=this,h=f.opts,i=f.el=e(a(0,{className:h.className}),{position:h.position,width:0,zIndex:h.zIndex}),j=h.radius+h.length+h.width;if(b&&(b.insertBefore(i,b.firstChild||null),d=g(b),c=g(i),e(i,{left:("auto"==h.left?d.x-c.x+(b.offsetWidth>>1):parseInt(h.left,10)+j)+"px",top:("auto"==h.top?d.y-c.y+(b.offsetHeight>>1):parseInt(h.top,10)+j)+"px"})),i.setAttribute("role","progressbar"),f.lines(i,f.opts),!k){var l,m=0,n=(h.lines-1)*(1-h.direction)/2,o=h.fps,p=o/h.speed,q=(1-h.opacity)/(p*h.trail/100),r=p/h.lines;!function s(){m++;for(var a=0;a<h.lines;a++)l=Math.max(1-(m+(h.lines-a)*r)%p*q,h.opacity),f.opacity(i,a*h.direction+n,l,h);f.timeout=f.el&&setTimeout(s,~~(1e3/o))}()}return f},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function g(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*j+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,j=0,l=(f.lines-1)*(1-f.direction)/2;j<f.lines;j++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:k&&c(f.opacity,f.trail,l+j*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(g("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,g(h(f.color,j),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var p=e(a("group"),{behavior:"url(#default#VML)"});return!d(p,"transform")&&p.adj?j():k=d(p,"animation"),i});

// var spinner_opts_tiny = { lines: 8, length: 2, width: 2, radius: 3 };
// var spinner_opts_small = { lines: 8, length: 4, width: 3, radius: 5 };
// var spinner_opts_large = { lines: 10, length: 8, width: 4, radius: 8 };
var spinner_opts_toggle = { lines: 8, length: 2, width: 2, radius: 3, left: 13, top: 1 };
var spinner_opts_popupFooter = { lines: 8, length: 4, width: 3, radius: 5, left: 10};

function delayed(delayMs, fn) {
	var timer = setInterval(function() {
		clearInterval(timer);
		fn();
	}, delayMs);
}

if (Splunk.util.getCurrentView().match("^rule\_\\d+$") && Splunk.Module.SimpleResultsTable) {
	Splunk.Module.SimpleResultsTable = $.klass(Splunk.Module.SimpleResultsTable, {
		onResultsRendered: function($super) {
			var retVal = $super();
			this.myCustomHeatMapDecorator();
			return retVal;
		},

		myCustomHeatMapDecorator: function() {
			$("tr:has(td)", this.container).each(function() {
				var element = $(this).find("td:nth-child(1)");
				element.addClass("severity_" + element.text());
			});
		}
	});
}

$(function() {
	$.fn.onAvailable = function(fn) {
		var sel = this.selector;
		var self = this;
		if (this.length > 0) {
			fn.call(this);
		} else {
			var timer = setInterval(function() {
				var selected = $(sel);
				if (selected.length > 0) {
					clearInterval(timer);
					fn.call(selected);
				}
			}, 100);
		}
	};

	$.fn.onNotAvailable = function(fn) {
		var sel = this.selector;
		var self = this;
		if (this.length === 0) {
			fn.call(this);
		} else {
			var timer = setInterval(function() {
				var selected = $(sel);
				if (selected.length === 0) {
					clearInterval(timer);
					fn.call(selected);
				}
			}, 100);
		}
	};

	$.fn.ifNotAvailable = function(fn) {
		var self = this;
		if (this.length === 0) {
			fn.call(this);
		}
	};

	var messenger = Splunk.Messenger.System.getInstance();
	
	if (Splunk.util.getCurrentView() == "rule_thresholds") {
		var logger = Splunk.Logger.getLogger("application.js/rule_thresholds");

		/*
		 jQuery Toggles v2.0.4
		Copyright (C) 2012 Simon Tabor

		Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		https://github.com/simontabor/jquery-toggles / http://simontabor.com/labs/toggles
		*/
		$.fn.toggles=function(d){function p(e,b,f,c){var r=e.toggleClass("active").hasClass("active");if(c!==r){var d=e.find(".toggle-inner").css(w);e.find(".toggle-off").toggleClass("active");e.find(".toggle-on").toggleClass("active");a.checkbox.prop("checked",r);if(!k){var l=r?0:-b+f;d.css("margin-left",l);setTimeout(function(){d.css(x);d.css("margin-left",l)},a.animate)}}}d=d||{};var a=$.extend({drag:!0,click:!0,text:{on:"ON",off:"OFF"},on:!1,animate:250,transition:"ease-in-out",checkbox:null,clicker:null,width:50,height:20,type:"compact"},d),k="select"==a.type;a.checkbox=$(a.checkbox);a.clicker&&(a.clicker=$(a.clicker));d="margin-left "+a.animate+"ms "+a.transition;var w={"-webkit-transition":d,"-moz-transition":d,transition:d},x={"-webkit-transition":"","-moz-transition":"",transition:""};return this.each(function(){var e=$(this),b=e.height(),f=e.width();if(!b||!f)e.height(b=a.height),e.width(f=a.width);var c=$('<div class="toggle-slide">'),d=$('<div class="toggle-inner">'),t=$('<div class="toggle-on">'),l=$('<div class="toggle-off">'),h=$('<div class="toggle-blob">'),m=b/2,s=f-m;t.css({height:b,width:s,textAlign:"center",textIndent:k?"":-m,lineHeight:b+"px"}).html(a.text.on);l.css({height:b,width:s,marginLeft:k?"":-m,textAlign:"center",textIndent:k?"":m,lineHeight:b+"px"}).html(a.text.off).addClass("active");h.css({height:b,width:b,marginLeft:-m});d.css({width:2*f-b,marginLeft:k?0:-f+b});k&&(c.addClass("toggle-select"),e.css("width",2*s),h.hide());e.html(c.html(d.append(t,h,l)));c.bind("toggle",function(a,d){a&&a.stopPropagation();p(c,f,b);e.trigger("toggle",!d)});e.bind("toggleOn",function(){p(c,f,b,!1)});e.bind("toggleOff",function(){p(c,f,b,!0)});a.on&&p(c,f,b);if(a.click&&(!a.clicker||!a.clicker.has(e).length))e.bind("click",function(b){(b.target!=h[0]||!a.drag)&&c.trigger("toggle",c.hasClass("active"))});if(a.clicker)a.clicker.bind("click",function(b){(b.target!=h[0]||!a.drag)&&c.trigger("toggle",c.hasClass("active"))});if(a.drag&&!k){var g,u=(f-b)/4,v=function(k){e.off("mousemove");c.off("mouseleave");h.off("mouseup");var q=c.hasClass("active");!g&&a.click&&"mouseleave"!==k.type?c.trigger("toggle",q):q?g<-u?c.trigger("toggle",q):d.animate({marginLeft:0},a.animate/2):g>u?c.trigger("toggle",q):d.animate({marginLeft:-f+b},a.animate/2)},n=-f+b;h.bind("mousedown",function(a){g=0;h.off("mouseup");c.off("mouseleave");var b=a.pageX;e.bind("mousemove",h,function(a){g=a.pageX-b;c.hasClass("active")?(a=g,0<g&&(a=0),g<n&&(a=n)):(a=g+n,0>g&&(a=n),g>-n&&(a=0));d.css("margin-left",a)});h.bind("mouseup",v);c.bind("mouseleave",v)})}})};

		var sortableColumns = ['RULE_ID', 'DESCRIPTION'];

		var intRegex = new RegExp('^\\d+$');
		var floatRegex = new RegExp('^\\d+(\\.\\d+)?$');
		function checkStringType(string, type) {
			if (type === 'int') {
				return intRegex.test(string);
			} else if (type === 'float') {
				return floatRegex.test(string);
			}
			return false;
		}

		function doit() {
			var simpleResultsTable = $("table.simpleResultsTable");
			// some selectors aren't as precise to keep compatibility with older Splunk versions (no <thead>)

			// insert empty header columns
			$("tr:first", simpleResultsTable).prepend('<th><div id="toggle_spinner"></div></th><th></th>');
			// modify the table header
			$('tr > th', simpleResultsTable).each(function() {
				if (sortableColumns.indexOf($('span.sortLabel', this).text()) !== -1) {
					$(this).add($('*', this)).click(function() {
						$('table.simpleResultsTable > tbody > tr > td > a.button_edit').onNotAvailable(function() {
							$("table.simpleResultsTable > tbody > tr > td").onAvailable(function() {
								delayed(100, function() {
									$('table.simpleResultsTable > tbody > tr > td > a.button_edit').ifNotAvailable(doit);
								});
							});
						});
					});
				} else {
					$(this).click(false);
					$('*', this).click(false);
					$('span.splSortNone, span.splSortDesc, span.splSortAsc', this).hide();
				}
			});
			// insert edit buttons in rows that have thresholds
			$("> tbody > tr > td[field='THRESHOLD']", simpleResultsTable).each(function() {
				if ($(this).text() !== '-') {
					$(this).parent().prepend('<td><a href="#" class="button_edit"></a></td>');
				} else {
					$(this).parent().prepend('<td></td>');
				}
			});
			// insert rule toggle buttons
			$("tr:not(:first)", simpleResultsTable).prepend('<td><div class="toggle-light"></div></td>');
			// make the indicator spin
			var toggle_spinner = new Spinner(spinner_opts_toggle);
			toggle_spinner.spin(document.getElementById('toggle_spinner'));
			// get rules' initial state
			$.ajax({
				url: "/" + Splunk.util.getConfigValue("LOCALE") + "/custom/fraud_monitoring/RuleThresholdsController/rulestate",
				type: "GET",
				dataType: "json"
			}).done(function(data) {
				toggle_spinner.stop();
				if (data['status'] == "OK") {
					logger.info("Got rule states");
					// activate toggles
					var rule_states = data['rule_states'];
					var errors = data['errors'];
					for (var i = 0, len = errors.length; i < len; ++i) {
						logger.warn(errors[i]);
						messenger.send("error", "application.js", "fraud_monitoring: " + errors[i]);
					}
					$("> tbody > tr > td > div.toggle-light", simpleResultsTable).each(function() {
						var rule_id = $(this).parent().siblings("[field='RULE_ID']").text();
						var rule_state = rule_states[rule_id];
						if (rule_state === undefined) {
							$(this).toggles({on: false, drag: false, click: false, text: {on: 'ERR', off: 'ERR'}, width: 37, height: 15});
							$('div.toggle-on, div.toggle-off, div.toggle-blob', this).click(function() {
								alert("Changing this rule's state has been disabled as its initial state couldn't be determined (saved search not found, or rule affected by multiple saved searches with differing states?)");
								return false;
							});
						} else {
							$(this).toggles({on: rule_state, drag: false, width: 37, height: 15});
							$('div.toggle-on, div.toggle-off, div.toggle-blob', this).click(function() {
								var current_rule_state = $(this).parent().parent().hasClass('active');
								if (!confirm('Are you sure you want to ' + (current_rule_state ? 'disable' : 'enable') + ' this rule?')) {
									return false;
								}
								// sync request
								var fail = false;
								$.ajax({
									url: "/" + Splunk.util.getConfigValue("LOCALE") + "/custom/fraud_monitoring/RuleThresholdsController/rulestate",
									type: "POST",
									dataType: "json",
									contentType: "application/json",
									data: JSON.stringify({rule_id: rule_id, state: !current_rule_state}),
									async: false
								}).done(function(data) {
									if (data['status'] == "OK") {
										logger.info("Set rule state");
									} else {
										fail = true;
										logger.error("Error while setting rule state (rulestate)");
										messenger.send("error", "application.js", "fraud_monitoring: Error while setting rule state (rulestate)");
									}
								}).fail(function() {
									fail = true;
									logger.error("Error while setting rule state (ajax)");
									messenger.send("error", "application.js", "fraud_monitoring: Error while setting rule state (ajax)");
								});
								// cancel the toggle if the request failed
								if (fail === true) {
									return false;
								}
							});
						}
					});
				} else {
					logger.error("Error while getting rule states (rulestate)");
					messenger.send("error", "application.js", "fraud_monitoring: Error while getting rule states (rulestate)");
				}
			}).fail(function() {
				logger.error("Error while getting rule states (ajax)");
				messenger.send("error", "application.js", "fraud_monitoring: Error while getting rule states (ajax)");
			});
			// set onclick action when clicking the edit button (rule edit splunk popup)
			$("> tbody > tr > td > a.button_edit", simpleResultsTable).click(function(event) {
				// get rule info for current row (threshold info)
				var fields = $(this).parent().siblings();
				var ruleID = fields.filter("[field='RULE_ID']").text();
				var thresholdKeys = fields.filter("[field='THRESHOLD']");
				var thresholdKeysChildren = thresholdKeys.children('div');
				if (thresholdKeysChildren.length > 0) {
					thresholdKeys = [];
					thresholdKeysChildren.each(function() {
						thresholdKeys.push($(this).text());
					});
				} else {
					thresholdKeys = [thresholdKeys.text()];
				}
				var thresholdStuffLength = thresholdKeys.length;
				var thresholdValues = fields.filter("[field='VALUE']");
				var thresholdValuesChildren = thresholdValues.children('div');
				if (thresholdValuesChildren.length > 0) {
					thresholdValues = [];
					thresholdValuesChildren.each(function() {
						thresholdValues.push($(this).text());
					});
				} else {
					thresholdValues = [thresholdValues.text()];
				}
				var thresholdTypes = fields.filter("[field='TYPE']");
				var thresholdTypesChildren = thresholdTypes.children('div');
				if (thresholdTypesChildren.length > 0) {
					thresholdTypes = [];
					thresholdTypesChildren.each(function() {
						thresholdTypes.push($(this).text());
					});
				} else {
					thresholdTypes = [thresholdTypes.text()];
				}
				var description = fields.filter("[field='DESCRIPTION']").html();

				// make popup
				var popupDiv = $('<div><table width="500"><tbody>');
				var popupTable = popupDiv.children().children();
				popupTable.append('<tr><td>Rule ID:</td><td>' + ruleID + '</td></tr><tr><td></td><td></td></tr>');
				popupTable.append('<tr><td>Rule description:</td><td>' + description + '</td></tr><tr><td></td><td></td></tr>');
				for (var i = 0; i < thresholdStuffLength; ++i) {
					popupTable.append('<tr><td>' + thresholdKeys[i] + ' (' + thresholdTypes[i] + '):</td><td><input type="text" value="' + thresholdValues[i] + '"></td></tr>');
				}
				popupTable.append('<tr><td></td><td></td></tr>');

				var popup = new Splunk.Popup(popupDiv, {
					title: "Edit rule",
					buttons: [
						{
							label: "Cancel",
							type: "secondary",
							callback: function(event) {
								popup.destroyPopup();
							}
						},
						{
							label: "OK",
							type: "primary",
							callback: function(event) {
								// get new threshold values
								var newThresholdValues = [];
								$("input", popupTable).each(function() {
									newThresholdValues.push($(this).val());
								});

								// check threshold types
								for (var i = 0; i < thresholdStuffLength; ++i) {
									if (!checkStringType(newThresholdValues[i], thresholdTypes[i])) {
										alert("Value '" + newThresholdValues[i] + "' of threshold '" + thresholdKeys[i] + "' cannot be parsed as type '" + thresholdTypes[i] + "'.");
										return;
									}
								}

								var confirmedEditing = false;
								var rule = {id: ruleID, thresholds: {}};
								for (var i = 0; i < thresholdStuffLength; ++i) {
									if (newThresholdValues[i] !== thresholdValues[i]) {
										if (!confirmedEditing && !confirm("Are you sure you want to edit this rule?")) {
											return;
										}
										confirmedEditing = true;

										rule.thresholds[thresholdKeys[i]] = {value: newThresholdValues[i]};
									} else if (!confirmedEditing && i === thresholdStuffLength - 1) {
										popup.destroyPopup();
										return;
									}
								}

								// set new threshold values
								$.ajax({
									url: "/" + Splunk.util.getConfigValue("LOCALE") + "/custom/fraud_monitoring/RuleThresholdsController/rulethresholds",
									type: "POST",
									dataType: "json",
									contentType: "application/json",
									data: JSON.stringify(rule)
								}).done(function(data) {
									popup.destroyPopup();

									if (data['status'] == "OK") {
										logger.info("Edited rule");
										document.location = "/" + Splunk.util.getConfigValue("LOCALE") + "/app/fraud_monitoring/rule_thresholds";
									} else {
										logger.error("Error while editing rule (rulethresholds)");
										messenger.send("error", "application.js", "fraud_monitoring: Error while editing rule (rulethresholds)");
									}
								}).fail(function() {
									popup.destroyPopup();

									logger.error("Error while editing rule (ajax)");
									messenger.send("error", "application.js", "fraud_monitoring: Error while editing rule (ajax)");
								});
							}
						}
					],
					cloneFlag: false
				});
			});
			// prettify descriptions
			$("> tbody > tr > td[field='DESCRIPTION']", simpleResultsTable).each(function() {
				// get threshold keys for the current row
				var thresholdKeys = $(this).siblings("[field='THRESHOLD']");
				var thresholdKeysChildren = thresholdKeys.children('div');
				if (thresholdKeysChildren.length > 0) {
					thresholdKeys = [];
					thresholdKeysChildren.each(function() {
						thresholdKeys.push($(this).text());
					});
				} else {
					thresholdKeys = [thresholdKeys.text()];
				}
				// construct regex pattern from the current row's threshold keys
				// apply it to make threshold key appearances in this rule's descriptions bold
				$(this).html($(this).html().replace(new RegExp('(\\$[' + thresholdKeys.join('') + '])', 'g'), '<strong>$1</strong>'));
			});
		}

		$("table.simpleResultsTable tr > th").onAvailable(function() {
			$("table.simpleResultsTable > tbody > tr > td").onAvailable(function() {
				delayed(100, doit);
			});
		});
	}
});
