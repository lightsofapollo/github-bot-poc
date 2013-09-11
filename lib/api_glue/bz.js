var debug = require('debug')('bz-glue');
var bzapi = require('bz');

function init(config) {
    var bzConfig = {
        url: config.url,
        username: config.username,
        password: config.password,
        timeout: config.timeout || 10000
    };
    bugzilla = bzapi.createClient(bzConfig);
    debug('BzAPI Configuration: %s', JSON.stringify(bzConfig));
    return bugzilla;
}

exports.init = init;
