var debug = require('debug')('github-glue');
var ghapi = require('github');
var fs = require('fs');
var ini = require('ini');

function init(config_file) {
    var config = ini.parse(fs.readFileSync(config_file, 'utf-8'));

    var authDeets = undefined;

    var apiDeets = {
        version: config.github.version,
        timeout: config.github.timeout
    };

    switch (config.github.authtype) {
        case 'basic':
            var authDeets = {
                type: 'basic',
                username: config.github.username,
                password: config.github.password
            };
            break;
    }

    debug('API Details: %s, Auth Details: %s',
          JSON.stringify(apiDeets),
          JSON.stringify(authDeets));

    var github = new ghapi(apiDeets);
    debug('Connected to Github');
    github.authenticate(authDeets);
    debug('Authenticated with Github');

    return github;

}

exports.init = init;
