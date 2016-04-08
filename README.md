The project was developed during [HackTBILISI Fall 2015](http://hacktbilisi2015.devpost.com) festival.
_Tristan the Deployer_ helps you build the Android app distribution pipeline.
You can find demo video [here](http://devpost.com/software/tristan-the-deployer).

![pipeline](http://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/331/537/datas/gallery.jpg)

## Setup

To set up project for your own Android project follow these steps:

1. Link your GitHub repo to [Travis](https://docs.travis-ci.com/user/getting-started/)
2. Setup [.travis.yml](tavis.yml) to upload artifacts to Amazon S3
3. Connect S3 and AWS [Lambda](http://docs.aws.amazon.com/AmazonS3/latest/UG/SettingBucketNotifications.html)
4. Create Slack organisation and get custom hook [url](https://api.slack.com/custom-integrations)
5. Write [script](executor.js) for lambda to post to Slack

## Configure

### .travis.yml

##### `script` section
runs gradle task and initializes `BUCKET` and `DIR` variables.
For example, if GitHub repo is `gkiko/Popcorn` then `BUCKET=gkiko` and `DIR=Popcorn`.
These variables will be handy when storing data in S3.

Notice on bucket naming

> Bucket names can contain lowercase letters, numbers, and hyphens. Each label must start and end with a lowercase letter or a number

My S3 console says that bucket names can contain only lowercase characters. More info [here](http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html)

##### `before_deploy` section
`./gradlew assemble` command saves build output in `app/` directory:

```
app/build/outputs/apk/app-debug-unaligned.apk
app/build/outputs/apk/app-debug.apk
app/build/outputs/apk/app-release-unaligned.apk
app/build/outputs/apk/app-release-unsigned.apk
```

We are only interested in `app-debug.apk`. Script in `before_deploy` moves the `.apk` in new directory and deletes other files.
`app-debug.apk` is renamed with git _commit hash_ and placed under the direcotry maching GitHub project name.

```
app/build/outputs/apk/Popcorn/f75cb468aa1dd50d981691b42edf6c562ec3abfe.apk
```
