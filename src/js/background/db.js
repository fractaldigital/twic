/**
 * Kalashnikov Igor <igor.kalashnikov@gmail.com>
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */
twic.db = ( function() {

	var migrations = {
		'0': {
			version: '0.01',
			callback: function(t) {
				t.executeSql('create table accounts (nick text primary key not null);');
			}
		}
	};

	/**
	 * Migration procedure
	 * @param {Database} db Database
	 * @param {string} ver Source database version
	 */
	var migrate = function(db, ver) {
		var version = (ver == '') ? '0' : ver;

		if (version in migrations) {
			var migration = migrations[version];

			db.changeVersion(ver, migration.version, function(t) {
				migration.callback(t);
			}, function() {
				migrate(db, migration.version);							
			} );
		}
	};
	
	var database = null;
	
	var getDatabase = function() {
		if (!database) {
			database = openDatabase(h.name, '', h.name, null);
			migrate(database, database.version);
		}
		
		return database;
	};

	return {
		/**
		 * Transaction
		 * @param {function(SQLTransactionCallback)}
		 */
		transaction: function(callback) {
			getDatabase().transaction(callback);
		},
		/**
		 * Read-only transaction
		 * @param {function(SQLTransactionCallback)}
		 */
		readTransaction: function(callback) {
			getDatabase().readTransaction(callback);
		}
	};

} )();