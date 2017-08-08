<?php
// yyyy-mm
$name = $_GET['title'];
$episode = $_GET['episode'];
//$ym = "2014-05";
$data = array();
$ext = "";

// 本文
//if ($dir = @opendir("../diary/" . $ym . "/")) {
$files = glob("../images/comic/" . $name . "/" . $episode . "/*");
if ($files) {
	$data['ext'] = pathinfo($files[0], PATHINFO_EXTENSION);

  $imageSize = getimagesize($files[0]);
	if ($imageSize) {
		$data['width'] = $imageSize[0];
		$data['height'] = $imageSize[1];
	}

	$files = array_map("alter", $files);
	rsort($files);

	$data['maxPages'] = intval($files[0]);

	$json = json_encode($data);

	print $json;
} else {
	$data['ext'] = "";
	$data['maxPages'] = 0;
	$data['width'] = 0;
	$data['height'] = 0;
	$json = json_encode($data);
	print $json;
}

function alter($value) {
	$num = 0;
	if (!strpos($value, "Thumbs.db")) {
		$num = preg_replace('/\..*$/', "", basename($value));
		$num = str_pad($num, 3, "0", STR_PAD_LEFT);
	}
	return $num;
}
?>
