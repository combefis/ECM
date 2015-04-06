'use strict';

function arrayify(text){
  console.log(text);
  if(text === undefined) return [''];
  if(text === '') return [''];
  else return text.split(',');
}

// Students controller
angular.module('students').controller('StudentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Students',
	function($scope, $stateParams, $location, Authentication, Students) {
		$scope.authentication = Authentication;

		// Create new Student
		$scope.create = function() {
			// Create new Student object
			var student = new Students ({
				first_name: this.first_name,
        last_name: this.last_name,
        middle_names : arrayify(this.middle_names),
        groups : arrayify(this.groups),
        matricule: this.matricule
			});

			// Redirect after save
			student.$save(function(response) {
				$location.path('students/' + response.matricule);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Student
		$scope.remove = function(student) {
			if ( student ) { 
				student.$remove();

				for (var i in $scope.students) {
					if ($scope.students [i] === student) {
						$scope.students.splice(i, 1);
					}
				}
			} else {
				$scope.student.$remove(function() {
					$location.path('students');
				});
			}
		};

		// Update existing Student
		$scope.update = function() {
			var student = $scope.student;

			student.$update(function() {
				$location.path('students/' + student.matricule);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Students
		$scope.find = function() {
			$scope.students = Students.query();
		};

		// Find existing Student
		$scope.findOne = function() {
			$scope.student = Students.get({ 
				studentId: $stateParams.studentId
			});
		};
	}
]);