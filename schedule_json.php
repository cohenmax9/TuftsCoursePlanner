<?php
	print "In php";
	$stringData = $_POST["events"];

	$myFile = "schedule.json";
	$fh = fopen($myFile, 'w+') or die("can't open file");
	fwrite($fh, $stringData);
	fclose($fh);
?>