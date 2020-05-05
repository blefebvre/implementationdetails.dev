---
layout: post
title: "Building an offline first app with React Native and SQLite"
summary: "This article walks through how I built an offline first React Native app using a device-local SQLite database, and details the patterns that I would recommend following when building your own."
date: 2018-11-06 7:32
comments: true
tags: [React Native, SQLite, TypeScript, CocoaPods, mobile, apps, offline first]
---
> Hello! This post has been updated and the sample code refreshed for 2020 to feature Hooks, Context, and React Native 0.61.5. You can find the new post here: 
>
> [Building an offline first app with React Native and SQLite: 2020 refresh](/blog/2020/05/03/react-native-offline-first-db-with-sqlite-hooks/)

This article walks through how I built an _offline first_ React Native app using a device-local SQLite database, and details the patterns that I would recommend following when building your own. As I mentioned in the intro of [my last post](/blog/2018/10/12/react-native-typescript-cocoapods/), I recently worked on a side project which required the secure storage of financial data in a relational manner. Due to the sensitive nature of the data, we did not want to store it on a server. The solution we came up with was one where the data would be stored locally on-device, which we found to have a number of benefits:

- There would be no server for us to manage, patch, keep online, and serve as a single point of failure for the app
- There would be no server-side code to develop, debug, load test, and monitor
- The app would work offline without any extra effort, since the entire datastore would be contained in the app's <a href="https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html" target="_blank">sandbox directory</a>
- If our users' wished to sync their data with another device, the app could be integrated with a service like <a href="https://www.dropbox.com" target="_blank">Dropbox</a> (a pattern we'd seen work well in other apps, such as <a href="https://1password.com/" target="_blank">1Password</a>)

We were sold on the approach, and began looking into options for storing relational data on-device with minimal overhead. <a href="https://www.sqlite.org/index.html" target="_blank">SQLite</a> quickly became the natural choice: it's fast, rock solid, and has been battle tested for years across a huge array of platforms and devices.

Let's start by working through adding SQLite to an existing React Native app (RN going forward) that's built with the excellent productivity combo of TypeScript and CocoaPods. Looking for steps to bootstrap an app like this? Take 10 minutes and work through these instructions first: [Get started with React Native, TypeScript, and CocoaPods](/blog/2018/10/12/react-native-typescript-cocoapods/). Or, skip right to [the code](https://github.com/blefebvre/react-native-with-typescript-and-cocoapods-demo) from the last post, but note that the dependencies will be more up-to-date if you follow the steps yourself.

## What are we building?

I created a basic List app using the approach outlined below so I could share a working example of these concepts (and code) in action. It can be found here:

Check out [React Native SQLite Demo](https://github.com/blefebvre/react-native-sqlite-demo/tree/pre-hooks) (_NOTE:_ all links in this post now point to the `pre-hooks` branch. For an updated post on this subject, [click here](/link/to/new/post)!) on GitHub.

![Demo List app running on an iPhone X sim]({{ site.baseurl }}/images/react-native/sqlite-offline/list-app-demo.png)

It's only been tested on iOS at this time, but the JS code and concepts should work on Android as well.

I'll be referencing this codebase plenty in the details below. Please do let me know if you run into any issues with the demo!

## Installing the SQLite plugin

My RN SQLite plugin of choice was built by GitHub user [andpor](https://github.com/andpor) and is called [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage). It's been very solid, supports a Promise-based API, and there is a TypeScript type definition available which checked all the boxes for me. The only downside I can see with this plugin is that it doesn't seem super active at the moment. That said, critical pull requests are still being merged, so I am optimistic that it will continue to live on.

To keep this article from getting too long I am going to focus on iOS and only document the steps that I took, but I can confirm that the plugin works on Android as well. Refer to the [README](https://github.com/andpor/react-native-sqlite-storage) instructions for further details on plugin installation.

From the root directory of your RN app, install the plugin using npm:

    npm install --save react-native-sqlite-storage

At the time of writing version `3.3.7` was the latest.

Add the following line to your `ios/Podfile`:

    pod 'react-native-sqlite-storage', :path => '../node_modules/react-native-sqlite-storage'

If you used the instructions from my last post to bootstrap your app, you will see a helpful comment in the [Podfile](https://github.com/blefebvre/react-native-with-typescript-and-cocoapods-demo/blob/master/ios/Podfile#L12), which is exactly where you should put the above line (almost like I planned this!):

    # We'll add the react-native-sqlite-storage package during a later post here

cd into the ios/ directory, and tell CocoaPods to process your Podfile:

    cd ios/
    pod install

You should see a line printed to the terminal that indicates that the Pod is being installed: "Installing react-native-sqlite-storage (3.3.7)".

Installation complete! _Did CocoaPods really save us any work, here_? I [think it did](https://github.com/andpor/react-native-sqlite-storage#without-cocoapods)!

## Don't forget the Types

To reap the full benefits of writing JS with TypeScript, we need to install a TypeScript type declaration for the SQLite plugin we just added. This will enable Visual Studio Code (or any other TypeScript-capable code editor) to perform static analysis on our code while we write, provide hints at what functions and properties are available to us (also known as intellisense), and let us know if we've provided an incompatible type as a parameter to one of those functions. I'm a huge fan and highly recommend trying it out if you are at all skeptical.

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

VS Code is able to give us intelligent tooltips (amongst other things) about the SQLite native plugin because we installed it's type declaration file above - which comes in extremely handy, especially when experimenting with a new API. We also installed the React and React Native types as part of the [previous article](/blog/2018/10/12/react-native-typescript-cocoapods/), so you will have access to this same intellisense for the entire React and RN APIs.

## Build and Run the app

Ensure the TypeScript compiler is currently running in watch mode. In my case, this is a matter of keeping a terminal tab/window open with the following command running:

    npm run tsc -- -w

From Xcode, run your app targeting a simulator of your choice. Once it's running, open up the RN developer menu from the app and toggle "Start JS Debugging" to open up a Chrome window attached to your app. With the debugger attached, devtools open, and everything wired up correctly, you will be able to see the `Database open!` log that we added above in the `SQLite.openDatabase().then()` block:

![SQLite plugin installed and functional!]({{ site.baseurl }}/images/react-native/sqlite-offline/database-opened-console-output.png)

Alright! This indicates to us that the native SQLite plugin has been installed correctly. It also means that we've installed all the native code that we need for this article, so we will not have to build and run the app from Xcode again. Instead, make sure to toggle "Enable Hot Reloading" from the app's developer menu, and the app will reload to show your latest changes as soon as you've saved a file in VS Code.

☝️ this is one of my favourite features of building apps with RN. Make sure this is all working as described before moving on (you can try making a change to App.tsx to verify)!

## Project architecture

What follows is the way that I have architected my production RN app that uses SQLite. Is it the best way? Perhaps not, but I've found it maintainable and easy to work with, even as your schema evolves over time. If you know of a better/simpler way I'd love to hear about it in the comments.

Key points about this approach:

1. The `Database` TypeScript class exports a single instance of its implementation to ensure that there is only one open connection to the DB at a time.
2. The connection is opened when the app comes to the foreground (`active`) and disconnected when the app goes to the background.
3. All CRUD operation code is contained in the Database class, which does not expose anything about the underlying SQLite datastore.
4. There is an additional `DatabaseInitialization` class which is used initially to create the SQL tables for the schema, and handles any ongoing schema changes after the app has been shipped.

Let's take a look at an outline of the `Database` class. You can find the complete class [on GitHub here](https://github.com/blefebvre/react-native-sqlite-demo/blob/pre-hooks/src/database/Database.ts):

{% highlight js %}
import SQLite from "react-native-sqlite-storage";
import { DatabaseInitialization } from "./DatabaseInitialization";

export interface Database {
    open(): Promise<SQLite.SQLiteDatabase>;
    close(): Promise<void>;
    // Define CRUD functions here
}

class DatabaseImpl implements Database {
    private databaseName = "AppDatabase.db";
    private database: SQLite.SQLiteDatabase | undefined;

    // Open the connection to the database
    public open(): Promise<SQLite.SQLiteDatabase> {
        ...
    }

    // Close the connection to the database
    public close(): Promise<void> {
        ...
    }

    // CRUD operation code goes here
}

// Export a single instance of DatabaseImpl
export const database: Database = new DatabaseImpl();
{% endhighlight %}

There's a few interesting features of TypeScript at work in this file which I wanted to point out. First, there is a `Database` interface exported at the top, which `DatabaseImpl` implements. A keen eye will notice that DatabaseImpl itself is not exported. Instead, at the bottom of the file, a single instance of DatabaseImpl is initialized and then exported.

Why do it this way? Had I exported `DatabaseImpl` instead (or more likely, simply named it `Database` and skipped the interface altogether), consumers of this API would still have the ability to instantiate their own Database object. This could then result in more than one connection to the database being open at a time -- not a bad thing in itself, but would require some additional work to close all the open connections when the app becomes inactive. 

## Connection management

Speaking of connection management brings me to the next piece of the puzzle: opening and closing our database connection at the right time during the app's lifecycle. I'll highlight key aspects of App.tsx below, but the complete file should be referenced [on GitHub here](https://github.com/blefebvre/react-native-sqlite-demo/blob/pre-hooks/src/App.tsx):

{% highlight js %}
import React, { Component } from "react";
import { AppState, StyleSheet, SafeAreaView } from "react-native";
import { database } from "./database/Database";
import { AllLists } from "./components/AllLists";

interface State {
  appState: string;
  databaseIsReady: boolean;
}

export default class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      databaseIsReady: false
    };
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  public componentDidMount() {
    // App is starting up
    this.appIsNowRunningInForeground();
    this.setState({
      appState: "active"
    });
    // Listen for app state changes
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  public componentWillUnmount() {
    // Remove app state change listener
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  public render() {
    // Once the database is ready, show the Lists
    if (this.state.databaseIsReady) {
      return (
        <SafeAreaView style={styles.container}>
          <AllLists />
        </SafeAreaView>
      );
    }
    // Else, show nothing. TODO: show a loading spinner
    return null;
  }

  // Handle the app going from foreground to background, and vice versa.
  private handleAppStateChange(nextAppState: string) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has moved from the background (or inactive) into the foreground
      this.appIsNowRunningInForeground();
    } else if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      this.appHasGoneToTheBackground();
    }
    this.setState({ appState: nextAppState });
  }

  // Code to run when app is brought to the foreground
  private appIsNowRunningInForeground() {
    console.log("App is now running in the foreground!");
    return database.open().then(() =>
      this.setState({
        databaseIsReady: true
      })
    );
  }

  // Code to run when app is sent to the background
  private appHasGoneToTheBackground() {
    console.log("App has gone to the background.");
    database.close();
  }
}

const styles = StyleSheet.create({
  ...
});

{% endhighlight %}

Two key functions to point out in this class are `appIsNowRunningInForeground()` and `appHasGoneToTheBackground()` which, as their names would suggest, are intended to be called when the app's running state changes. To support calling these functions at the right time, I am using the React Native `AppState` component to trigger an event when the app moves between states. The 3 states that we are concerned with to support opening and closing our database connection are:

- `active`: the app is open and running on device
- `inactive`: the app is in the process of moving between `active` and `background`
- `background`: the app has either been closed, or another app has taken it's place in the foreground

Taking a closer look at the `handleAppStateChange()` function, you will notice how the code treats `inactive` and `background` as the same state. This means that as soon as the app enters either of these states the connection to the database will be closed. As soon as the app enters the `active` state a connection to the database will be opened, and that connection will be managed by an implementation of the Database interface (DatabaseImpl above) for the duration of time that the app spends in the foreground.

Are there other ways that this could be done? Yes. For example, a connection could be opened each time a database operation is started. I suspected there would be a performance hit to this method, so I opted for the single-connection approach described above which has worked well for me so far.

## A TypeScript + React sidebar

You may have noticed the `State` interface in App.tsx above. A nice feature of writing React code with TypeScript is that you can precisely define the shape of the object you expect to receive as `props`, as well as the composition of the object that will be stored as `state`. I find this a much more straightforward approach than the previous React-specific solution of using PropTypes (now available on npm as `prop-types`). Let's take a closer look at the App class declaration to explain how this works:

{% highlight js %}
export default class App extends Component<object, State> {
{% endhighlight %}

By passing two type arguments (`<object, State>`) to Component, we are stating that we do not expect any specific `props` to this component via `object`, but will be storing an object in state that matches the shape of the `State` interface, defined a few lines above. This same approach works just as well with stateless functional components (for props only, of course). Let's take a look at the [Checkbox component](https://github.com/blefebvre/react-native-sqlite-demo/blob/pre-hooks/src/components/Checkbox.tsx) to see how this works within a SFC:

{% highlight js %}
interface Props {
  checked: boolean;
}

export const Checkbox = (props: Props) => {
  const { checked } = props;
  return <Text style={styles.check}>{checked ? "☑" : "⬜"}</Text>;
};
{% endhighlight %}

This little component is expecting a props object with only 1 property: `checked`, a boolean. The best part: if you use this component without specifying a `checked` prop, the TypeScript integration in VS Code will tell you about your mistake _before you even hit save_! 

![Props intellisense in VS Code]({{ site.baseurl }}/images/react-native/sqlite-offline/props-in-SFC.png)

## Initializing your database

OK! Back to the database.

Since we are using an SQLite database under the hood, we have to define our schema before we can store anything in it. Additionally we will need to provide a way to update this schema as our app evolves, and enable the database to update itself once the user has applied an update from the App Store or Google Play.

To support both these cases we will introduce a new class named DatabaseInitialization.ts, which will take the following form (you can check out the entire class [on GitHub here](https://github.com/blefebvre/react-native-sqlite-demo/blob/pre-hooks/src/database/DatabaseInitialization.ts)):

{% highlight js %}
import SQLite from "react-native-sqlite-storage";

export class DatabaseInitialization {

  // Perform updates to the database schema
  public updateDatabaseTables(database: SQLite.SQLiteDatabase): Promise<void> {
    let dbVersion: number = 0;

    // First: create tables if they do not already exist
    return database
      .transaction(this.createTables)
      .then(() => {
        // Get the current database version
        return this.getDatabaseVersion(database);
      })
      .then(version => {
        dbVersion = version;
        console.log("Current database version is: " + dbVersion);

        // Perform DB updates based on this version
        if (dbVersion < 1) {
          // Uncomment the next line, and include the referenced function below, to enable this
          // return database.transaction(this.preVersion1Inserts);
        }
        // otherwise,
        return;
      });
  }

  // Perform initial setup of the database tables
  private createTables(transaction: SQLite.Transaction) {
    // List table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS List( " +
        "list_id INTEGER PRIMARY KEY NOT NULL, " +
        "title TEXT" +
        ");"
    );

    // ListItem table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS ListItem( " +
        "item_id INTEGER PRIMARY KEY NOT NULL, " +
        "list_id INTEGER, " +
        "text TEXT, " +
        "done INTEGER DEFAULT 0, " +
        "FOREIGN KEY ( list_id ) REFERENCES List ( list_id )" +
        ");"
    );

    // Version table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS Version( " +
        "version_id INTEGER PRIMARY KEY NOT NULL, " +
        "version INTEGER" +
        ");"
    );
  }

  // Get the version of the database, as specified in the Version table
  private getDatabaseVersion(database: SQLite.SQLiteDatabase): Promise<number> {
    return database
      .executeSql("SELECT version FROM Version ORDER BY version DESC LIMIT 1;")
      .then(([results]) => {
        // return the DB version
      });
  }
{% endhighlight %}

The complete class [on GitHub](https://github.com/blefebvre/react-native-sqlite-demo/blob/pre-hooks/src/database/DatabaseInitialization.ts) includes further comments and example code detailing how the schema update process works. To provide additional context on why this is necessary, I will outline the steps taken by `updateDatabaseTables()` below:

1. SQL tables, as described in `createTables`, are created in a single transaction _if they do not already exist_. This is not the place for schema updates once your app has shipped, unless that update is a fresh new table!
1. The `Version` table is then queried to determine what version the app's local database is at. This version is then used to determine if schema changes are needed, for example if the schema has been changed during a recent app store update.
1. (optional, when schema updates are required of a live app) The version number found in the `Version` table is then compared to a hardcoded version number. For example, if the version is less than `1`, the `preVersion1Inserts` function is called which executes any number of database changes in a single transaction, getting the database set up to match version `1`.
1. (optional, when additional schema changes are needed) Once the `preVersion1Inserts` are complete -- or in the case where the database version was at `1` already -- the database version can be checked again as many times as needed, to get the schema up-to-date with the code contained in the newly-updated app binary.

## CRUD operations

All the Create, Read, Update and Delete code for dealing with Lists and ListItems in my [RN SQLite Demo app](https://github.com/blefebvre/react-native-sqlite-demo/tree/pre-hooks) is contained within the Database.ts class. I like this approach because the rest of my app can be completely ignorant about how data is being persisted, and I have the option to cleanly swap out the DatabaseImpl class for another implementation using a completely different persistence mechanism in the future, should the need arise.

What follows is a [function in DatabaseImpl](https://github.com/blefebvre/react-native-sqlite-demo/blob/pre-hooks/src/database/Database.ts) for creating a new List with a given name:

{% highlight js %}
  public createList(newListTitle: string): Promise<void> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("INSERT INTO List (title) VALUES (?);", [newListTitle])
      )
      .then(([results]) => {
        const { insertId } = results;
        console.log(
          `[db] Added list with title: "${newListTitle}"! InsertId: ${insertId}`
        );
      });
  }
{% endhighlight %}

## In conclusion

Well, that got longer than expected. Kudos to you if you've stuck with me to this point!

In case it wasn't clear above: I am a huge fan of the approach of using SQLite on-device in a React Native app, and it's truly an enjoyable development experience when combined with TypeScript. I hope the detail in this article has been helpful for you - please do reach out if anything is unclear or if I can provide any further detail. While my code above is simply a demo, I took the exact approach with it that I used in my side project app which is currently live in the App Store. 

_But Bruce, is this not an "offline only" app, as opposed to offline first_? Indeed it is. Stay tuned for the next article where I will go into detail on how you can use the Dropbox API to sync your app's database file between devices, giving you some of the benefits of having a server (backup and sync, namely), with very few of the headaches!

## Further reading

- [Sync your React Native SQLite database between devices with Dropbox](/blog/2018/12/05/sync-react-native-sqlite-db-with-dropbox/)
- [Dealing with monetary values in a React Native app](/blog/2019/01/31/dealing-with-monetary-values-react-native/)
- [React Native upgrade by example (featuring Purge Web)](/blog/2019/04/03/react-native-upgrade-by-example/)
- [Building a responsive table in React Native with Hooks](/blog/2019/06/02/react-native-responsive-table-with-hooks/)
- [Using SQLite Dates in a React Native app](/blog/2019/06/27/sqlite-dates-in-react-native/)
