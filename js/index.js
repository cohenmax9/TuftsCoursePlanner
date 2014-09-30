//Max Cohen and Jordan Cohen
//July 2, 2014


function setup()
{
	$.ajax({
        type: "GET",
        url: "http://localhost:3000/sendLoginStatus",
        data: {},
        dataType: "text",
        success: function(loggedIn) {
        	var navbar = document.getElementById("nav_bar");
        
        	var home = document.createElement('a');
        	var schedule = document.createElement('a');
        	var login = document.createElement('a');
        	var about = document.createElement('a');

        	home.setAttribute("id", "link-home");
        	schedule.setAttribute("id", "link-schedule");
        	login.setAttribute("id", "link-login");
        	about.setAttribute("id", "link-about");

        	home.setAttribute("href", "/");
        	schedule.setAttribute("href", "/schedule");
        	login.setAttribute("href", "/login");
        	about.setAttribute("href", "/about");

        	home.setAttribute("class", "tw-bs btn btn-default");
        	schedule.setAttribute("class", "tw-bs btn btn-default");
        	login.setAttribute("class", "tw-bs btn btn-default");
			about.setAttribute("class", "tw-bs btn btn-default");
        	
        	home.innerHTML = "Home";
        	schedule.innerHTML = "Schedule";
        	login.innerHTML = "Login";
			about.innerHTML = "About";

			nav_bar.appendChild(home);
			nav_bar.appendChild(schedule);
			nav_bar.appendChild(login);

        	if (loggedIn) {
        		var profile = document.createElement('a');
            	profile.setAttribute("href", "/profile");
            	profile.setAttribute("id", "link-profile");
            	profile.setAttribute("class", "tw-bs btn btn-default");
            	profile.innerHTML = "Profile";

            	nav_bar.appendChild(profile);
	      	}

			nav_bar.appendChild(about);

        },
        error: function() { console.log("Cannot get login status."); }
    });

	constructCart();
}

function reset()
{
	var professor = document.getElementById("professor");
	var course_name = document.getElementById("course_name");
	var semester = document.getElementById("semesters");
	var departments = document.getElementById("departments");

	professor.value = "";
	course_name.value = "";
	semester.selectedIndex = 0;
	departments.selectedIndex = 0;
}

function search()
{
	var professor = document.getElementById("professor").value;
	var course_name = document.getElementById("course_name").value;
	var semester = document.getElementById("semesters").value;
	var departments = document.getElementById("departments").value;

	var course_table = document.getElementById("course_table");
	course_table.setAttribute("style", "background-color: #6699CC");

	addAddtoScheduleButton("add_to_schedule_button");
	addAddtoScheduleButton("add_to_schedule_button2");
	addPrintButton();
	//addHideCourseConflictButton();

	var queryData = new Object();
	queryData["professor"] = professor;
	queryData["course_name"] = course_name;
	queryData["semester"] = semester;
	queryData["departments"] = departments;

	$.ajax({
        type: "GET",
        url: "http://localhost:3000/courses.json",
        data: queryData,
        dataType: "json",
        success: function(data) { 
        	console.log(data);
        	if (queryData["professor"] == "" && queryData["course_name"] == "" && queryData["departments"] == "") {
	        	//var userConfirm = confirm("This search will return every course offered in the " + queryData["semester"] + " semester. This search may take a while. Is this ok?");
	        	//if (userConfirm) {
	        		getAllCourses(queryData, data);
	        	//}
			}
			else {
				getCoursesByQuery(queryData, data);
			}
		},
		error: function() { console.log("Cannot get course data."); }
    });
}

function getAllCourses(queryData, data) 
{
	var table = document.createElement("table");
	var course_table = document.getElementById("course_table");

	var num_courses = document.getElementById("num_courses");
	num_courses.innerHTML = "";

	var course_count = 0;

	table.setAttribute("id", "main_table");
	table.setAttribute("class", "table_style");
	course_table.innerHTML = "";

	header_row = table.insertRow(0);
	header_row.setAttribute("id", "header_row");

	header_row.insertCell(0).innerHTML = "Select";
	header_row.insertCell(1).innerHTML = "Department";
	header_row.insertCell(2).innerHTML = "Course Number";
	header_row.insertCell(3).innerHTML = "Course Name";
	header_row.insertCell(4).innerHTML = "Section";
	header_row.insertCell(5).innerHTML = "Instructor";
	header_row.insertCell(6).innerHTML = "Room";
	header_row.insertCell(7).innerHTML = "Meeting Time";
	
	cell = header_row.insertCell(8);
	cell.setAttribute("colspan", 3);
	cell.innerHTML = "Status";

	Object.keys(data).forEach(function (sem_key) {	//first search by semester key
		if (queryData["semester"] == sem_key) {	
			var sem_courses = data[sem_key];	
			Object.keys(sem_courses).forEach(function (dept_key) {	//second search by department key
				for (i = 0; i < sem_courses[dept_key].courses.length; i++) {	//third search by course name
					course_info = sem_courses[dept_key].courses[i];
					insertCourseInfoIntoTable(table, dept_key, course_info);
					course_count++;
				}
			});
		}
	});

	num_courses.innerHTML = "<p>" + course_count + " results found.</p>"; 
	course_table.appendChild(table);
	
	$("#main_table .course_description").hide();
	$("#main_table tr:first-child").show();
}

function getCoursesByQuery(queryData, data)
{
	var table = document.createElement("table");
	var course_table = document.getElementById("course_table");

	var num_courses = document.getElementById("num_courses");
	num_courses.innerHTML = "";

	table.setAttribute("id", "main_table");
	table.setAttribute("class", "table_style");
	course_table.innerHTML = "";

	header_row = table.insertRow(0);
	header_row.setAttribute("id", "header_row");

	header_row.insertCell(0).innerHTML = "Select";
	header_row.insertCell(1).innerHTML = "Department";
	header_row.insertCell(2).innerHTML = "Course Number";
	header_row.insertCell(3).innerHTML = "Course Name";
	header_row.insertCell(4).innerHTML = "Section";
	header_row.insertCell(5).innerHTML = "Instructor";
	header_row.insertCell(6).innerHTML = "Room";
	header_row.insertCell(7).innerHTML = "Meeting Time";

	cell = header_row.insertCell(8);
	cell.setAttribute("colspan", 3);
	cell.innerHTML = "Status";

	Object.keys(data).forEach(function (sem_key) {	//first search by semester key
		if (queryData["semester"] == sem_key) {	
			var sem_courses = data[sem_key];
			Object.keys(sem_courses).forEach(function (dept_key) {	//second search by department key
				if (queryData["departments"] == sem_courses[dept_key].dept_abbr + " - " + sem_courses[dept_key].dept_name) {	//there is a department specified by the user
					for (var i = 0; i < sem_courses[dept_key].courses.length; i++) {
						if (queryData["professor"] == sem_courses[dept_key].courses[i].instructor) {	//there is a professor specified by the user
							if (queryData["course_name"] == sem_courses[dept_key].courses[i].course_name) {		//department, professor, course name specified by the user
								course_info = sem_courses[dept_key].courses[i];
								insertCourseInfoIntoTable(table, dept_key, course_info);
							}
							else if (queryData["course_name"] == "") {	//department, professor, not course name specified by the user
								course_info = sem_courses[dept_key].courses[i];
								insertCourseInfoIntoTable(table, dept_key, course_info);
							}
						}
						else if (queryData["professor"] == "") {	
							if (queryData["course_name"] == sem_courses[dept_key].courses[i].course_name) {		//department, not professor, course name specified by the user
								course_info = sem_courses[dept_key].courses[i];
								insertCourseInfoIntoTable(table, dept_key, course_info);
							}
							else if (queryData["course_name"] == "") {	//department, not professor, not course name specified by the user
								course_info = sem_courses[dept_key].courses[i];
								insertCourseInfoIntoTable(table, dept_key, course_info);
							}
						}
					}
				}
				else if (queryData["departments"] == "") {	//there is not a department specified by the user
					for (var i = 0; i < sem_courses[dept_key].courses.length; i++) {
						if (queryData["course_name"] == sem_courses[dept_key].courses[i].course_name) { //not department, course name specified by the user
							course_info = sem_courses[dept_key].courses[i];
							insertCourseInfoIntoTable(table, dept_key, course_info);
						}
						else if (queryData["professor"] == sem_courses[dept_key].courses[i].instructor) {	//not department, professor specified by the user
							course_info = sem_courses[dept_key].courses[i];
							insertCourseInfoIntoTable(table, dept_key, course_info);
						}
					}
				}
			});
		}
	});

	if (table.rows.length == 1) {	//if no courses were added to the course table
		course_table.appendChild(document.createTextNode("No course results found."))
	}
	else {
		num_courses.innerHTML = "<p>" + (Math.round(table.rows.length / 2) - 1) + " results found.</p>"; 
		course_table.appendChild(table);

	    $("#main_table .course_description").hide();
	    $("#main_table tr:first-child").show();
	}
}

function insertCourseInfoIntoTable(table, dept_key, course_info)
{
	var checkbox_button = document.createElement("input");

	checkbox_button.setAttribute("class", "select_course");
	checkbox_button.setAttribute("type", "checkbox");
	checkbox_button.setAttribute("name", "select_course");
	checkbox_button.setAttribute("value", "off");

	row = table.insertRow(table.rows.length);

	row.setAttribute("id", (table.rows.length - 1));	//set id of table row to be called "row[j]"
	
	if (table.rows.length % 4 == 0) {	//alternate even and odd taking into accound the accordion rows
		row.setAttribute("class", "odd");
	}
	else {
		row.setAttribute("class", "even");
	}

	//row.setAttribute("onclick", "showCourseRowInfo(this)");

	cell = row.insertCell(0);
	cell.appendChild(checkbox_button);
	cell.setAttribute("id", "checkbox");
	cell = row.insertCell(1);
	cell.innerHTML = dept_key;
	cell.setAttribute("id", "dept_key");
	cell = row.insertCell(2);
	cell.innerHTML = course_info.course_num;
	cell.setAttribute("id", "course_num");
	cell = row.insertCell(3);
	cell.innerHTML = course_info.course_name;
	cell.setAttribute("id", "course_name");
	cell = row.insertCell(4);
	cell.innerHTML = course_info.section;
	cell.setAttribute("id", "section");
	cell = row.insertCell(5);
	cell.innerHTML = course_info.instructor;
	cell.setAttribute("id", "instructor");
	cell = row.insertCell(6);
	cell.innerHTML = course_info.room;
	cell.setAttribute("id", "room");
	cell = row.insertCell(7);
	cell.innerHTML = course_info.days + " " + readableTime(course_info.start_time) + " - " + readableTime(course_info.end_time);
	cell.setAttribute("id", "meeting_times");
	cell = row.insertCell(8);
	cell.innerHTML = course_info.status;
	cell.setAttribute("id", "status");
	cell = row.insertCell(9);
	cell.setAttribute("id", "json_time");
	cell.setAttribute("style", "display: none;");
	cell.innerHTML = "[\"" + course_info.days + "\", \"" + course_info.start_time + "\", \"" + course_info.end_time + "\"]";
	cell = row.insertCell(10);

	div = document.createElement("div");
	div.setAttribute("class", "arrow");

	cell.appendChild(div);

	row = table.insertRow(table.rows.length);
	row.setAttribute("id", (table.rows.length - 1));	//set id of table row to be called "row[j]"
	row.setAttribute("class", "course_description");

	cell = row.insertCell(0);
	cell.setAttribute("colspan", 11);
	cell.innerHTML = course_info.description;

}

function addToSchedule()
{
	var checkboxes = document.getElementsByClassName("select_course");
	var rowsNodeList = document.getElementById("main_table").rows;
	var rows = Array.prototype.slice.call(rowsNodeList);

	$.ajax({
		type: "GET",
		dataType: "text",
		url: "http://localhost:3000/sendcart",
		data: {},
		success: function (cur_schedule) { 
			var parsed_schedule = JSON.parse(cur_schedule);
			var courses = parsed_schedule.courses; 
			for (var i = 1; i < rows.length; i += 2) {	// i += 2 to avoid course description rows 
				var cur_checkbox = rows[i].children[0].children[0];
				var cur_course_id = parseCourseID(rows[i].children[4].innerHTML);
				var j = 0;

				if (cur_checkbox.checked) {
					do {
						if (courses.length != 0) {
							var schedule_course_id = parseInt(courses[j].course_id);
						}

						if (cur_course_id == schedule_course_id) {
							cur_checkbox.checked = false;
							row = rowsNodeList[i];
							displayNotification(row, "warn");
							break;
						}

						if (courses.length == 0 || j == courses.length - 1) {	//If there are no courses in the cart or there hasn't been a course_id match by the end of the cart length, add the course
							cur_checkbox.checked = false;
							row = rowsNodeList[i];
							displayNotification(row, "success");
							addCourse(row, courses);
							break;
						}

						j++;
					}
					while (j < courses.length);
				}
			}

		},
		error: function () { console.log("Error getting current scheudle from database"); }
	});
}

function displayNotification(row, notificationType) 
{
	if (notificationType == "success") {
		$.notify("Added " + row.children[1].innerHTML + " " + row.children[2].innerHTML + " to your schedule.", notificationType);
	}
	else if (notificationType == "warn") {
		$.notify(row.children[1].innerHTML + " " + row.children[2].innerHTML + " is already in your schedule.", notificationType);
	}
}

function addCourse(row, cur_courses)
{
	var course_data = new Array();

	var courseID = parseCourseID(row.children[4].innerHTML);
	var dept_course_num = row.children[1].innerHTML + " " + row.children[2].innerHTML;
	var course_name = row.children[3].innerHTML;
	var section = row.children[4].innerHTML;
	var instructor = row.children[5].innerHTML;
	var room = row.children[6].innerHTML;
	var json_time = row.children[9].innerHTML;

	var json_time_array = JSON.parse(json_time);

	var days = json_time_array[0];
	var start_time = json_time_array[1];
	var end_time = json_time_array[2];

	var scheduleCourseID = cur_courses.length;
	var start;
	var end;
	var curNumClasses = cur_courses.length;		//curNumClasses is the current number of class events (some classes are 2 days a week, some 3 days a week)

	var j = 0;

	for (var i = 0; i < days.length - 1; i+=2) {
		day = days.substring(i, i+2);
		start = constructDateObject(start_time, day);
		end = constructDateObject(end_time, day);
		course_data[j] = {"course_id": courseID, "id": curNumClasses + j, "day": day, "start": start, "end": end, "title": course_name, "instructor": instructor, "room": room, "dept_course_num": dept_course_num};
		j++;
	}

    $.ajax({
	    type: "POST",
	    dataType: "text", 
	    url: "http://localhost:3000/schedule.json",
	    data: { "events" : course_data },
	    success: function(cur_schedule) { 
	    	$( "#cart" ).draggable()

	    	var parsed_schedule = JSON.parse(cur_schedule);
			var cart_table = document.getElementById("cart");

			cart_table.innerHTML = "";

			var table = document.createElement("table");
			table.setAttribute("id", "cart_table");
			table.setAttribute("class", "table_style");

			header_row = table.insertRow(0);
			header_row.insertCell(0).innerHTML = "Course No.";
			header_row.insertCell(1).innerHTML = "Course Name";
			header_row.insertCell(2).innerHTML = "";
			header_row.setAttribute("id", "header_row");
			header_row.setAttribute("class", "nodrag nodrop");

			var unique_courses = getUniqueCourses(parsed_schedule);

			for (var i = 0; i < unique_courses.length; i++) {
				var row = table.insertRow(i + 1);
				row.insertCell(0).innerHTML = unique_courses[i].dept_course_num;
				row.insertCell(1).innerHTML = unique_courses[i].title;

				var remove_button_td = row.insertCell(2);
				var a = document.createElement("a");
				a.setAttribute("onclick", "removeCourse(" + unique_courses[i].course_id + ")");
				var img = document.createElement("img");
				img.setAttribute("src", "../images/remove_button.png");
				img.setAttribute("height", 10);
				img.setAttribute("width", 10);

				a.appendChild(img);
				remove_button_td.appendChild(a);

				var hidden_cell = row.insertCell(3);
				hidden_cell.innerHTML = unique_courses[i].course_id;
				hidden_cell.setAttribute("style", "display: none");
			}

			cart_table.appendChild(table);
			$( "#cart_table" ).tableDnD({
				onDrop: function(table, row) {
					console.log(table.rows);

					var new_order = new Array();

					for (var i = 1; i < table.rows.length; i++)	{	//Make and array of the new order of the courses of course_ids
						new_order[i] = table.rows[i].cells[3].innerHTML;
					}

					$.ajax({
					    type: "POST",
					    dataType: "text", 
					    url: "http://localhost:3000/carts/reorder",
					    data: {"new_order": new_order},
					    success: function() {
							console.log("Misson Complete!");
						},
						error: function () { console.log("Couldn't reorder cart"); }
					});
				}
			});
			$( "#cart" ).draggable();
	    },
	    error: function() { console.log("Failed to post course data to server"); }
    });
}

function constructCart()
{
	$.ajax({
		type: "GET",
		dataType: "text",
		url: "http://localhost:3000/sendcart",
		data: {},
		success: function (cur_schedule) { 
			var parsed_schedule = JSON.parse(cur_schedule);
			var cart_table = document.getElementById("cart");

			cart_table.innerHTML = "";

			var table = document.createElement("table");
			table.setAttribute("id", "cart_table");
			table.setAttribute("class", "table_style");

			header_row = table.insertRow(0);
			header_row.insertCell(0).innerHTML = "Course No.";
			header_row.insertCell(1).innerHTML = "Course Name";
			header_row.insertCell(2).innerHTML = "";
			header_row.setAttribute("id", "header_row");
			header_row.setAttribute("class", "nodrag nodrop");

			var unique_courses = getUniqueCourses(parsed_schedule);

			for (var i = 0; i < unique_courses.length; i++) {
				var row = table.insertRow(i + 1);
				row.insertCell(0).innerHTML = unique_courses[i].dept_course_num;
				row.insertCell(1).innerHTML = unique_courses[i].title;

				var remove_button_td = row.insertCell(2);
				var a = document.createElement("a");
				a.setAttribute("onclick", "removeCourse(" + unique_courses[i].course_id + ")");
				var img = document.createElement("img");
				img.setAttribute("src", "../images/remove_button.png");
				img.setAttribute("height", 10);
				img.setAttribute("width", 10);

				a.appendChild(img);
				remove_button_td.appendChild(a);

				var hidden_cell = row.insertCell(3);
				hidden_cell.innerHTML = unique_courses[i].course_id;
				hidden_cell.setAttribute("style", "display: none");
			}

			cart_table.appendChild(table);			
			$( "#cart_table" ).tableDnD({
				onDrop: function(table, row) {
					console.log(table.rows);

					var new_order = new Array();

					for (var i = 1; i < table.rows.length; i++)	{	//Make and array of the new order of the courses of course_ids
						new_order[i] = table.rows[i].cells[3].innerHTML;
					}

					$.ajax({
					    type: "POST",
					    dataType: "text", 
					    url: "http://localhost:3000/carts/reorder",
					    data: {"new_order": new_order},
					    success: function() {
							console.log("Misson Complete!");
						},
						error: function () { console.log("Couldn't reorder cart"); }
					});
				}
			});
			$( "#cart" ).draggable();
		},
		error: function () { console.log("Couldn't get cart"); }
	});
}

function removeCourse(remove_course_id)
{
	$.ajax({
	    type: "POST",
	    dataType: "text", 
	    url: "http://localhost:3000/carts/remove",
	    data: {"remove_course_id": remove_course_id},
	    success: function(cur_schedule) {
	    	$( "#cart" ).draggable();
	    	
	    	var parsed_schedule = JSON.parse(cur_schedule);
			var cart_table = document.getElementById("cart");

			cart_table.innerHTML = "";

			var table = document.createElement("table");
			table.setAttribute("id", "cart_table");
			table.setAttribute("class", "table_style");

			header_row = table.insertRow(0);
			header_row.insertCell(0).innerHTML = "Course No.";
			header_row.insertCell(1).innerHTML = "Course Name";
			header_row.insertCell(2).innerHTML = "";
			header_row.setAttribute("id", "header_row");
			header_row.setAttribute("class", "nodrag nodrop");

			var unique_courses = getUniqueCourses(parsed_schedule);

			for (var i = 0; i < unique_courses.length; i++) {
				var row = table.insertRow(i + 1);
				row.insertCell(0).innerHTML = unique_courses[i].dept_course_num;
				row.insertCell(1).innerHTML = unique_courses[i].title;

				var remove_button_td = row.insertCell(2);
				var a = document.createElement("a");
				a.setAttribute("onclick", "removeCourse(" + unique_courses[i].course_id + ")");
				var img = document.createElement("img");
				img.setAttribute("src", "../images/remove_button.png");
				img.setAttribute("height", 10);
				img.setAttribute("width", 10);

				a.appendChild(img);
				remove_button_td.appendChild(a);

				var hidden_cell = row.insertCell(3);
				hidden_cell.innerHTML = unique_courses[i].course_id;
				hidden_cell.setAttribute("style", "display: none");
			}

			cart_table.appendChild(table);
			$( "#cart_table" ).tableDnD({
				onDrop: function(table, row) {
					console.log(table.rows);

					var new_order = new Array();

					for (var i = 1; i < table.rows.length; i++)	{	//Make and array of the new order of the courses of course_ids
						new_order[i] = table.rows[i].cells[3].innerHTML;
					}

					$.ajax({
					    type: "POST",
					    dataType: "text", 
					    url: "http://localhost:3000/carts/reorder",
					    data: {"new_order": new_order},
					    success: function() {
							console.log("Misson Complete!");
						},
						error: function () { console.log("Couldn't reorder cart"); }
					});
				}
			});
			$( "#cart" ).draggable();
		},
	    error: function() { console.log("Failure"); }
    });
}

function findObjectByKey(array, key, value) 
{
    for (var i = 0; i < array.length; i++) {
        if (parseInt(array[i][key]) == parseInt(value)) {
            return array[i];
        }
    }
    return null;
}

function getUniqueCourses(cart)
{
	var unique_courses = new Array();
	var j = 0;

	for (var i = 0; i < cart.courses.length; i++) {
		var cur_course = findObjectByKey(unique_courses, "course_id", cart.courses[i].course_id);
		if (cur_course == null) {
			unique_courses[j] = cart.courses[i];
			j++;
		}
	}

	return unique_courses;
}

function addAddtoScheduleButton(id_name)
{
	var add_to_schedule = document.getElementById(id_name);

	add_to_schedule.innerHTML = "";

	var addtoschedule_button = document.createElement("input");
	addtoschedule_button.setAttribute("type", "submit");
	addtoschedule_button.setAttribute("name", "add_to_schedule");
	addtoschedule_button.setAttribute("value", "Add to Schedule");
	addtoschedule_button.setAttribute("onclick", "addToSchedule()");

	add_to_schedule.appendChild(addtoschedule_button);
}

function addPrintButton()
{
	var print = document.getElementById("print_button");
	print.innerHTML = "";

	var print_button = document.createElement("a");
	print_button.setAttribute("class", "noprint");
	print_button.setAttribute("onclick", "window.print(); return false");

	var print_image = document.createElement("img");
	print_image.setAttribute("src", "../images/print_button.png");

	print_button.appendChild(print_image);
	print.appendChild(print_button);
}
/*
function addHideCourseConflictButton()
{
	var course_conflicts_div = document.getElementById("course_conflicts_button");
	course_conflicts_div.innerHTML = "";

	var course_conflicts_button = document.createElement("input");
	course_conflicts_button.setAttribute("type", "button");
	course_conflicts_button.setAttribute("name", "hide_course_conflicts");
	course_conflicts_button.setAttribute("value", "Hide Course Conflicts");
	course_conflicts_button.setAttribute("onclick", "hideCourseConflicts()");

	course_conflicts_div.appendChild(course_conflicts_button);

}
*/

function showCourseRowInfo(row)
{
    var course_row_num = parseInt(row.id); 
    var course_selector = "#" + course_row_num;
    var description_row_num = course_row_num + 1;
    var description_selector = "#" + description_row_num;

    $( description_selector ).toggle();
    $( course_selector ).find(".arrow").toggleClass("up");
}

function readableTime(time)
{
	var hour = time.substring(0, 2); 
	var min = time.substring(4, 6);

	if (hour > 12) {
		hour -= 12;
		return hour + ":" + min + "PM";
	}

	return hour + ":" + min + "AM";
}

function constructDateObject(time, course_day)	
{
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
	var day = new Date().getDate();
	var hour = time.substring(0, 2);
	var min = time.substring(4, 6);

	var day_of_week = new Date().getDay();
	var day_num = weekdayToNumberValue(course_day);
	var this_sunday = day - day_of_week;

	return new Date(year, month, this_sunday + day_num, hour, min);		//return the day relative to this week's Sunday, adjust hour to Eastern Time (EST)
}

function weekdayToNumberValue(day)
{
	switch (day) {
		case "Su":
			return 0;
		case "Mo":
			return 1;
		case "Tu":
			return 2;
		case "We":
			return 3;
		case "Th":
			return 4;
		case "Fr":
			return 5;
		case "Sa":
			return 6;
		default:
			return 0;
	}
}

function parseCourseID(id) 
{
	return id.substring(7, 12);
}



function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}


function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}

function getCookie(name)
{
	name += '=';
	var parts = document.cookie.split(/;\s*/);
	for (var i = 0; i < parts.length; i++)
	{
	  var part = parts[i];
	  if (part.indexOf(name) == 0)
		  return part.substring(name.length)
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
