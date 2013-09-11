var debug = require('debug')('linkify');
var html = require('./html');
var parseCommits = require('./parse_commits');

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
                return callback(
                    new Error('Error creating attachment: %s', error));
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
            return callback(
                new Error('Error getting commits for PR: %s', error));
        }
        commitMsgs = [];
        for (var i = 0; i < data.length; i++) {
            commitMsgs.push({
                msg: data[i].commit.message,
                sha: data[i].sha
            });
        }
        bugNums = parseCommits.parseCommits(commitMsgs);
        return linkBug(bz, github, user, repo,
                       prNum, bugNums[0], callback);
    });
}

exports.link = link;
