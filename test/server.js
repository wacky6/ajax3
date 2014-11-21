// open with nodejs

http = require('http');
url  = require('url');
util = require('util');

http_handler = function (req, res) { 
  var u = url.parse(req.url, true);
  var q = u.query;
  var f = u.pathname;
  if (f.search('query_string.jsp')!=-1){
    console.log(q);
    res.end(JSON.stringify(q));
    return;
  }
  if (f.search('query_post.jsp')!=-1){
    if (req.method!='POST') {
        res.end('{"error": "not_post"}')
        return;
    }
    var data = '';
    req.setEncoding('utf8');
    req.on("data", function(d_chunk){
        data += d_chunk;
    });
	req.on("end", function(){
		res.end(JSON.stringify({
            query: q,
            data: data
        }));
	});
    return;
  }
};


http.createServer(http_handler)
     .listen(12800);