/**
 * Options model
 *
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

/**
 * @constructor
 * @extends twic.DataModel
 */
twic.data.model.Options = function() {
	var self = this;

	twic.DataModel.call(self);

	self.storeName = 'options';

	self.fields = {
		'key': '',
		'value': ''
	};
};

goog.inherits(twic.data.model.Options, twic.DataModel);

twic.data.register(twic.data.model.Options);
