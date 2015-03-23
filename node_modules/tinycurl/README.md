**tinycurl** is a tiny node wrapper for the command line **curl**

```bash
$ npm install tinycurl
```

## Reason

Node.js doesn't give some features that curl provides.
I was playing with ssl post request for use a remote SOAP service for 3 days.
I've wrote 5 solutions in this period, tried pfx, pem, p12, different headers, enabling\disabling security, but it still don't work. I had some progress in making GET request, but I need POST.
Maybe reason was in wrong cerificates or our partner don't give us a CA or maybe I have got not right curved hands.
After all I'd used SOAP UI desktop tool and it somehow did that request.
After 20 minutes spent for reading curl docs, I was able to make this request with a warning.

Finally node-soap && curlrequest modules in npm are depended on some windows stuff and their code is an overkill for this task.

## When you should use it

- Curl have got some features that node.js doesn't and you need it
- If you stubbed with something about SSL

## When you should avoid of using it

- When node.js native implementation suits

## Usage

Make a request with curl - callback receives `(err, data)` on request
completion

```javascript
var curl = require( 'tinycurl' );


curl.post( 'https://test.com', {
    // tinycurl make an assumption that all keys with
    // length <3 need to be prefixed with two dashes
    // maybe it's wrong
    headers: [ // headers are an array
        'SOAPAction: http://test.com/serviceprovider/TheService/Act',
        'Content-type: text/xml; charser=utf-8'
    ],
    key: 'key.pem',
    cert: 'cert.pem',

    // you can put multiline data here
    // but if you want to use objects - you have to JSON.stringify
    // them or serialize any other way that you want
    // you even can write a tinycurl extension for it
    data: 'hello'
}, callback );
```

Extending tinycurl

```javascript
var convertions = curl.getConvert(); // hash of conversion functions

convertions.myCoolFeature = function( val, args ){
    // it's a pure function. val is a value of option and args is
    // an array with all rules. order is using for command line options sort
    args.push({order:2, data: ['-CoolFeature', val]});
}
```

**Predefined request types wrapper**
- curl.request( url, options, callback );
- curl.post( url, options, callback );
- curl.get( url, options, callback );

## Low level

If you want to handle curl stdout\stderr data
when it comes - you can use the output observable object

```javascript
var req = curl.request( url, options, callback );
req.on( 'stdout', function( data ){
    // whatever
} );
```

If you want to handle real low level of process - use option "low".
It would return a real child_process.spawn object.

```javascript
var req = curl.request( url, {low: true}, callback );
req.stderr.on( 'data', function( data ){
    console.log('oh no!');
} );
```

## Options

Read "man curl".

## License

Copyright (c) 2014 Zibx <zibx.mail+npm@gmail.com>
The MIT License (MIT)
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
