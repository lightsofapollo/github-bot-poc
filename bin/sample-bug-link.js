var fs = require('fs');

var bz_glue = require('../lib/api_glue/bz');
var github_glue = require('../lib/api_glue/github');
var linkify = require('../lib/linkify');
var config = require('../ghb.json');



bz = bz_glue.init(config.bugzilla);
github = github_glue.init(config.github);
linkify.link(bz, github, 'staging-mozilla-b2g', 'gaia', 2,
    function(err, at_id) {
        console.log(at_id);
    }
);
