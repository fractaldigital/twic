/**
 * Options
 *
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

( function() {

	var
		i,
		keys = twic.dom.findElements('ul.options[data-key]');

	for (i = 0; i < keys.length; ++i) {
		var
			optKey = keys[i],
			values = twic.dom.findElements('li[data-value]', optKey);

		twic.options.get(optKey.getAttribute('data-key'), function(val) {
			for (var n = 0; n < values.length; ++n) {
				if (val == values[n].getAttribute('data-value')) {
					values[n].classList.add('selected');
					break;
				}
			}
		} );
	};

	keys = twic.dom.findElements('input[data-key]');

	twic.utils.queueIterator(keys, function(item, callback) {
		twic.options.get(item.getAttribute('data-key'), function(val) {
			if (val) {
				item.setAttribute('checked', 'checked');
			}

			callback();
		} );
	}, function() { } );

	var findParentOption = function(trgElement) {
		if (trgElement.getAttribute('data-value')) {
			return trgElement;
		}

		if (trgElement.parentElement) {
			return findParentOption(trgElement.parentElement);
		}
	};

	document.addEventListener('change', function(e) {
		if ('INPUT' === e.target.nodeName) {
			twic.options.set(e.target.getAttribute('data-key'), e.target['checked']);
		}
	}, false );

	document.addEventListener('click', function(e) {
		var
			optElement = findParentOption(e.target);

		if (!optElement) {
			return;
		}

		var
			optKeyElement = optElement.parentElement,
			optValue = optElement.getAttribute('data-value'),
			optValues = twic.dom.findElements('li[data-value]', optKeyElement),
			optKey = optKeyElement.getAttribute('data-key');

		twic.options.set(optKey, optValue);

		for (var n = 0; n < optValues.length; ++n) {
			if (optValues[n] == optValue) {
				continue;
			} else {
				optValues[n].classList.remove('selected');
			}
		}

		optElement.classList.add('selected');
	}, false);

}() );
