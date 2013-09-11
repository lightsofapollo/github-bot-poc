var debug = require('debug')('linkify');
var html = require('./html');

function linkBug(bz, github, user, repo, prNum, bugNum, callback) {
    var msg = {user: user, repo: repo, number: prNum};

    github.pullRequests.get(msg, function(error, data) {
        if (error) {
            return callback(error);
        }

        var contents = new Buffer(html.redirectPage(data.html_url))
                           .toString('base64');

        debug('data:text/html;base64,%s', contents);

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

        debug('Attachment Object: %s', JSON.stringify(attachment));

        bz.createAttachment(bugNum, attachment, function(error, data) {
            if (error) {
                return callback(error);
            }
            debug('Created attachment: ' + data);
            return callback(undefined, data);
        });
    });
}

function link(bz, github, user, repo, prNum, callback) {
    debug('Creating BZ->GH link from %s:%s to bug %s', user, repo);

    var msg = { user: user, repo: repo, number: prNum, per_page: 100 };

    github.pullRequests.getCommits(msg, function(error, data) {
        if (error) {
            debug(error);
            return callback(error);
        }
        bugNums = [];
        bug_re = /bug *(\d+)/gi;
        for (var i = 0; i < data.length; i++) {
            while (result = bug_re.exec(data[i].commit.message)) {
                bugNums.push(result[1]);
                debug('Found a bug: %d', result[1]);
            }
            if (bugNums.length == 0) {
                debug('Found no bug on commit %s', data[i].sha);
                return callback('Could not find bug number from ' +
                    ' commit message for %s', data[i].sha);
            } else {
                if (bugNums.length > 1) {
                    debug('Found multiple bug numbers, using the first');
                }
                debug('Using bug %d for linking', bugNums[0]);
                return linkBug(bz, github, user, repo,
                               prNum, bugNums[0], callback);
            }
        }
    });
}

exports.link = link;
