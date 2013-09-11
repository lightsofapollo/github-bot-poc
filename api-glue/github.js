var ghapi = require("github");
var fs = require("fs");
var ini = require("ini");

function init (config_file) {
    var config = ini.parse(fs.readFileSync(config_file, "utf-8"));

    var github = new ghapi({
        version: config.github.version,
        timeout: config.github.timeout,
    });

    auth_deets = {}
    switch (config.github.authtype) {
        case "basic":
            console.log("Using Github basic authentication");
            auth_deets["type"] = "basic";
            auth_deets["username"] = config.github.username;
            auth_deets["password"] = config.github.password;
            break;
    }

    github.authenticate(auth_deets);
    console.log("Authenticated with Github");

    return github;
            
}

exports.init = init
