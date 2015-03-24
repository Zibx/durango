var curl = require('tinycurl');
module.exports = (function () {
    var apply = function(o1,o2){
        for( var i in o2 )
            o1[i] = o2[i];
        return o1;
    };
    var Durango = function (cfg) {
        apply(this, cfg);

    };
    var mapping = {
        card: 'ccnumber',
        expire: 'ccexp'
    },
        order = 'username,password,ccnumber,ccexp,cvv,amount,firstname,address1,zip'.split(',')
            .reduce(function (obj, el, i) {
                obj[el] = i;
                return obj;
            }, {});
    Durango.prototype = {
        username: 'demo',
        password: 'password',
        url: 'https://secure.durango-direct.com/api/transact.php',
        sale: function (cfg, callback) {
            var query = [], i, data;
            cfg.username = this.username;
            cfg.password = this.password;
            var owner = cfg.owner.split(' ');

            cfg.firstname = owner[0];
            owner[1] = owner.slice(1).join(' ');
            cfg.lastname = owner[1];
            delete cfg.owner;
            for( i in cfg )
                if( cfg.hasOwnProperty(i) )
                    query.push(
                        {
                            key: i in mapping ? mapping[i]:i,
                            val: cfg[i]
                        }
                    );
            query.sort(function (a,b) {
                var k1 = a.key,
                    k2 = b.key;
                k1 = k1 in order ? order[k1] : k1;
                k2 = k2 in order ? order[k2] : k2;
                return k1 < k2 ? -1 : k1 > k2 ? 1 : 0;
            });
            data = query.map(function (el) {
                return encodeURIComponent(el.key) + '=' +
                    encodeURIComponent(el.val);
            }).join('&');

            var log = {url: this.url, data: this.data, rawData: query};
            curl.post(this.url+'?'+data, {
                headers: [
                    'Content-type: text/xml; charser=utf-8'
                ]
            }, function (err, data) {
                if(!data)
                    callback(err, data, log);
                else
                    callback(false, data, log);
            } );
        }
    };

    // Factory
    return function (cfg) {
        return new Durango(cfg);
    };
})();
/*
Usage example:
    var Durango = require('durango'),
        payment = Durango({
            user: 'demo',
            pass: 'password'
        });
    payment.sale({
        amount: 0.99,
        card: '4111111111111111',
        expire: '1025',
        cvv: '',
        owner: 'JOHN SMITH'
    }, function( err, data ){
        console.log(err, data);
    });

 */