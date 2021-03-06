/**
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

/**
 * Tweet element
 * @constructor
 * @param {string} id Tweet identifier
 * @param {twic.vcl.Timeline} timeline Timeline
 */
twic.vcl.Tweet = function(id, timeline) {

	var
		tweet = this,

		/** @type {RegExp} */ nickSearchPattern   = /[\@]+(\w+)/gi,
		/** @type {RegExp} */ hashSearchPattern   = /([^&\w]|^)(#([\w\u0080-\uffff]*))/gi,
		/** @type {RegExp} */ breaksSearchPattern = /\r?\n/,

		/** @type {Element} */ replyWrapper = twic.dom.expandElement('div'),
		/** @type {twic.vcl.TweetEditor} */ replier,

		/** @type {Object} */ mentioned = { },

		/** @type {number} */ unixtime = 0,
		/** @type {number} */ authorId,
		/** @type {string} */ authorNick,
		/** @type {number} */ retweetedById,
		/** @type {string} */ rawText,

		/** @type {number} */ timelineId = timeline.getUserId(),
		/** @type {string} */ timelineNick = timeline.getUserNick(),

		/** @type {string} */ trAgo = twic.utils.lang.translate('time_ago'),

		wrapper      = twic.dom.expandElement('li#' + id + '.tweet'),
		avatarLink   = twic.dom.expandElement('a.avatar'),
		avatar       = twic.dom.expandElement('img.avatar'),
		rtAvatarLink = twic.dom.expandElement('a.avatar.retweeter'),
		rtAvatar     = twic.dom.expandElement('img.avatar'),
		tweetContent = twic.dom.expandElement('p'),
		otherInfo    = twic.dom.expandElement('p.info'),
		timeSpan     = twic.dom.expandElement('span.time'),
		clientSpan   = twic.dom.expandElement('span.client'),
		clearer      = twic.dom.expandElement('div.clearer'),

		isRetweet    = false;

	twic.dom.setVisibility(rtAvatarLink, false);

	avatarLink.appendChild(avatar);
	rtAvatarLink.appendChild(rtAvatar);

	wrapper.appendChild(avatarLink);
	wrapper.appendChild(rtAvatarLink);
	wrapper.appendChild(tweetContent);
	wrapper.appendChild(otherInfo);
	wrapper.appendChild(clearer);
	wrapper.appendChild(replyWrapper);

	/**
	 * Set the tweet text
	 * @param {string} text
	 */
	tweet.setText = function(text) {
		var txt = twic.utils.url.processText(text);

		rawText = text;

		// preparing hashtags
		txt = txt.replace(
			hashSearchPattern,
			'$1<a class="hash" target="_blank" href="http://search.twitter.com/search?q=%23$3">$2</a>'
		);

		// preparing nicks
		txt = txt.replace(
			nickSearchPattern,
			function(nick) {
				var n = nick.substring(1);

				if (timelineNick === n) {
					// this tweet is with our mention
					wrapper.classList.add('mention');
				}

				mentioned[n.toLowerCase()] = '@' + n;

				return '<a class="nick" href="#profile#' + n.toLowerCase() + '">@' + n + '</a>';
			}
		);

		// preparing line breaks
		txt = txt.replace(
			breaksSearchPattern,
			'<br />'
		);

		tweetContent.innerHTML = txt + '<br />';
	};

	tweet.updateTime = function() {
		if (0 === unixtime) {
			return false;
		}

		var
			desc = '',
			now = twic.utils.date.getCurrentTimestamp(),
			df = now - unixtime;

		// less than minute ago
		if (df < 60) {
			desc = twic.utils.lang.translate('time_less_minute') + ' ' + trAgo;
		} else
		// less than hour ago
		if (df < 60 * 60) {
			desc = twic.utils.lang.plural( Math.floor(df / 60), [
				'time_minute_one',
				'time_minute_much',
				'time_minute_many'
			] ) + ' ' + trAgo;
		} else
		// less than day ago
		if (df < 60 * 60 * 24) {
			desc = twic.utils.lang.plural( Math.floor(df / 60 / 60), [
				'time_hour_one',
				'time_hour_much',
				'time_hour_many'
			] ) + ' ' + trAgo;
		} else {
			var
				dt = new Date(unixtime * 1000);

			desc = dt.getDay() + ' ' +
				twic.utils.lang.translate('time_month_' + (dt.getMonth() + 1));
		}

		timeSpan.innerText = desc;
	};

	/**
	 * Set the time
	 */
	tweet.setUnixTime = function(newUnixTime) {
		unixtime = newUnixTime;

		tweet.updateTime();
		otherInfo.appendChild(timeSpan);
	};

	/**
	 * Set the source
	 */
	tweet.setSource = function(newSource) {
		// todo remove this [if] in next version
		if ('' === newSource) {
			return false;
		}

		clientSpan.innerHTML = (0 !== unixtime ? ' ' + twic.utils.lang.translate('via') + ' ' : '') +
			newSource.replace('<a ', '<a target="_blank" ');
		otherInfo.appendChild(clientSpan);
	};

	/**
	 * Add a separator
	 */
	tweet.setSeparator = function() {
		wrapper.classList.add('separator');
	};

	/**
	 * Set author info
	 * @param {number} id Author identifier
	 * @param {string} nick Tweet author nick
	 * @param {string} av User avatar src
	 */
	tweet.setAuthor = function(id, nick, av) {
		authorId = id;
		authorNick = nick;

		if (authorId === timelineId) {
			wrapper.classList.add('me');
		}

		avatarLink.title = '@' + nick;
		avatarLink.href = '#profile#' + nick;

		avatar.src = av;
	};

	/**
	 * Set retweeter info
	 * @param {number} id Retweet author identifier
	 * @param {string} nick Retweet author nick
	 * @param {string} av User avatar src
	 */
	tweet.setRetweeter = function(id, nick, av) {
		isRetweet = true;

		retweetedById = id;

		if (retweetedById === timelineId) {
			wrapper.classList.add('me');
		}

		rtAvatarLink.title = twic.utils.lang.translate('title_retweeted_by', '@' + nick);
		rtAvatarLink.href = '#profile#' + nick;

		rtAvatar.src = av;

		rtAvatarLink.style.display = 'block';

		wrapper.classList.add('retweet');
	};

	/**
	 * @return {number}
	 */
	tweet.getAuthorId = function() {
		return authorId;
	};

	/**
	 * @return {string}
	 */
	tweet.getRawText = function() {
		return rawText;
	};

	/**
	 * @return {string}
	 */
	tweet.getAuthorNick = function() {
		return authorNick;
	};

	/**
	 * Get the tweet element
	 * @return {Element}
	 */
	tweet.getElement = function() {
		return wrapper;
	};

	/**
	 * Tweet id
	 * @return {string}
	 */
	tweet.getId = function() {
		return id;
	};

	tweet.isReplying = function() {
		return replier;
	};

	tweet.resetEditor = function() {
		if (replier) {
			replier.close();
			replier = null;
		}
	};

	tweet.getCanRetweet = function() {
		return authorId !== timelineId && retweetedById !== timelineId;
	};

	tweet.getCanUnRetweet = function() {
		return retweetedById === timelineId;
	};

	tweet.getCanDelete = function() {
		return authorId === timelineId;
	};

	tweet.getCanReply = function() {
		return true;
	};

	/**
	 * @param {boolean=} all Reply to all mentioned
	 */
	tweet.reply = function(all) {
		var
			/** @type {string} **/ nickList = '@' + authorNick + ' ';

		if (all) {
			var
				/** @type {string} **/ nick,
				nicks = mentioned;

			if (authorNick.toLowerCase() in nicks) {
				delete nicks[authorNick.toLowerCase()];
			}

			for (nick in nicks) {
				nickList += nicks[nick] + ' ';
			}
		}

		replier = new twic.vcl.TweetEditor(timelineId, replyWrapper, id);
		replier.autoRemovable = true;
		replier.onTweetSend = tweet.onReplySend;
		replier.setConstTextIfEmpty(nickList);
		replier.setFocus();

		replier.onClose = function() {
			replier = null;
		};
	};

};

/**
 * Handler for tweet send process
 * @param {twic.vcl.TweetEditor} editor Editor
 * @param {string} tweetText Tweet text
 * @param {string=} replyTo Reply to tweet
 * @param {function()=} callback Callback
 */
twic.vcl.Tweet.prototype.onReplySend = function(editor, tweetText, replyTo, callback) { };
