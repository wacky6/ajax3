
function com_failure(e) {
    console.log(e);
    QUnit.start();
}

QUnit.module('ajax3, USAGE');

QUnit.asyncTest('missing url', function(assert) {
    expect(2);
    var ret = $ajax3({
        failure: function(err){
            assert.deepEqual(err, {usage: 'url'}, 'correct error msg');
            QUnit.start();
        }
    });
    assert.equal(ret, null, 'return null');
});

QUnit.asyncTest('wrong method', function(assert){
    expect(2);
    var ret = $ajax3({
        url: '/test',
        method: 'insane',
        failure: function(e) {
            assert.deepEqual(e, {usage: 'method'}, 'correct error msg');
            QUnit.start();
        }
    });
    assert.equal(ret, null, 'return null');
});



QUnit.module('ajax3, GET');

QUnit.asyncTest('GET plain-text', function(assert){
    expect(1);
    $ajax3({
        url: 'get_text.html',
        success: function(data) {
            assert.ok('data received');
            QUnit.start();
        },
        failure: com_failure
    });
})

QUnit.asyncTest('GET, correct json', function(assert){
    expect(1);
    $ajax3({
        url: 'get_correct_json.html',
        type: 'json',
        success: function(json) {
            assert.deepEqual(json, {json: 'ok'}, 'json received');
            QUnit.start();
        },
        failure: com_failure
    });
});

QUnit.asyncTest('GET, incorrect json', function(assert){
    expect(1);
    $ajax3({
        url: 'get_incorrect_json.html',
        type: 'json',
        success: function(json) {
            assert.ok(false, 'incorrect json should not call success()');
            QUnit.start();
        },
        failure: function(err) {
            assert.deepEqual(err, {json: 'parse'}, 'error msg correct');
            QUnit.start();
        }
    });
});

QUnit.asyncTest('GET, http 404', function(assert) {
    expect(1);
    $ajax3({
        url: '/404',
        success: function(data) {
            assert.ok(false, '404 should not call success()');
            QUnit.start();
        },
        failure: function(err) {
            assert.deepEqual(err, {http: 404}, 'error msg correct');
            QUnit.start();
        }
    });
});

QUnit.asyncTest('GET, connection fail', function(assert) {
    expect(1);
    $ajax3({
        url: 'http://127.0.0.1:65535',
        failure: function(err) {
            assert.deepEqual(err, {conn: 'fail'}, 'error msg correct');
            QUnit.start();
        }
    });
});

QUnit.asyncTest('GET, query string', function(assert) {
    expect(1);
    var q = {
        test_query_string: '1',
        elem2: 'string',
        elem3: '0'
    }
    $ajax3({
        url: 'query_string.jsp',
        type: 'json',
        query: q,
        success: function(data) {
            assert.deepEqual(data, q, 'query string ok');
            QUnit.start();
        },
        failure: com_failure
    });
});

QUnit.asyncTest('GET, append query string', function(assert){
    expect(1);
    var q = {
        append1: '1',
        append2: '2'
    }
    $ajax3({
        url: 'query_string.jsp?exist1=e1&exist2=e2',
        query: q,
        type: 'json',
        success: function(data) {
            q.exist1 = 'e1';
            q.exist2 = 'e2';
            assert.deepEqual(q, data);
            QUnit.start();
        },
        failure: com_failure
    });
});

QUnit.asyncTest('GET, timeout', function(assert){
    expect(1);
    var start = (new Date()).getTime();
    var end;
    $ajax3({
        url:   'noresponse.jsp',
        timeout: 500,
        success: function() {
            assert.ok(false, 'timeout called success()');
        },
        failure: function(e) {
            assert.deepEqual(e, {conn: 'fail'}, 'error msg correct');
            QUnit.start();
        }
    })
});

QUnit.asyncTest('GET, abort', function(assert){
    expect(1);
    var a = $ajax3({
        url:   'noresponse.jsp',
        failure: function(e) {
            assert.deepEqual(e, {abort: 'abort'}, 'error msg correct');
            QUnit.start();
        }
    });
    setTimeout(function() {
        a.abort();
    }, 500);
});


QUnit.module('ajax3, POST');

QUnit.asyncTest('POST, data=plain-text', function(assert) {
    expect(1);
    $ajax3({
        url: 'post_plain.html',
        success: function(data) {
            assert.equal(data, 'ok');
            QUnit.start();
        },
        failure: com_failure
    });
});


QUnit.asyncTest('POST, query string + data + progress', function(assert){
    expect(2);
    var q = {
        id: "123456"
    }
    var posted = 'test_post_data';
    $ajax3({
        method:  'post',
        url:     '/query_post.jsp',
        query:   q,
        type:    'json',
        data:    posted,
        success: function(recv) {
            assert.deepEqual(
                recv,
                {
                    query: q,
                    data: posted
                },
                'posted, data, query correct');
            QUnit.start(); 
        },
        progress: function(done, total) {
            console.log(done+'/'+total);
            if (done==total) assert.ok(true, 'progress');
        }
    });
});

QUnit.asyncTest('POST, then abort, then abort again', function(assert) {
    expect(1);
    var posted = '*';
    for (var i=0; i!=20; i++)
        posted += posted;
    var a = $ajax3({
        method:  'post',
        url:     '/query_post.jsp',
        data:    posted,
        success: function(data) {
        },
        failure: function(e) {
            assert.deepEqual(e, {abort:'abort'});
            QUnit.start();
        }
    });
    a.abort();
    a.abort();
});

QUnit.asyncTest('POST, after finish, abort', function(assert) {
    expect(1);
    var posted = '*';
    for (var i=0; i!=20; i++)
        posted += posted;
    var a = $ajax3({
        method:  'post',
        url:     '/query_post.jsp',
        data:    posted,
        type:    'json',
        success: function(recv) {
            a.abort();
            assert.deepEqual(
                recv,
                {
                    data: posted,
                    query: {}
                },
                'post data correct'
            );
            QUnit.start();
        },
        failure: function(e) {
            assert.ok(false, 'abort called after ajax completion');
        }
    });
});

QUnit.asyncTest('POST, timeout', function(assert){
    expect(1);
    var start = (new Date()).getTime();
    var end;
    $ajax3({
        method:  'post',
        url:     '/noresponse.jsp',
        timeout: 500,
        success: function() {
            assert.ok(false, 'timeout called success()');
        },
        failure: function(e) {
            assert.deepEqual(e, {conn: 'fail'}, 'error msg correct');
            QUnit.start();
        },
        progress: function(done,total) {
            assert.ok(false,'timeout called progress()');
        }
    })
});

QUnit.asyncTest('POST, json', function(assert) {
    expect(1);
    var posted = {
        json: '1'
    }
    $ajax3({
        method: 'post',
        url: '/query_post.jsp',
        data: posted,
        type: 'json',
        success: function(recv) {
            assert.deepEqual(
                recv,
                {
                    data: JSON.stringify(posted),
                    query:{}
                },
                'post data correct'
            );
            QUnit.start();
        }
    });
});
