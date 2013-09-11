var debug = require('debug')('bz-glue')
var bzapi = require('bz');
var fs = require('fs');
var ini = require('ini');

function init(config_file) {
    var config = ini.parse(fs.readFileSync(config_file, 'utf-8'));
    var bzConfig = {
        url: config.bugzilla.url,
        username: config.bugzilla.username,
        password: config.bugzilla.password,
        timeout: config.bugzilla.timeout || 10000
    };
    bugzilla = bzapi.createClient(bzConfig);
    debug('BzAPI Configuration: %s', JSON.stringify(bzConfig));
    return bugzilla;
}

exports.init = init;
