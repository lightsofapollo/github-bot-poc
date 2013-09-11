var ghapi = require('github');
var fs = require('fs');
var ini = require('ini');

function init(config_file) {
    var config = ini.parse(fs.readFileSync(config_file, 'utf-8'));

    var github = new ghapi({
        version: config.github.version,
        timeout: config.github.timeout
    });

    authDeets = {};

    switch (config.github.authtype) {
        case 'basic':
            console.log('Using Github basic authentication');
            authDeets.type = 'basic';
            authDeets.username = config.github.username;
            authDeets.password = config.github.password;
            break;
    }

    github.authenticate(authDeets);
    console.log('Authenticated with Github');

    return github;

}

exports.init = init;
