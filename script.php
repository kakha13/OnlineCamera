<?php 
$img = $_POST['imgBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);
//saving
$fileName = time().'.png';
file_put_contents("saved/".$fileName,$fileData);
echo "https://any.ge/photo/saved/".$fileName;