/**
 * Router object
 * Handle page switching in popup
 *
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

twic.router = ( function() {

	var
		self = { },
		/** @type {Object} */ frames = { },
		/** @type {string} */ currentFrame,
		/** @type {Array.<string>} */ location = [],
		/** @type {Array.<string>} */ previousLocation = [],
		i;

	var tmp = document.querySelectorAll('div.page');
	for (i = 0; i < tmp.length; ++i) {
		var frame = tmp[i];
		frames[frame.id] = {
			frame: frame,
			callbacks: [],
			init: false
		};
	}

	// ----------------------------------------------------

	/**
	 * Change the frame
	 * @param {string} targetFrameName Target frame names
	 * @param {Array.<string>} data Data from url
	 */
	var changeFrame = function(targetFrameName, data) {
		var
			frame = frames[targetFrameName],
			i;

		if (currentFrame) {
			twic.dom.setVisibility(frames[currentFrame].frame, false);
		}

		if (frame) {
			currentFrame = targetFrameName;

			for (i = 0; i < frame.callbacks.length; ++i) {
				frame.callbacks[i].call(self, data);
			}

			frame.frame.style.display = 'block';
		} else {
			console.error('Frame ' + targetFrameName + ' not found');
		}
	};

	// ----------------------------------------------------

	window.onhashchange = function() {
		// store the previous location
		previousLocation = location;

		location = window.location.hash.split('#');
		location.shift();

		var trg = location[0];

		if (
			trg
			&& currentFrame !== trg
			&& frames[trg]
		) {
			changeFrame(trg, location.slice(1));
		}
	};

	/**
	 * @param {string} frameName Frame names
	 * @param {function()} callback Callback function
	 */
	self.handle = function(frameName, callback) {
		frames[frameName].callbacks.push(callback);
	};

	/**
	 * Get the previous frame names
	 * @return {Array.<string>}
	 */
	self.previous = function() {
		return previousLocation;
	};

	/**
	 * init the page for the first time
	 * @param {function()} callback
	 */
	self.initOnce = function(callback) {
		if (
			!frames[currentFrame]
			|| frames[currentFrame].init
		) {
			return;
		}

		frames[currentFrame].init = true;
		callback();
	};

	/**
	 * Remember the page to open it next time popup is open
	 */
	self.remember = function() {
		window.localStorage.setItem('location', location.join('#'));
	};

	return self;

}());
