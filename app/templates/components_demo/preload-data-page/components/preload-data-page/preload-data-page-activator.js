define(['jquery', 'modaler'], 
	function($, modaler) {
		'use strict';

		var Activator = function() {
		};

		Activator.prototype.activate = function() {
			var deferred = new $.Deferred();

			modaler.showModal('loading');
			setTimeout(function() {
				deferred.resolve({
					message: 'Loaded some data...'
				});
				modaler.hideCurrentModal();
			}, 2000);

			return deferred.promise();
		};

		return new Activator();
	});