function jQuery() {
    console.log('jQuery is fucking awesome.');

    this.ajax = function() {
        throw new Error('404 error lol');
    };
}

var $ = jQuery;