var User = require("../app/models/user.js");

function resetPassword()
{
	var user = new User();
	var new_password = document.getElementById(new_password).innerHTML;
	var confirm	= document.getElementById(confirm).innerHTML;

	if (new_password == confirm) {
		
	}
}