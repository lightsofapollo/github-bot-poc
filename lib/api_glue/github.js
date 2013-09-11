var debug = require('debug')('github-glue');
var ghapi = require('github');

function init(config) {

    var authDeets = undefined;

    var apiDeets = {
        version: config.version,
        timeout: config.timeout
    };

    switch (config.authtype) {
        case 'basic':
            var authDeets = {
                type: 'basic',
                username: config.username,
                password: config.password
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
