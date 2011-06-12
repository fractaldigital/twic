/**
 * Database object model
 *
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

twic.data.model = twic.data.model || { };

/**
 * @constructor
 */
twic.DataModel = function() {
	this.storeName = '';
	this.keyName   = '';
	this.fields    = { };
};
