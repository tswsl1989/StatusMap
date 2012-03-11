<?PHP
/**
 * Foursquare venue search proxy
 * Searches for venues in foursquare, passing our client ID and key with the request
 * Expects requests to set ll and radius and be from localhost
**/
require('4sq_config.inc.php');
if (!isset($_GET['ll']) || !isset($_GET['radius'])){
	header('HTTP/1.1 406 Not Acceptable');
	print("{resp: 'Need to specify proper parameters'}");
	exit();
}
$c = curl_init('https://api.foursquare.com/v2/venues/search?client_id='.FSQ_CLIENT_ID.'&client_secret='.FSQ_CLIENT_SECRET.'&intent=browse&v=20120311&ll='.$_GET['ll'].'&radius='.$_GET['radius'].'&limit=1000');
curl_exec($c);
//$h = fopen('https://api.foursquare.com/v2/venues/search?client_id='.FSQ_CLIENT_ID.'&client_secret='.FSQ_CLIENT_SECRET.'&intent=browse&v=20120311&ll='.$_GET['ll'].'&radius='.$_GET['radius'], 'r');
#fpassthru($h);
