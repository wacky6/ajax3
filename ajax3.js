/* ajax3.js
 *     ajax helper
 *     minified: ~1.3KB
 *     usage: see README.txt
 */

(function(){
    
    function append_query_string(url, query) {
        var first = true;
        if (url.indexOf('?')!=-1) first=false;
        for (var i in query)
            if (query.hasOwnProperty(i)) {
                url = url + (first?'?':'&')+encodeURIComponent(i)
                                     + '=' +encodeURIComponent(query[i]);
                first = false;
            }
        return url;
    }
    
    $ajax3 = function(opt) {
        if (!opt) return null;
        var url      = opt.url;
        var method   = opt.method   || 'GET';
        var type     = opt.type     || null;
        var success  = opt.success  || function(data){};
        var failure  = opt.failure  || function(err){};
        var progress = opt.progress || function(done, total){};
        var timeout  = opt.timeout  || 3000;
        var headers  = opt.headers  || {};
        var query    = opt.query    || {};
        var data     = opt.data     || undefined;
        // check, preprocess options
        if (!url) {
            failure({usage:'url'});
            return null;
        }
        if (timeout && timeout<0) {
            timeout = -1;
        }
        method = method.toUpperCase();
        if (method!='POST' && method!='GET'){
            failure({usage: 'method'});
            return null;
        }
        // append query string
        url = append_query_string(url, query);
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        for (var i in headers)
            xhr.setRequestHeader(i, headers[i]);
        xhr.responseType = type=='json'?'':type;
        if (method=='POST') {
            xhr.upload.onprogress = function(e) {
                progress(e.loaded, e.total);
            }
        }
        if (timeout!=-1) {
            xhr.timeout = timeout;
        }
        // check data 
        var data_proto = Object.prototype.toString.call(data);
        if (data_proto == '[object Object]')
            data = JSON.stringify(data);
        xhr.onreadystatechange = function(){ 
            if (xhr.readyState==4) {
                if (xhr.status==200) {
                    var res = xhr.response;
                    // workaround: safari, IE not support responseType='json'
                    if (type=='json'){
                        try{
                            res = JSON.parse(xhr.response);
                        }catch (e){
                            failure({json: 'parse'});
                            return;
                        }
                    }
                    success(res);
                }else{
                    xhr.upload.onprogress = undefined;
                    if (xhr.status==0)
                        failure({conn: 'fail'});
                    else
                        failure({http: xhr.status});
                } //xhr.readyState=4, xhr.status
            }
        };
        if (method=='POST')
            xhr.send(data)
        if (method=='GET')
            xhr.send()
        return {
            abort: function() {
                if (xhr && xhr.readyState<4) {
                    xhr.upload.onprogress = undefined;
                    xhr.onreadystatechange = function() {};
                    xhr.abort();
                    failure({abort: 'abort'});
                    xhr = undefined;
                }
            }
        };
    }
    
})();