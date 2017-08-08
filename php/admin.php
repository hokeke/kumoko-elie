<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../js/jsviews.min.js"></script>
<title>admin</title>
<script id="tmpl" type="text/x-jsrender">
	<p>カウンタ</p>
	<table><tbody>
		<tr>
			<td>トータル</td>
			<td>{{:totalCount}}人</td>
		</tr>
		<tr>
			<td>今日</td>
			<td>{{:today.count}}人</td>
		</tr>
	</tbody></table>
</script>
<script type="text/javascript">
	$(function(){
		// $.getJSON(
			// "./count.json",
			// function(data){
				// var template = $.templates("#tmpl");
				// template.link("#counter", data);
			// }
		// );

		$.ajax({
			url : "./counter.php",
			type : "GET",
			dataType : "json",
			success : function(data, dataType){
				var template = $.templates("#tmpl");
				template.link("#counter", data);
			},
		error : function(XMLHttpRequest, textStatus, errorThrown){
		},
		cache : false,
		async : true
	  });


	$("#mainText").change(function(){
		var text = $("#mainText").val();
		text = text.replace(/\n/g, "<br/>");
		//var reg = /(https?|ftp):\/\/[-_.!~*¥'()a-zA-Z0-9;¥/?:¥@&=+¥$,%#]+/g;
		//text = text.replace(reg, "<a href='$0' target='_blank'>$0</a>");
		$.ajax({
			url : "./admin.php",
			type : "POST",
			data : {"replace" : text},
			dataType : "text",
			success : function(result, dataType){
				text = result;
			},
		  	error : function(XMLHttpRequest, textStatus, errorThrown){
		  	},
			cache : false,
			async : false
  		});
		$("#preview").html("<p>" + text + "</p>");
	});

	});
</script>
</head>
<body>

<?php
	session_start();

	$p_str = @$_POST['replace'];
	if ($p_str) {
		$p_str = preg_replace('/(?<!src=")(?<!href=")(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/'
				, '<a href="${0}" target="_blank">${0}</a>', $p_str);
		print $p_str;
		return;
	}

	$s_pwd = @$_SESSION['password'];
	$p_pwd = @$_POST['password'];

	if (!$s_pwd && !$p_pwd) {
		echo "<form action='./admin.php' method='post' accept-charset='utf-8'>";
		echo "パスワード: <input type='password' name='password' />";
		echo "</form>";
		return;
	} else if (!$s_pwd) {
		if ("ramuramu" == $p_pwd) {
			$_SESSION['password'] = $p_pwd;
		} else {
			echo "パスワードが違うよ<br/>";
			echo "<form action='./admin.php' method='post' accept-charset='utf-8'>";
			echo "パスワード: <input type='password' name='password' />";
			echo "</form>";
			return;
		}
	}

	$date = @$_POST['date'];
	$ym = substr($date, 0, 7);
	$d = substr($date, 8, 2);
	$content = @$_POST['content'];
	$image = @$_FILES['image'];
	$action = @$_POST['action'];

	if ("new" == $action) {
		if (!$date) {
			echo "<p>日付が選択されてないよ</p>";
		} else {

			// 本文保存
			if ($content) {
				if (!file_exists("../diary/" . $ym . "/")) {
					mkdir("../diary/" . $ym . "/");
				}
				$dst = "../diary/" . $ym . "/" . $d . ".txt";
				file_put_contents($dst, $content);
				chmod($dst, 0644);
			}

			// 画像保存
			if (is_uploaded_file($image['tmp_name'])) {
				$dst = "../images/diary/" . $ym . "/" . $d . "." . pathinfo($image['name'], PATHINFO_EXTENSION);
				if (!file_exists("../images/diary/" . $ym . "/")) {
					mkdir("../images/diary/" . $ym . "/");
				}
				move_uploaded_file($image['tmp_name'], $dst);
				chmod($dst, 0644);
			}
		}
	} else if ("delete" == $action) {
		if (!$date) {
			echo "<p>日付が選択されてないよ</p>";
		} else {
			$del = "../diary/" . $ym . "/" . $d . ".txt";
			if (file_exists($del)) {
				unlink($del);
			}
			$images = glob("../images/diary/" . $ym . "/" . $d . ".*");
			$del = $images[0];
			if (file_exists($del)) {
				unlink($del);
			}
		}
	}

?>

	<form action="./admin.php" method="post" accept-charset="utf-8" enctype="multipart/form-data">
		<fieldset style="border-style: dotted;">
			<legend>登録</legend>
			<p>
				<input type="date" name="date" /><br/>
				<textarea id="mainText" name="content" rows="20" cols="100"></textarea><br/>
				<!--プレビュー<br/>-->
				<!--<div id="preview" style="width: 50em;height: 30em;border: solid 1px;overflow: auto;"></div>-->
				<input type="file" id="fileChooser" name="image" accept=".png,.jpg,.jpeg,.gif" />
				<input type="hidden" name="action" value="new" />
			</p>
			<p><input type="submit" value="登録"/></p>
		</fieldset>
	</form>
	<br/>
	<form action="./admin.php" method="post" accept-charset="utf-8" enctype="multipart/form-data">
		<fieldset style="border-style: dotted;">
			<legend>削除</legend>
			<p>
				<input type="date" name="date" /><br/>
				<input type="hidden" name="action" value="delete" />
			</p>
			<p><input type="submit" value="削除"/></p>
		</fieldset>
	</form>

	<div id="counter"></div>

	<div>
		<p>
			<?php echo @$_SERVER['REMOTE_ADDR'] ?>
		</p>
	</div>

	<div id="backLink">
		<p><a href="../index.html">トップへ</a></p>
	</div>

</body>
</html>
