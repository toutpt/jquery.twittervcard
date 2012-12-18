/**
 * A jQuery plugin to display twitter author with their last tweet in the vcard
 * format.
 * 
 * @author JeanMichel FRANCOIS aka toutpt
 * @date 2012-12-17
 * @version 0.1
 * 
 * @license Copyright (c) 2012, JeanMichel FRANCOIS
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
;
(function($) {

	$.fn.twittervcard = function(options) {
		var settings = $.extend( {
		      'replace'         : 'true',
		      'template': 'none'
		    }, options);

		var username = undefined;
		var baseurl = "https://twitter.com/users/%s.json?callback=twittervcardback";
		return this.each(function() {
			username = $(this).attr('href').split('/')[3];
//			console.log(username);
			var url = baseurl.replace('%s', username);
//			console.log(url);
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = url;
			$(this).append( script );
		});

	};

})(jQuery);

function twittervcardback(data){
	console.log(data['screen_name']);
	console.log(data);
	var wrapper = document.createElement('blockquote');
	$(wrapper).addClass('twt-tweet');
	
	//vcard TEMPLATE
	var vcard = document.createElement('div');
	$(vcard).addClass('vcard').addClass('author');
	wrapper.appendChild(vcard);

	//<a class="screen-name url" data-screen-name="PhilippeAllard" tal:attributes="href string:http://twitter.com/${tweet/screen_name}">
	var screenname = document.createElement('a')
	$(screenname).addClass('url').addClass('screen-name').attr('href', 'http://twitter.com/' + data['screen_name'])
	.attr('data-screen', data['name']);

	var avatar = document.createElement('span')
	$(avatar).addClass('avatar');
	var img = document.createElement('img')
	$(img).addClass('image-left').addClass('photo').attr('alt', data['name']).attr('src', data['profile_image_url']);
	avatar.appendChild(img);

	//<span class="fn" tal:content="tweet/name">...</span>
	var fn = document.createElement('span');
	$(fn).addClass('fn').text(data['name']);

	//<span class="nickname">@<b tal:content="tweet/screen_name">...</b></span>
	var nickname = document.createElement('span');
	$(nickname).addClass('nickname').html('@<b>'+data['screen_name']+'</b>');

	screenname.appendChild(avatar);
	screenname.appendChild(fn);
	screenname.appendChild(nickname);
	vcard.appendChild(screenname);

	if (data['status'] != undefined){
			var entry = document.createElement('div')
			$(entry).addClass('entry-content');
			var entryp = document.createElement('p');
			$(entryp).addClass('entry-title').html(data['status']['text']);
			entry.appendChild(entryp);
			wrapper.appendChild(entry);
			//<a tal:condition="tweet/status|nothing" href="https://twitter.com/${tweet/screen_name}/status/${tweet/status/id}">
			//  <time class="timeago" tal:attributes="datetime tweet/status/created_at_datetime" tal:content="tweet/status/created_at"></time>
			//</a>
			var anchor = document.createElement('a');
			$(anchor).attr('href', "https://twitter.com/" + data['screen_name'] + '/status/' + data['status']['id_str']);
			var timeago = document.createElement('time')
			var dt = new Date(Date.parse(data['status']['created_at']));
			var datetimestr = '' + dt.getFullYear() + '-' + ("0" + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + 'T' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + 'Z'
			$(timeago).addClass('timeago').attr('datetime', datetimestr).text(data['status']['created_at']);
			anchor.appendChild(timeago);
			wrapper.appendChild(anchor);
			//Add timeago support
			if(jQuery().timeago) {
				$(timeago).timeago();
			}
	}

	var selector = 'a.twittervcard[href$="'+data['screen_name']+'"]';
	$(selector).replaceWith(wrapper);

};