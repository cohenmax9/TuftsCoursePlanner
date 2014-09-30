// app/routes.js

var User = require('../app/models/user.js');
var Cart = require('../app/models/cart.js');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, passport) {
	// enable cross origin resource sharing
	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	app.get('/', function (req, res) {
		var cart_id;

		if (req.isAuthenticated()) {	//If the user is logged in
			cart_id = new ObjectID(req.user.cart);
		}
		else if (req.cookies.cart != null) {
			cart_id = new ObjectID(req.cookies.cart);
		}
		
		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("Making new Cart index");
				var newCart = new Cart();
				newCart.courses = new Array();
				cart_id_str = newCart._id.toString();
				console.log("new cart id: " + cart_id_str);

				res.cookie("cart", cart_id_str, { expires: new Date(Date.now() + 126144000000) });
				
				// save the cart
                newCart.save(function (err, saved_cart, numberAffected) {
                	if (err) {
                		console.log("Could not save the new Cart to the database");
                	}
                	if (numberAffected == 0) {
                		console.log("Not changed.");
                	}
                	else {
                		//console.log("newCart index:");
                		//console.log(saved_cart);
                	}
                });
			}
			else {
				cart_id_str = cart_id.toString();
				res.cookie("cart", cart_id_str, { expires: new Date(Date.now() + 126144000000) });	
				//console.log(dbcart);	
			}

			res.render('index.ejs');
		});
	});

	app.get('/schedule', function (req, res) {
		var cart_id;

		if (req.isAuthenticated()) {	//If the user is logged in
			cart_id = new ObjectID(req.user.cart);
		}
		else {
			cart_id = new ObjectID(req.cookies.cart);
		}

		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("dbcart is null schedule");
			}
			else {
				var cur_schedule = dbcart.courses;
				var updated_time_schedule = new Array();

				for (var i = 0; i < cur_schedule.length; i++) {
					updated_time_schedule[i] = new Object();
					updated_time_schedule[i].title = cur_schedule[i].title;
					updated_time_schedule[i].instructor = cur_schedule[i].instructor;
					updated_time_schedule[i].room = cur_schedule[i].room;
					updated_time_schedule[i].day = cur_schedule[i].day;
					updated_time_schedule[i].dept_course_num = cur_schedule[i].dept_course_num;
					updated_time_schedule[i].id = cur_schedule[i].id;
					updated_time_schedule[i].course_id = cur_schedule[i].course_id;

					var cur_date = new Date();

					if (Date.parse(cur_date) - Date.parse(cur_schedule[i].start) >= 86400000) {	//If the date stored in the schedule is more than a day old, make the date relative to this week
						updated_time_schedule[i].start = dateRelativeToThisWeek(cur_schedule[i].start);
						updated_time_schedule[i].end = dateRelativeToThisWeek(cur_schedule[i].end);
					}
					else {
						updated_time_schedule[i].start = cur_schedule[i].start;
						updated_time_schedule[i].end = cur_schedule[i].end;
					}
				}

				dbcart.courses = updated_time_schedule;

				dbcart.save(function (err, saved_cart, numberAffected) {
					if (err) {
                		console.log("Could not save the updated Cart to the database");
                	}
                	if (numberAffected == 0) {
                		console.log("Cart not updated because the start and end times were all relative to this week.");
                	}
                	else {
                		console.log(saved_cart);
                	}
				});
			}
		});
		
		res.render('schedule.ejs');
	});

	app.post("/schedule.json", function (req, res) {
		if (req.isAuthenticated()) {	//If the user is logged in
			cart_id = new ObjectID(req.user.cart);
		}
		else {
			cart_id = new ObjectID(req.cookies.cart);
		}

		var new_schedule = req.body.events;
		//console.log(new_schedule);

		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("dbcart is null schedule.json");
			}
			else {
				var cur_schedule = dbcart.courses;
				var add_courses = new Array();  
				var k = 0;

				for (var i = 0; i < new_schedule.length; i++) {		//make sure the same course doesn't get added more than once
					var new_course = new_schedule[i];
					var cur_course = findObjectByKey(cur_schedule, "course_id", new_course.course_id);

					if (cur_course == null) {	//if the course_id isn't already in the schedule, add the course to the array that will be inserted
						add_courses[k] = new_course;
						k++;
					}
				}

				var updated_schedule = cur_schedule.concat(add_courses);
				dbcart.courses = updated_schedule;

				// save the cart
                dbcart.save(function (err, saved_cart, numberAffected) {
                	if (err) {
                		console.log("Could not save the new Cart to the database");
                	}
                	if (numberAffected == 0) {
                		console.log("Cart not updated because the courses are already in the cart. scheudle.json");
                	}
                	else {
                		//console.log(saved_cart);
                		res.send(saved_cart);
                	}
               });
			}
		});
	});

	app.post("/carts/remove", function (req, res) {
		if (req.isAuthenticated()) {	//If the user is logged in
			cart_id = new ObjectID(req.user.cart);
		}
		else {
			cart_id = new ObjectID(req.cookies.cart);
		}

		var remove_course_id = req.body.remove_course_id;

		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("dbcart is null remove");
			}
			else {
				var updated_cart = dbcart.courses;

				for (var i = 0; i < updated_cart.length; i++) {		//remove the course corresponding to the course id from the course list
					if (updated_cart[i].course_id == remove_course_id) {
						updated_cart.splice(i,1);
					}
				}

				dbcart.courses = updated_cart;

				// save the cart
                dbcart.save(function (err, saved_cart, numberAffected) {
                	if (err) {
                		console.log("Could not save the new Cart to the database");
                	}
                	if (numberAffected == 0) {
                		console.log("Cart not updated because the courses are already in the cart. remove");
                	}
                	else {
                		//console.log(saved_cart);
                		res.send(saved_cart);
                	}
                });
            }
        });

	});

	//Save the updated order of the courses in the cart displayed in the client-side js
	app.post('/carts/reorder', function (req, res) {
		if (req.isAuthenticated()) {	//If the user is logged in
			cart_id = new ObjectID(req.user.cart);
		}
		else {
			cart_id = new ObjectID(req.cookies.cart);
		}

		var new_order = req.body.new_order;
		
		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("dbcart is null reorder");
			}
			else {
				var courses = dbcart.courses;
				var updated_cart_order = new Array();

				for (var i = 0; i < new_order.length; i++) {
					updated_cart_order[i] = findObjectsByKey(courses, "course_id", new_order[i]);
				}

				var flattened = Array.prototype.concat.apply([], updated_cart_order);

				dbcart.courses = flattened;

				// save the cart
                dbcart.save(function (err, saved_cart, numberAffected) {
                	if (err) {
                		console.log("Could not save the new Cart to the database");
                	}
                	if (numberAffected == 0) {
                		console.log("Cart not updated because the courses are already in the cart.");
                	}
                	else {
                		console.log("New cart order saved.");
                	//	console.log(dbcart.courses);
                	}
                });
			}
		});
	});

	app.get('/courses.json', function (req, res) {
		console.log("Here");
	});

	app.get('/sendcart', function (req, res) {
		if (req.isAuthenticated()) {	//If the user is logged in
			console.log(req.user);
			cart_id = new ObjectID(req.user.cart);
		}
		else {
			cart_id = new ObjectID(req.cookies.cart);
		}

		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("dbcart is null sendcart");
			}
			else {
				//console.log(dbcart);
				res.send(dbcart);
            }
        });
	});

	app.get('/sendLoginStatus', function (req, res) {
		res.send(req.isAuthenticated());
	});

	app.get('/about', function (req, res) {
		res.render('about.ejs');
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {


		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
	var tempCart_id = new ObjectID(req.cookies.cart);		
		
/*		User.findOne({"cart": tempCart_id}, function (err, user) {		//Determine if the cart belongs to a User. If it doesn't delete it; if it does, don't delete it
			if (err) {
				console.log("Cannot get user");
			}
			if (user == null) {
				console.log("User is null signup....Removing temp cart...");
				Cart.findOneAndRemove(tempCart_id, function (err, dbcart) { 	//Delete the temporary Cart if one exists
					if (err) {
						console.log("Cannot remove cart");
					}
					if (dbcart == null) {
						console.log("dbcart is null signup");
					}
					else {
						console.log("temp cart deleted signup");
						console.log(dbcart);
					}
				}); 
			}
			else {
				console.log("Cart belongs to a User...not deleted signup");
				console.log(user);
			}
		});*/

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	// app.post('/signup', do all our passport stuff here);

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		var cart_id = new ObjectID(req.user.cart);
		console.log("profile: " + cart_id);

		Cart.findOne({"_id": cart_id}, function (err, dbcart) {
			if (err) {
				console.log("Cannot find cart");
			}
			if (dbcart == null) {
				console.log("dbcart is null profile");
				console.log("Making new Cart");
				var newCart = new Cart();
				newCart.courses = new Array();
				cart_id_str = newCart._id.toString();

				res.cookie("cart", cart_id_str, { expires: new Date(Date.now() + 126144000000) });

				if (req.user.cart == undefined) {	//This would only happen if you sign up before ever visiting the '/' route
					req.user.cart = newCart._id;
				}
				
				// save the cart
                newCart.save(function (err, saved_cart, numberAffected) {
                	if (err) {
                		console.log("Could not save the new Cart to the database");
                	}
                	if (numberAffected == 0) {
                		console.log("Not changed.");
                	}
                	else {
                			console.log("Cart saved profile.");
                			res.render('profile.ejs', {
							user : req.user, // get the user out of session and pass to template
							cart : saved_cart
						});	
                	}
                });
			}
			else {
				console.log("setting cookie");
				var cart_id_str = dbcart._id.toString();
				res.cookie("cart", cart_id_str, { expires: new Date(Date.now() + 126144000000) });

				res.render('profile.ejs', {
					user : req.user, // get the user out of session and pass to template
					cart : dbcart
				});
        	}
        });
	});

	app.post('/profile', isLoggedIn, function(req, res) {
		console.log("profile post");
	});

	// =====================================
	// LOGOUT ==============================
	// ==========================r===========
	app.get('/logout', function(req, res) {
		res.clearCookie('cart');	// Delete the user's cart cookie so that another user cannot change that user's cart
		req.logout();
		res.redirect('/');
	});


// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		var tempCart_id = new ObjectID(req.cookies.cart);		
		console.log("cookie id: " + tempCart_id);
		User.findOne({"cart": tempCart_id.toString()}, function (err, user) {		//Determine if the cart belongs to a User. If it doesn't delete it; if it does, don't delete it
			if (err) {
				console.log("Cannot get user");
			}
			if (user == null) {
				console.log("User is null login....Removing temp cart...");
				console.log("user null tempCart_id: " + tempCart_id);
				Cart.findByIdAndRemove(tempCart_id, function (err, dbcart) { 	//Delete the temporary Cart if one exists
					if (err) {
						console.log("Cannot remove cart");
					}
					if (dbcart == null) {
						console.log("dbcart is null login");
					}
					else {
						console.log("temp cart deleted");
						console.log(dbcart);
					}
				}); 
			}
			else {
				console.log("Cart belongs to a User...not deleted login");
				console.log(user);
			}
		});

		return next();
	}

	// if they aren't redirect them to the home page
	res.redirect('/');
}

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

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

function findObjectByKey(array, key, value) 
{
    for (var i = 0; i < array.length; i++) {
        if (parseInt(array[i][key]) == parseInt(value)) {
            return array[i];
        }
    }
    return null;
}

function findObjectsByKey(array, key, value) 
{
	var matches = new Array();
	var num_matches = 0;

    for (var i = 0; i < array.length; i++) {
        if (parseInt(array[i][key]) == parseInt(value)) {
            matches[num_matches] = array[i];
            num_matches++;
        }
    }

    if (matches.length == 0) {
    	return null;
	}
	else {
		return matches;
	}
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

function dateRelativeToThisWeek(date)	
{	
	var date_obj = new Date(date);

	var year = new Date().getFullYear();
	var month = new Date().getMonth();
	var day = new Date().getDate();
	var hour = date_obj.getHours();
	var min = date_obj.getMinutes();

	var day_of_week = new Date().getDay();
	var day_num = date_obj.getDay();
	var this_sunday = day - day_of_week;

	console.log(this_sunday);

	return new Date(year, month, this_sunday + day_num, hour, min);	//return the day relative to this week's Sunday, adjust hour to Eastern Time (EST)
}

