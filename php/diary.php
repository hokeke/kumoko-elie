<?php
	// yyyy-mm
	$ym = $_POST['yyyymm'];
	//$ym = "2014-05";
	$data = array();

	// 本文
	//if ($dir = @opendir("../diary/" . $ym . "/")) {
	$files = glob("../diary/" . $ym . "/*");
	if ($files) {
	arsort($files);
	//	while (($file = readdir($dir)) !== false) {
	foreach ($files as $file) {
			if ($file != "." && $file != "..") {
				$key = $ym . "-" . basename($file, ".txt");

				// 日付
				$data[$key] = array('head' => $key);
				// 本文
				//$contents = file_get_contents("../diary/" . $ym . "/" . $file);
				$contents = file_get_contents($file);
				$contents = preg_replace('/(?<!src=")(?<!href=")(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/'
				, '<a href="${0}" target="_blank">${0}</a>', $contents);
				//print $contents;
				$data[$key]['body'] = preg_replace('/\r|\r\n/', "<br/>", $contents);
			}
	}
	//	closedir($dir);
	//}

	// 画像
	if ($dir = @opendir("../images/diary/" . $ym . "/")) {
		while (($file = readdir($dir)) !== false) {
			if ($file != "." && $file != "..") {
				$key = $ym . "-" . preg_replace('/\..*$/', "", $file);
				// 画像
				if (array_key_exists($key, $data)) {
					$data[$key]['image'] = $ym . "/" . $file;
					list($width, $height) = getimagesize("../images/diary/" . $ym . "/" . $file);
					$data[$key]['imageWidth'] = $width;
					$data[$key]['imageHeight'] = $height;
				}
			}
		}
		closedir($dir);
	}
	}

	$data2 = array('comments' => array());
	foreach ($data as $key => $value) {
		array_push($data2['comments'], $value);
	}

	//$json = to_json($data);
	$json = json_encode($data2);
	echo $json;

	function to_json($data) {
		$sep = '';
		$json = '{"comments":[';
		foreach ($data as $key => $value) {
			$json = $json . $sep . '{';
			$sep2 = '';
			foreach ($value as $key2 => $value2) {
				$json = $json . $sep2 . '"' . $key2 . '":' . '"' . $value2 . '"';
				$sep2 = ',';
			}
			$json = $json . '}';
			$sep = ',';
		}
		$json = $json . ']}';

		return $json;
	}
?>