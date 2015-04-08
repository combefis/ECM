'use strict';

// Configuring the Articles module
angular.module('students').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Students', 'students', 'dropdown', '/students(/create)?', false, ['admin', 'manager']);
		Menus.addSubMenuItem('topbar', 'students', 'List Students', 'students');
		Menus.addSubMenuItem('topbar', 'students', 'New Student', 'students/create');
	}
]);
