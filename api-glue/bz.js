var bzapi = require("bz");
var fs = require("fs");
var ini = require("ini");

function init (config_file) {
    var config = ini.parse(fs.readFileSync(config_file, "utf-8"));
    url = config.bugzilla.url;
    username = config.bugzilla.username;
    password = config.bugzilla.password;
    timeout = config.bugzilla.timeout || 10000;
    bugzilla = bzapi.createClient({
        url: url, username: username, password: password, timeout: timeout,
    });
    console.log("Configuring BzAPI for " + config.bugzilla.url);
    return bugzilla
}

exports.init = init
