Usage example
``` js
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

 ```