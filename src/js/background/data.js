/**
 * Object to work with data
 *
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

twic.data = ( function() {

	var
		self = { },
		migrations = {
			'0': {
				version: '1',
				migrate: function(db, req, callback) {
					db.createObjectStore('options', { 'keyPath': 'key' } );
					callback();
				}
			}
		};

	var upgrade = function(db, func) {
		var
			version = '' !== db.version ? db.version : '0';;

		if (version in migrations) {
			var
				migration = migrations[version],
				req = db.setVersion(migration.version);

			req.onerror = function(e) { console.dir(e); };
			req.onsuccess = function() {
				twic.debug.log('Migration to the version ' + migration.version);

				migration.migrate(db, req, function() {
					upgrade(db, func);
				} );
			};
		} else {
			func.call(db);
		}
	};

	self.process = function(func) {
		var
			request = webkitIndexedDB.open(twic.name);

		request.onerror = function(e) { console.dir(e); };
		request.onsuccess = function() {
			var
				database = request.result;

			upgrade(database, func);
		};
	};

	return self;

}() );
