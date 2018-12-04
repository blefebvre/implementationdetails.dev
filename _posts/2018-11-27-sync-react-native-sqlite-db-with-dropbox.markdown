---
layout: post
title: "Sync your React Native SQLite database between devices with Dropbox"
date: 2018-11-27 6:42
comments: true
tags: [React Native, SQLite, TypeScript, Dropbox, mobile, apps]
published: true
---
In the last two posts we have set up a React Native project [with TypeScript and CocoaPods](/blog/2018/10/12/react-native-typescript-cocoapods/), and then integrated an SQLite plugin to enable [storing relational data on-device](/blog/2018/11/06/react-native-offline-first-db-with-sqlite/). Next, let's take a look at using the Dropbox REST API to backup our database, and enable synchronization between devices. We'll begin by implementing support for Dropbox v2 authorization in our app, and then use the token we are granted to enable synchronization of our database file via the Dropbox `files` API.


## Goal

When I began looking into this topic my goal was to provide a way to backup my user's data _without_ storing it on a server that I would need to implement (and maintain). I also envisioned a use case where my app could be installed on more than one device (say, a user's iPhone and iPad), and up-to-date data would be available on both devices. While the app would depend on an internet connection to support backup and sync, it was important to me that the app continue to work "offline first" in the absence of connectivity. 

At a high level, my concept for the overall flow looked like this:

1. User installs the app on their iPhone.
1. User inputs their data into the app, and wishes to have a backup of their work.
1. User authorizes with the Dropbox API, and a token is granted to the app.
1. App uses this token to upload the database file to Dropbox.
1. User installs the app on another device, such as an iPad.
1. On the iPad now, the user authenticates with Dropbox and is granted another token.
1. The app checks if a database file exists already on Dropbox.
1. Since it does, the user is prompted to either replace their local database with the Dropbox copy.
1. Later on, each time the app starts up, the Dropbox API will be queried for the last updated timestamp on the database file.
1. If it's newer than the device's database, the user will be prompted to download it and overwrite their local DB.
1. On each subsequent write to the database, the database file will be sent to Dropbox via the REST API.

As a bonus: Dropbox keeps revision history for each file, so this approach would enable the user to go back in time to a previous version of their database, without requiring any additional code in the app to support this!

Like the other posts in this series, I am going to focus on iOS for any platform-specific configuration that is required.

## Getting started

If you search for "react native dropbox" on Google, as I did, you may be encouraged by the number of relevant looking results that are returned. However, digging a bit deeper will reveal a number of GitHub repos with big deprecation warnings, as well as some all-in-one authentication solutions which seemed overkill for what I was trying to do. 

The approach below details how you can use the Dropbox API without installing any additional auth-related SDKs or packages.

The first step is to create an App on Dropbox's developer page. Head to https://www.dropbox.com/developers, and follow the "Create your app" link to begin.

For "1. Choose an API", select "Dropbox API".

For "2. Choose the type of access you need", select "App folder".

For "3. Name your app", up to you! Give it a relevant name for your project.

![Dropbox new app wizard settings]({{ site.baseurl }}/images/react-native/dropbox-sync/dropbox-create-app.png)

Click "Create app" to proceed.


## Dropbox app console settings

You should now be looking at the Dropbox [app console](https://www.dropbox.com/developers/apps) entry for your new app. There are a few settings which we'll update here before we get into the code.

First, make note of your `App key`. You will need this value later on when constructing the request to authenticate from your React Native app. We will not need `App secret` for this use case.

Next, in the OAuth2 section, add a new Redirect URI in the following format:

    unique.id.for.your.app.oauth://oauthredirect

For example, I have used `com.brucelefebvre.rnsqlitelistapp.oauth://oauthredirect` in my [demo List app](https://github.com/blefebvre/react-native-sqlite-demo). Later on, we'll need to set this id (the part before `://oauthredirect`) as one of the `CFBundleURLSchemes` that our iOS app will respond to, so we can receive the token from Dropbox once our end user has granted the app permission.

Tap "Add" to add your Redirect URI.

With that, we're ready to roll as far as the Dropbox app console is concerned. Before going live you will want to make sure you come back to this page and update your app's Branding with an icon, app description, publisher details, and a link to your app's website.


## React Native project setup

There are a number of ways that Dropbox could be integrated in a React Native app; what follows is merely my suggestion. This approach has worked well for me in the small side project app I shipped earlier this year. That said, I'd be interested to hear any thoughts you have on this approach in the comments.

There are a few 3rd party dependencies that I've added to help with various aspects of this use case, including:

- dealing with the filesystem on React Native ([react-native-fs](https://www.npmjs.com/package/react-native-fs))
- fetching remote files ([rn-fetch-blob](https://www.npmjs.com/package/rn-fetch-blob))
- working with timestamps ([moment](https://www.npmjs.com/package/moment))
- reloading the app ([react-native-restart](https://www.npmjs.com/package/react-native-restart))
- and parsing querystrings ([shitty-qs](https://www.npmjs.com/package/shitty-qs))

These can all be added with the following command:

    npm install --save react-native-fs rn-fetch-blob moment react-native-restart shitty-qs

The libraries that deal with the filesystem need to have native code linked up to our Xcode project, so we'll add three lines to our `ios/Podfile` (Where, exactly? Check out the [complete Podfile](https://github.com/blefebvre/react-native-sqlite-demo/blob/master/ios/Podfile)):

    pod 'RNFS', :path => '../node_modules/react-native-fs'
    pod 'rn-fetch-blob', :path => '../node_modules/rn-fetch-blob'
    pod 'RCTRestart', :path => '../node_modules/react-native-restart/ios'

Next, install the new Pods:

    cd ios/
    pod install

For the complete TypeScript experience, let's install type definitions for the dependencies we just added:

    npm install --save @types/react-native-fs

A keen eye will note that we're only installing types for 1 of the 5 dependencies we installed above. Well, lucky for us, `moment` includes TypeScript support in it's main npm package. `rn-fetch-blob` has a merged [pull req](https://github.com/joltup/rn-fetch-blob/pull/184) to include a type def in it's package, but it's not been released to npm at the time of writing. 

If you're _really_ a TypeScript keener, as I am, you can take the not-yet-released index.d.ts [from master](https://github.com/joltup/rn-fetch-blob/blob/master/index.d.ts) and create the corresponding file in your project's `node_modules/rn-fetch-blob/`. Note that since this directory should be ignored by source control, taking this action will not benefit anyone else on your team, and will get overwritten if you install a new version of `rn-fetch-blob` later on.

Are you new to Cocoapods or TypeScript? I wrote a little post on bootstrapping a React Native project with both tools wired up: [Get started with React Native, TypeScript, and CocoaPods](/blog/2018/10/12/react-native-typescript-cocoapods/)

And with that, we're ready to get into the code.


## iOS project configuration

On the iOS project side, we need to ensure we have the RCTLinkingIOS React Cocoapod subspec included in our Podfile (which the demo app [already does](https://github.com/blefebvre/react-native-sqlite-demo/blob/master/ios/Podfile#L8)), as well as a bit of Objective-C code added to `AppDelegate.m` to support handling deep links into our app. The official React Native docs have details on the code snippet that you'll need to [handle deep links](https://facebook.github.io/react-native/docs/linking#handling-deep-links).

Our app needs to know which URL schemes to respond to. With our project's `*.xcworkspace` file opened in Xcode, open the app's properties editor and navigate to the Info tab. Here you will find the "URL Types" setting. Add a new item with the "URL Schemes" field set to the Redirect URI `id` value you chose during the Dropbox app console setup above (`com.brucelefebvre.rnsqlitelistapp.oauth` in my demo app's case):

![Xcode properties page for handling deep links]({{ site.baseurl }}/images/react-native/dropbox-sync/deep_links_xcode_setup.png)

For more detail on this step, check out the "Register Your URL Scheme" section of the [Apple dev docs](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app).


## Authorizing with Dropbox

In an attempt to keep this post readable, I am going to keep the code that I embed to a minimum and link to my (fully functional) example project whenever possible: [github.com/blefebvre/react-native-sqlite-demo](https://github.com/blefebvre/react-native-sqlite-demo) 

Before we can sync anything with Dropbox we will need our user's permission to do so. I've broken down the sync-related code into two interfaces in the example app: [Authorize](https://github.com/blefebvre/react-native-sqlite-demo/blob/dropbox-sync/src/sync/Authorize.ts) and [DatabaseSync](https://github.com/blefebvre/react-native-sqlite-demo/blob/dropbox-sync/src/sync/DatabaseSync.ts). I attempted to keep these interfaces generic enough that another backend could replace the Dropbox implementation, if ever needed. You'll find the Dropbox implementation of these interfaces in the `src/sync/dropbox/` folder.

The `Authorize` interface defines 3 functions: one to authorize, one to revoke that authorization, and one to query if the app is authorized:

<!--
{% highlight js %}

{% endhighlight %}
-->

{% highlight js %}
export interface Authorize {
  authorize(): Promise<void>;
  revokeAuthorization(): Promise<void>;
  hasUserAuthorized(): Promise<boolean>;
}
{% endhighlight %}

In the Dropbox implementation, the `authorize` function opens the device's browser to [dropbox.com/oauth2/authorize](https://github.com/blefebvre/react-native-sqlite-demo/blob/dropbox-sync/src/sync/dropbox/DropboxConstants.ts#L7) complete with our app's [client_id](https://github.com/blefebvre/react-native-sqlite-demo/blob/dropbox-sync/src/sync/dropbox/DropboxAuthorize.ts#L33) (generated by Dropbox above), redirect_uri, a requested response type (`token`), and a randomly generated `state` value included as query parameters.

_Aside!_ Why is this optional `state` value included? From the [Dropbox API docs](https://www.dropbox.com/developers/documentation/http/documentation#authorization): [state can contain] "Up to 500 bytes of arbitrary data that will be passed back to your redirect URI. This parameter should be used to protect against cross-site request forgery (CSRF)." In other words, it enables us to verify if the deep link response from Dropbox is the one we are expecting, as opposed to a malicious user crafting a link that opens up our app with a Dropbox token that links to _another_ account. I highly recommend that you make use of it in your implementation as well.

Once the user indicates they would like to link their Dropbox account (perhaps by tapping a button in the app), a web browser will open up to dropbox.com and either ask them to sign in, or take them right to the authorization step (if already signed in). How this page looks can be configured in the Dropbox app console to include your app's logo and other metadata:

![Authorize step on dropbox.com]({{ site.baseurl }}/images/react-native/dropbox-sync/authorize_on_dropbox.png)

Let's take a closer look at the Dropbox implementation in the demo list app, in [DropboxAuthorize.ts](https://github.com/blefebvre/react-native-sqlite-demo/blob/dropbox-sync/src/sync/dropbox/DropboxAuthorize.ts#L29). The React Native `Linking.openURL()` call returns a Promise which, once resolved, we attached a listener to the "uri" type (using `Linking.addEventListener()`). This enables our app's JS code to be notified when the app is opened with a deep link that matches the URL Scheme we specified in Xcode.

With this logic in place, and our Xcode project configured correctly, the user will see a dialog like this asking if they would like to be taken back to our app once they tap the blue "Allow" button:

![Authorize step on dropbox.com]({{ site.baseurl }}/images/react-native/dropbox-sync/open_in_app.png)

As "Open" is tapped, our Linking event listener will finally be called! In [this function](https://github.com/blefebvre/react-native-sqlite-demo/blob/dropbox-sync/src/sync/dropbox/DropboxAuthorize.ts#L95), we then parse the deep link's query string, ensure that our `state` value matches what was passed back to the app, and lastly record the Dropbox access token and account ID values that were granted to us via `AsyncStorage`.


## When to authorize?





