function htmlLink(href) {
    return '<a href="' + href + '">' + href + '</a>';
}

function metaRedirectHtml(target) {
    return '<html>\n<head>\n<title>Redirect</title>\n' +
        '<meta http-equiv="refresh" content="0; url=' +
        target + '">\n' + '</head>\n<body>\n<h1>Redirect</h1>\n' +
        htmlLink(target) + '\n</body>\n</html>\n';
}

function linkBug(bz, github, user, repo, prNum, bugNum, callback) {
    console.log('Creating BZ->GH link');

    var msg = {user: user, repo: repo, number: prNum};

    github.pullRequests.get(msg, function(error, data) {
        if (error) {
            return callback(error);
        }
        var contents = new Buffer(metaRedirectHtml(data.html_url))
                           .toString('base64');

        console.log(contents);

        var attachment = {
            bug_id: bugNum,
            comments: [{
                text: 'Github user ' + data.user.login +
                      ' opened a pull request for ' + data.base.label +
                      '\n\n' + data.html_url
            }],
            encoding: 'base64',
            data: contents.toString('base64'),
            description: data.base.label + ' PR#' + data.number,
            file_name: data.base.repo.name.replace(' ', '_') +
                       '_pull_request_' + data.number + '.html',
            content_type: 'text/html'
        };

        bz.createAttachment(bugNum, attachment, function(error, data) {
            if (error) {
                return callback(error);
            }
            console.log('Created attachment: ' + data);
            return callback(undefined, data);
        });
    });
}

function link(bz, github, user, repo, prNum, callback) {
    var msg = { user: user, repo: repo, number: prNum, per_page: 100 };

    github.pullRequests.getCommits(msg, function(error, data) {
        if (error) {
            console.log(error);
            return callback(error);
        }
        bugNums = [];
        for (var i = 0; i < data.length; i++) {
            bug_re = /bug *(\d+)/gi;
            while (result = bug_re.exec(data[i].commit.message)) {
                bugNums.push(result[1]);
            }
            if (bugNums.length == 0) {
                console.log('Found no bug on commit ' + data[i].sha);
                return callback('Could not find bug number from ' +
                    ' commit message for ' + data[i].sha);
            } else {
                if (bugNums.length > 1) {
                    console.log('Found multiple bug numbers, using the first');
                }
                console.log('Found bug:' + bugNums[0]);
                return linkBug(bz, github, user, repo,
                               prNum, bugNums[0], callback);
            }
        }
    });
}

exports.link = link;
