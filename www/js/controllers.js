/*		
*	Author:	Dermot Bohan	
*	Assignment:	WE4	Mobile	Web	Applications,	Digital	Skills	Academy	
*	Date	:	2016/07/06	
	
//Code	reuse		
//
//		Ref: http://www.w3schools.com/angular/angular_routing.asp 									
//		Ref: http://v4-alpha.getbootstrap.com/components/buttons/ 									
//		Ref: http://www.w3schools.com/bootstrap/bootstrap_buttons.asp 								
//		Ref: https://docs.angularjs.org/guide/controller 											
//		Ref: https://docs.angularjs.org/guide/filter												
//		Ref: https://www.kirupa.com/html5/storing_and_retrieving_an_array_from_local_storage.htm 	
//
	
*/












	// Creating Anglular Module:
	var app = angular.module('myToDoList',['ngRoute']); 

	app.filter('toDoFilter', function () {						// creating personalized filter
	    return function (items, priority, tag) {					// return the results of the following function

	        var priorityTagList = [];									// create new array
	    	
	    	//bypass if all is selected.
			if((priority=='all'||'') && (tag=='all'||'')){

				return items;

			};

			for (var i = 0; i < items.length; i++) {

				if(
					(priority=='all' && items[i].tag==tag)
					||
					(items[i].priority==priority && tag=='all')
					||
					(items[i].priority==priority && items[i].tag==tag)

				){priorityTagList.push(items[i]);};

			}

	        return priorityTagList;										// return the filled array
	 
	    };																// end function
	
	});





	app.config(['$routeProvider', function($routeProvider){				// Configuring Viewing Route:	
	
		$routeProvider
			.when('/',{templateUrl:"partials/filteredList.html"})
			.when('/new',{templateUrl:"partials/newForm.html"})
			.otherwise({redirectTo:'/'});
	
	}]);

	app.controller('toDoCtrl', function($scope){						// Creating Controller:

		$scope.prioritySelect = 'all';									// Initializing Filtered Items : All
		$scope.tagSelect = 'all';										// Initializing Filtered ITems : All

/*		
		$scope.toDoItems = [

 			//Details for testing purposes
			{subject:'priority - low & tag - leisure', details:"test details", priority:'low', tag: 'leisure', status:true},
			{subject:'priority - low & tag - family', details:"test details", priority:'low', tag: 'family', status:false},
			{subject:'priority - low & tag - work', details:"test details", priority:'low', tag: 'work', status:true},
			{subject:'priority - med & tag - leisure', details:"test details", priority:'med',	tag: 'leisure', status:false},
			{subject:'priority - med & tag - family', details:"test details", priority:'med', tag: 'family', status:true},
			{subject:'priority - med & tag - work', details:"test details", priority:'med', tag: 'work', status:false},
			{subject:'priority - high & tag - leisure', details:"test details", priority:'high', tag: 'leisure', status:true},
			{subject:'priority - high & tag - family', details:"test details", priority:'high', tag: 'family', status:false},
			{subject:'priority - high & tag - work', details:"test details", priority:'high', tag: 'work', status:true}

	    ];			
*/
	    // status true = complete
	    // status false = incomplete - looking for this for the most part.

		$scope.initialize = function(){

			$scope.toDoItems = [];			// Create List Array
			retrieveArray();				// Load To Do List Items
			$scope.viewAll = false;			// Override is off
			$scope.viewState = 0;			// Initial list is comprised of incomplete items
			$scope.viewType = false;		// Display incomplete items
		};


	    
	    function updateArray(){

			// store $scope.toDoItems array as a string in local storage, named toDoListStored
			localStorage.setItem("toDoListStored", JSON.stringify($scope.toDoItems));
			retrieveArray();

		};

		function retrieveArray(){

			// retrieve saved JSON string data of $scope array and convert it back into an array.
			var retrievedData = localStorage.getItem("toDoListStored");		// Retrieve string data from local storeage
			$scope.toDoItems = JSON.parse(retrievedData);					// Populate List Array

	    };

		$scope.toDoListAdd = function(a,b,c,d) {

	        $scope.toDoItems.push({	subject:a, 					
	        						details:b, 
	        						priority:c, 
	        						tag:d, 
	        						status:false});
	        																// Add these details onto $scope.toDoItems Array
			updateArray();

	    };

		$scope.deleteListItem = function(e){

			$scope.toDoItems.splice(e, 1);
			updateArray();
 
		};


		$scope.updateStatus = function(e){

			updateArray();
			window.location.reload(true);									// Reload page to make changes take effect.
			

		};

		$scope.changeViewState = function(){		// Change viewType when "Viewing State" button is clicked
													// Initial = 0 = Incomplete Tasks; 1 = complete & Incomplete; 2 = Complte tasks
			
			$scope.viewState = $scope.viewState + 1;
			if($scope.viewState >= 3){$scope.viewState = 0};
			changeViewText();

		};
	
		function changeViewText(){

			switch($scope.viewState){

				case 0:
				document.getElementById("viewText").innerHTML = "VIEWING INCOMPLETE TASKS ONLY";
				$scope.viewAll = false;
				$scope.viewType = false;
				break;
				
				case 1:
				document.getElementById("viewText").innerHTML = "VIEWING INCOMPLETE AND COMPLETE TASKS";
				$scope.viewAll = true;	
				break;

				case 2:
				document.getElementById("viewText").innerHTML = "VIEWING COMPLETE TASKS ONLY";
				$scope.viewAll = false;	
				$scope.viewType = true;
				break;

			};
		
		};

		
		$scope.show = function(e){			// Establish if the viewer wants to see complete or incomplete items (viewType)
											// Then see if the viewer override (viewAll) is active.
											
//											(e) returns the status of the current item, true for complete, false for incomplete.
//											if($scope.viewType == 0){User wants to see incomplete items};
//											if($scope.viewType == 1){User wants to see complete items}
//											if(e == viewType){the user wants to see the item, therefore set }			 			
			
			var result;								
			if(e == $scope.viewType){result = true}else{result = false};
			if(result || $scope.viewAll){return true}else{return false};
			
		};


		$scope.prioritySelected = function(e){

			$scope.prioritySelect = e;				// Set info for filtering: all, low, med, high

		};
		
		$scope.tagSelected = function(e){
			
			$scope.tagSelect = e;					// Set info for filtering: all, leisure, family, work

		};
		

	});
	// .End of controller