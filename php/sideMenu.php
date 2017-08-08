<?php
$data = array();

// 本文
//if ($dir = @opendir("../diary/" . $ym . "/")) {
$files = glob("../images/comic/*");
if ($files) {
	$datas = array();
	foreach ($files as $file) {
		$name = basename($file);

		if ($name == 'Thumbs.db') {
			continue;
		}

		$title = $name;
		if (file_exists("../images/comic/" . $name . "/title.txt")) {
			$title = file_get_contents("../images/comic/" . $name . "/title.txt");
		}

		$data2 = array();
		$data2['id'] = $name;
		$data2['title'] = $title;

		$episodes = array();
		$files2 = glob("../images/comic/" . $name . "/*");
		if ($files2) {
			foreach ($files2 as $file2) {
				$name2 = basename($file2);
				
				if ($name2 == 'title.txt' || $name2 == 'Thumbs.db' || $name2 == 'thumb.png') {
					continue;
				}

				$episodes[] = array('episode' => intval($name2)
													 ,'url' => '?title=' . $name . '&episode=' . $name2);
			}
		}
		$data2['episodes'] = $episodes;
		$datas[] = $data2;

		//$files = array_map("alter", $files);
		//rsort($files);

		//$data['maxPages'] = intval($files[0]);
	}
	$data['comics'] = $datas;

	$json = json_encode($data);

	print $json;

} else {
	$data['comics'] = array();
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
