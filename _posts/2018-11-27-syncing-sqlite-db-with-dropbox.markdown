---
layout: post
title: "Syncing an SQLite DB with Dropbox"
date: 2018-11-27 6:42
comments: true
tags: [React Native, SQLite, TypeScript, Dropbox, mobile, apps]
published: false
---
In the last two posts we have set up a React Native project [with TypeScript and CocoaPods](/blog/2018/10/12/react-native-typescript-cocoapods/), and then integrated an SQLite plugin to enable [storing relational data on-device](/blog/2018/11/06/react-native-offline-first-db-with-sqlite/). Next, let's take a look at using the Dropbox REST API to backup our database, and enable synchronization across devices. We'll begin by implementing support for the Dropbox API v2 authentication flow in our app.

## Goal

When I began looking into this topic, my initial goal was to provide a way to backup my user's data _without_ storing it on a server of my own. Additionally, I envisioned a use case where a user would install my app on two devices (say, and iPhone and iPad), and would like to have their data available on both devices. While the app would depend on an internet connection to support backup and sync, it was still important to me that the app continue to work "offline first" in the absence of connectivity. At a high level, my design for the user experience looked like this:

1. User installs my app on their iPhone.
1. User inputs their data into the app, and wishes to have a backup of their work.
1. User authenticates with the Dropbox API, and a token is passed to the app.
1. App uses this token to upload the database file to Dropbox.
1. User installs the app on another device, such as an iPad.
1. On the iPad now, the user authenticates with Dropbox and gets another token.
1. The app checks if a database file exists already on Dropbox.
1. If it does, the user is prompted to either replace their local database with the Dropbox version, or Unlink their account from Dropbox.
1. Later on, each time the app starts up, the Dropbox API will be queried for the last updated timestamp on the database file.
1. If it's newer than the device's database, the user will be prompted to overwrite their local DB.
1. On each subsequent write to the database, the database file will be send to Dropbox via the REST API.

As a bonus, Dropbox keeps revision history for each file, so this approach would enable the user to go back in time to a previous version of the database, without any additional work needed in the app!

Like the other posts in this series, I am going to focus on iOS for any platform-specific configuration that is required.

## Getting started

If you search for "react native dropbox" on Google, as I did, you may be encouraged by the number of relevant looking results that are returned. However, digging a bit deeper will reveal a number of repos with big deprecation warnings, as well as some all-in-one authentication solutions which seemed overkill for what I was trying to do. 

The approach below details how you can authenticate with Dropbox without installing any additional auth-related SDKs or packages.

The first step is to create an App on Dropbox's developer page. Head to https://www.dropbox.com/developers, and follow the "Create your app" link to begin.

For "1. Choose an API", select "Dropbox API".

For "2. Choose the type of access you need", select "App folder".

For "3. Name your app", up to you! Give it a relevant name for your project.

![Dropbox new app wizard settings]({{ site.baseurl }}/images/react-native/dropbox-sync/dropbox-create-app.png)

Click "Create app" to proceed.


## Dropbox app console settings

You should now be looking at the Dropbox [app console](https://www.dropbox.com/developers/apps) entry for your new app. There are a few settings which we'll update here before we get into the code.

First, make note of your `App key` and `App secret`. You will need these later on when constructing the request to authenticate from your React Native app.

Next, in the OAuth2 section, add a new Redirect URI in the following format:

    unique.id.for.your.app.oauth://oauthredirect

For example, I have used `com.brucelefebvre.rnsqlitelistapp.oauth://oauthredirect`. Later on, we'll need to set this id (the part before `://oauthredirect`) as one of the `CFBundleURLSchemes` that our app will respond to, so we can receive the token once our user has authenticated in Safari.

Tap "Add" to add your Redirect URI.

That's all we need to do for now on the Dropbox app console side! Before going live you will want to make sure you come back to this page and update your app's Branding with an icon, app description, publisher details, and a link to your app's website.

## React Native project setup

There are a number of ways that Dropbox could be integrated in a React Native app; what follows is merely my suggestion. This approach has worked well for me in the small side project app I shipped earlier this year. That said, I'd be happy to hear any thoughts you have on this approach in the comments.

Let's begin be creating a TypeScript class to contain our Dropbox-related logic: `DropboxIntegration.ts`

The interface for this class will look as follows:

    interface DropboxIntegration {
      // Authentication related
      authenticateWithDropboxOAuth(): Promise<void>;
      forgetUsersDropboxAccessToken(): Promise<void>;
      hasUserAuthenticatedWithDropbox(): Promise<boolean>;
      // Backup related
      getDropboxBackupState(): Promise<DropboxBackupState>;
      queueDatabaseBackup(): Promise<void>;
      downloadDatabaseFromDropbox(): Promise<void>;
      hasThisDatabaseBeenBackedUpYet(): Promise<boolean>;
      doesDatabaseUpdateExist(): Promise<boolean>;
      wasLastBackupCompleted(): Promise<boolean>;
    }

