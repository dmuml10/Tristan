console.log('Loading function');

var https = require("https");

var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    var params = {
        Bucket: bucket,
        Key: key
    };
    var url = concatUrl(event.Records[0]);
    console.log("The URL is", url);
    
    var commitId = key.substring(key.indexOf("/") + 1, key.indexOf("."));
    commitId = commitId.substring(0,7);
    postSlack(context, url, commitId);
};

function concatUrl(record) {
    var pref = "https://s3-" + record.awsRegion;
    var host = "amazonaws.com";
    var path1 = record.s3.bucket.name;
    var path2 = record.s3.object.key;
    return pref + "." + host + "/" + path1 + "/" + path2;
}

function postSlack(context, url, commitId) {
    var req = https.request({
        hostname: "hooks.slack.com",
        port: 443,
        path: "/services/T0A8AC0EP/B0H1F8TBK/Rr9cSITHEJEwkK2qoYw3ELqS", // replace with yours from previous step
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }, function(res) {
        console.log("Slack hook response status code: " + res.statusCode);
        context.succeed();
    });
 
    req.on("error", function(err) {
        console.log("Slack request error: " + JSON.stringify(err));
        context.fail(err.message);
    });
 
    pretty = "Download apk <"+url+"|"+commitId+">";
    req.write(JSON.stringify({
        text: pretty,
        username: "Tristan",
        icon_url: "https://simplyian.com/assets/travis.png"
    }));
 
    req.end();
}
