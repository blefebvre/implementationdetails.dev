---
layout: post
title: "Building an offline first app with React Native and SQLite"
date: 2018-10-12 22:34
comments: true
tags: [React Native, SQLite, TypeScript, CocoaPods, mobile, apps]
---
This article will get you started with an offline first, Promise based, device-local SQLite database in a React Native app running on iOS. As I mentioned in the intro of [my last post](/blog/2018/10/12/react-native-typescript-cocoapods/), I recently worked on a side project which required the storage of financial data in a relational manner. Due to the sensitive nature of the data, we did not want to store it on a server. The solution we came up with was one where the data would be stored locally on-device, which we found to have a number of benefits:

- There would be no server for us to manage, patch, keep online, and serve as a single point of failure for the app
- There would be no server-side code to develop, debug, load test, and monitor
- The app would work offline out-of-the-box, since this would be the primary use case
- If our users' wished to sync their data with another device, the app could be integrated with a service like [Dropbox](https://www.dropbox.com) (a pattern we'd seen work well in other apps, such as [1Password](https://1password.com/))

We were sold on the approach, and I began looking into options for storing relational data device-side with minimal overhead. SQLite quickly became the natural choice: it's fast, rock solid, and has been battle tested for years across a huge array of platforms and devices. Let's work through adding SQLite to an existing React Native app (RN going forward) that's built with the killer productivity combo of TypeScript and CocoaPods.

Looking for steps to bootstrap an app like this? Take 10 minutes and work through these instructions first: [Get started with React Native, TypeScript, and CocoaPods](/blog/2018/10/12/react-native-typescript-cocoapods/). Or, skip right to [the code](https://github.com/blefebvre/react-native-with-typescript-and-cocoapods-demo), but note that the dependencies will be more up-to-date if you follow the steps yourself.


## Installing the SQLite Native Plugin

I have been using a plugin by GitHub user [andpor](https://github.com/andpor) called [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage). It's been very solid, supports a Promise-based API, and there is a TypeScript type definition available which checked all the boxes for me. The only downside I can see with this plugin is that it doesn't seem super active at the moment. That said, critical pull requests are still being merged, so I am optimistic that it will continue to live on. 

Follow the [README](https://github.com/andpor/react-native-sqlite-storage) instructions for details on installation of the plugin. To keep this article from getting too long I am going to focus on iOS and only document the exact steps that I took, but I can confirm that the plugin works on Android as well.

From the root directory of your RN app, install the plugin using npm:

    npm install --save react-native-sqlite-storage

At the time of writing version `3.3.7` was the latest.

Add the following line to your `ios/Podfile`:

    pod 'react-native-sqlite-storage', :path => '../node_modules/react-native-sqlite-storage'

If you used the instructions from my last post to bootstrap your app, you will see a helpful comment in the Podfile, which is exactly where you should put the above line (almost like I planned this!):

    # We'll add the react-native-sqlite-storage package during a later post here

cd into the ios/ directory, and tell CocoaPods to process your Podfile:

    cd ios/
    pod install

You should see a line printed to the terminal that indicates that the Pod is being installed: "Installing react-native-sqlite-storage (3.3.7)".

Installation complete! _Did CocoaPods really save us any work, here_? I [think it did](https://github.com/andpor/react-native-sqlite-storage#without-cocoapods)!

## Don't forget the Types

To reap the full benefits of writing JS with TypeScript, we need to install a TypeScript type declaration for the SQLite plugin we just added. This will enable Visual Studio Code (or any other TypeScript-capable code editor) to perform static analysis on our code while we write, provide hints at what functions and properties are available for us (also known as intellisense), and let us know if we've provided an incompatible type as a parameter to one of those functions. I'm a huge fan and highly recommend trying it out if you are at all skeptical.

To install the [type declaration](https://www.npmjs.com/package/@types/react-native-sqlite-storage) for the react-native-sqlite-storage plugin (make sure you are in the root directory of the app, as opposed to the ios/ dir):

    npm install --save-dev @types/react-native-sqlite-storage

Let's take a moment to test that everything is working so far. If you have not done so already, open up the app in Visual Studio Code, or another code editor that works well with TypeScript:

    code .

Locate and open App.tsx. Add the react-native-sqlite-storage import toward the top of the file, just below the 'react-native' import line.

    import SQLite from "react-native-sqlite-storage";

Still in App.tsx, add the following `componentDidMount` block as a method in the App class:

    public componentDidMount() {
        SQLite.DEBUG(true);
        SQLite.enablePromise(true);

        SQLite.openDatabase({
            name: "TestDatabase",
            location: "default"
        }).then((db) => {
            console.log("Database open!");
        });
    }

What's that? You don't like putting database code directly in your main App component? Don't worry! This is just temporary to make sure things are wired up correctly. We'll remove it shortly.

If you were to type the above code into App.tsx instead of copy/pasting it, you would notice something magical happening:

![TypeScript Intellisense in action]({{ site.baseurl }}/images/react-native/sqlite-offline/typescript-in-action.png)

VS Code is able to give us intelligent tooltips about the SQLite native plugin because we installed it's type declaration file above - which is amazing, and super handy. We also installed the React and React Native types as part of the [previous article](/blog/2018/10/12/react-native-typescript-cocoapods/), so you will have access to this same intellisense for the entire React and RN APIs.

## Build and Run the app

Ensure the TypeScript compiler is currently running in watch mode. In my case, this is a matter of keeping a terminal tab/window open with the following command running:

    npm run tsc -- -w

From Xcode, run your app targeting a simulator of your choice. Once it's running, open up the RN developer menu from the app and toggle "Start JS Debugging" to open up a Chrome window attached to your app. With the debugger attached, devtools open, and everything wired up correctly, you will be able to see the `Database open!` log that we added above in the `SQLite.openDatabase().then()` block:

![SQLite plugin installed and functional!]({{ site.baseurl }}/images/react-native/sqlite-offline/database-opened-console-output.png)

Alright! This indicates to us that the native SQLite plugin has been installed correctly. It also means that we've installed all the native code that we need for this article, so we will not have to build and run the app from Xcode again. Instead, make sure to toggle "Enable Hot Reloading" from the app's developer menu, and the app will reload to show your latest changes as soon as you've saved a file in your code editor. 

☝️ this is one of my favourite features of building apps with RN. Make sure this is all working as described before moving on (you can try making a change to App.tsx to verify)!

## Project architecture

What follows is the way that I have architected my production RN app that uses SQLite. Is it the best way? Perhaps not, but I've found it maintainable and easy to work with, even as your schema evolves. If you know of a better/simpler way I'd love to hear about it in the comments! 

Key notes about this approach:

1. My Database class exports a single instance of itself to ensure that there is only one open connection to the DB at a time. 
2. The connection is opened when the app comes to the foreground (`active`) and disconnected when the app goes to the background.
3. All CRUD operation code is contained in a Database class, which is written in TypeScript and does not expose anything about the underlying SQLite datastore.
4. There is an additional DatabaseInitialization class which is used initially to create the SQL tables for the schema, and handles any additional `alter`s once the app has been shipped.

Let's start by stubbing in Database.ts. You can find the complete class [on GitHub here]().


