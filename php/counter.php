<?php
session_start();

$method = $_SERVER['REQUEST_METHOD'];
$visit = @$_SESSION['visit'];
$ip = @$_SERVER['REMOTE_ADDR'];

$chgDate = false;
$file = "./count.json";

$content = file_get_contents($file);

$json = json_decode($content, true);

if ($json['today']['date'] != date("Y-m-d")) {
	$json['today']['date'] = date("Y-m-d");
	$json['today']['count'] = 0;
	$chgDate = true;
}

if ("POST" == $method) {

	if (!$visit) {
		if (!in_array($ip, $json['ignore'])) {
			$json['totalCount'] = $json['totalCount'] + 1;
			$json['today']['count'] = $json['today']['count'] + 1;

			file_put_contents($file, json_encode($json));
		}

		$_SESSION['visit'] = true;
	}

} else {
	if ($chgDate) {
		file_put_contents($file, json_encode($json));
	}
	echo $content;
}
?>
