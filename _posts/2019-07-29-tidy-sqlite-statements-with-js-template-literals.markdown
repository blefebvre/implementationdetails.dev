---
layout: post
title: "Tidy SQLite statements with JS Template Literals"
date: 2019-07-29 22:16
comments: true
tags: [SQLite, React, React Native, JavaScript, template literals]
published: true
---
While reviewing an open source [React Native project](https://github.com/blefebvre/react-native-sqlite-demo) I'd worked on recently, I was surprised with how difficult I found parsing the SQLite statements that I'd written in JavaScript. It seemed that my best efforts of breaking a long statement into multiple lines had added a number of characters which negatively affected the _human_ readability of the code. Take the following `CREATE TABLE` statement as an example:

{% highlight js %}
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
{% endhighlight %}

It turns out that SQLite is very flexible when it comes to the whitespace used between tokens in a statement ([from the docs](https://www.sqlite.org/cli.html#rules_for_dot_commands_)):

> Ordinary SQL statements are free-form, and can be spread across multiple lines, and can have whitespace and comments anywhere.

Knowing this, it dawned on me that there was really no benefit in trying to concatenate everything into a single-line string. It only took rewriting a single statement to use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) before I was hooked. Here's the same statement from above tidied up using template literals:

{% highlight js %}
// ListItem table
transaction.executeSql(`
  CREATE TABLE IF NOT EXISTS ListItem(
    item_id INTEGER PRIMARY KEY NOT NULL,
    list_id INTEGER,
    text TEXT,
    done INTEGER DEFAULT 0,
    FOREIGN KEY ( list_id ) REFERENCES List ( list_id )
  );
`);
{% endhighlight %}

Big improvement!