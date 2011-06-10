/**
 * Object to work with data
 *
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

twic.data = ( function() {

	var
		models = { },
		self = this;

	self.register = function(ctor) {
		var
			model = new ctor();

		models[model.storeName] = model;
	};

	var upgrade = function(db, func) {
		if ('' === db.version) {
			var
				request = db.setVersion('1');

			request.onerror = function(e) { console.dir(e); };
			request.onsuccess = function() {
				var
					store = db.createObjectStore('options', {
						keyPath: 'key'
					} );

					upgrade(db, func);
			};
		} else {
			func.call(db);
		}
	};

	var process = function(func) {
		var
			request = webkitIndexedDB.open(twic.name);

		request.onerror = function(e) {
			console.dir(e);
		};

		request.onsuccess = function() {
			var
				database = request.result;

			if (database.version != version) {
				upgrade(database, func);
			} else {
				func.call(database);
			}
		};
	};

	process( function() {
	} );

}() );
