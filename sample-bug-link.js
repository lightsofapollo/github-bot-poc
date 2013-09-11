var fs = require("fs");

var bz_glue = require("./api-glue/bz");
var github_glue = require("./api-glue/github");
var linkify = require("./linkify");

var ini_file = "ghb.ini";


fs.exists(ini_file, function(exists){
    if (exists) {
        bz = bz_glue.init(ini_file);
        github = github_glue.init(ini_file);
        linkify.link(bz, github, "staging-mozilla-b2g", "gaia", 2, function (err, at_id) {
            console.log(at_id);
        });
    } else {
        console.log("config file (" + ini_file + ") doesn't exist");
    }
});
