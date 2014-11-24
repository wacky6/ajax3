===
AJAX 3 wrapper
===

Support:
    IE10+, Chrome 30+, Firefox 29+

### Example
```
    $ajax({
        url: '/get_data',
        success: function(data) {
        },
        failure: function(error) {
        }
    });
```


### Usage

```
    $ajax(ajax_options)
```
field in [] is optional, value enclosed in [] is default value
```
    ajax_options {
        url:
        [method]:   ['get'], 'post'
        [type]:     ['text'], 'json'
            response type 
        [headers]:  [{}]
            headers send to server
            {key: value}
        [timeout]:  [3000]
            timeout before fail, in ms
        [success]:   function(data) 
            function to call on successful completion
            data: received data based on type provided
        [failure]: function(error)
            function to be called on failure
            error: explanation of error,
                contains one of the key-value pair of the following
                {
                    http: error_code (eg: 404, 500)
                    conn: 'fail'  
                    json: 'parse'
                    usage: [usage error desc]
                    abort: 'abort'
                }
        [progress]: function(done, total)
            function to be called on progress, used if method=='post'
        [data]:  data sent to server
            used if method=='post'
        [query]: query string object
            query string, urlencoded(encodeURLComponent)
            append to url if url already has query string
        [sync]:  true, [false]
            make synchronous request
            js will block until ajax is complete
            $ajax() will return `undefined`
            success, failure will be called upon success or failure
    }
```
    
### How to test

1. set http server, proxy *.jsp to nodejs on port 12800
2. in test/, run `node server.js`
3. run http server(nginx, etc.) to serve ajax3/ directory (where ajax3.js is)
4. visit `http://127.0.0.1/test/index.html`
5. test result should display 

