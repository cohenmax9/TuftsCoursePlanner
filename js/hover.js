$(document).ready(function () {
	// Adding activel Class on Click
	$(".cs-text").click(function () {
		$(this).toggleClass("active");

		//toggle between three class names for title animation
		if ($("#t1").attr("class") == "closed") {
	    	$("#t1").removeClass("closed").addClass("open-animate");
	    	$("#u1").removeClass("closed").addClass("open-animate");
	    	$("#f1").removeClass("closed").addClass("open-animate");
	    	$("#t2").removeClass("closed").addClass("open-animate");
	    	$("#s1").removeClass("closed").addClass("open-animate");
	    	$("#c1").removeClass("closed").addClass("open-animate");
	    	$("#o1").removeClass("closed").addClass("open-animate");
	    	$("#u2").removeClass("closed").addClass("open-animate");
	    	$("#r1").removeClass("closed").addClass("open-animate");
	    	$("#s2").removeClass("closed").addClass("open-animate");
	    	$("#e1").removeClass("closed").addClass("open-animate");
	    	$("#s3").removeClass("closed").addClass("open-animate");
	    	$("#logo").removeClass("closed").addClass("open-animate");
		}
		else if ($("#t1").attr("class") == "open-animate") {
	    	$("#t1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#u1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#f1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#t2").removeClass("open-animate").addClass("open-no-animate");
	    	$("#s1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#c1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#o1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#u2").removeClass("open-animate").addClass("open-no-animate");
	    	$("#r1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#s2").removeClass("open-animate").addClass("open-no-animate");
	    	$("#e1").removeClass("open-animate").addClass("open-no-animate");
	    	$("#s3").removeClass("open-animate").addClass("open-no-animate");
	    	$("#logo").removeClass("open-animate").addClass("open-no-animate");
	    }
		else {
			$("#t1").removeClass("open-no-animate").addClass("closed");
	    	$("#u1").removeClass("open-no-animate").addClass("closed");
	    	$("#f1").removeClass("open-no-animate").addClass("closed");
	    	$("#t2").removeClass("open-no-animate").addClass("closed");
	    	$("#s1").removeClass("open-no-animate").addClass("closed");
	    	$("#c1").removeClass("open-no-animate").addClass("closed");
	    	$("#o1").removeClass("open-no-animate").addClass("closed");
	    	$("#u2").removeClass("open-no-animate").addClass("closed");
	    	$("#r1").removeClass("open-no-animate").addClass("closed");
	    	$("#s2").removeClass("open-no-animate").addClass("closed");
	    	$("#e1").removeClass("open-no-animate").addClass("closed");
	    	$("#s3").removeClass("open-no-animate").addClass("closed");
	    	$("#logo").removeClass("open-no-animate").addClass("closed");
		}    	
	});
});
