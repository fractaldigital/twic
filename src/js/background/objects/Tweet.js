/**
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

/**
 * @constructor
 * @extends twic.DBObject
 */
twic.db.obj.Tweet = function() {
	var self = this;

	twic.DBObject.call(self);

	/** @const **/ self.table = 'tweets';
	self.fields = {
		'id': '',
		'user_id': 0,
		'reply_to': null,
		'dt': twic.utils.date.getCurrentTimestamp(),
		'retweeted_user_id': null,
		'msg': '',
		'source': ''
	};

	self.jsonMap = {
		'id': 'id_str',
		'reply_to': 'in_reply_to_status_id_str',

		'msg': function(obj) {
			return obj['retweeted_status'] ? obj['retweeted_status']['text'] : obj['text'];
		},
		'dt': function(obj) {
			return twic.utils.date.getTimestamp(new Date(obj['created_at']));
		},
		'user_id': function(obj) {
			return obj['user']['id'];
		},
		'retweeted_user_id': function(obj) {
			return obj['retweeted_status'] ? obj['retweeted_status']['user']['id'] : null;
		}
	};
};

goog.inherits(twic.db.obj.Tweet, twic.DBObject);

/**
 * Overriden remove method to remove timeline items too
 * @param {function()} callback Callback function
 * @override
 */
twic.db.obj.Tweet.prototype.remove = function(callback) {
	var
		self = this;

	twic.db.execQuery('delete from timeline where tweet_id = ?', [self.fields['id']], function() {
		twic.DBObject.prototype.remove.call(self, callback);
	} );
};
