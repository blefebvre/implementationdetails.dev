---
layout: post
title: "Using SQLite Dates in a React Native app"
date: 2019-06-27 22:47
comments: true
tags: [SQLite, React, React Native, dates, datetime]
published: true
---
When I first began working with SQLite I was surprised to learn that there was no `DATE` or `DATETIME` datatype equivalent. Instead, time-based data [must be stored](https://www.sqlite.org/datatype3.html#date_and_time_datatype) as `INTEGER`, `TEXT` or `REAL` types. But, how can you logically order a `TEXT`-based date? How can you move seamlessly between [Moment.js](https://momentjs.com/) on the clientside and these primitive types in SQLite? Read on!

## Create table

If you'd like to store a date, like June 27th 2019, I would recommend using the `TEXT` datatype and providing it with date strings in the following format: `YYYY-MM-DD`. There are [other formats](https://www.sqlite.org/lang_datefunc.html) (look for "Time Strings") you can use when you need to store time of day as well, such as `YYYY-MM-DD HH:MM:SS`.

You can create a table with a column of this type during app initialization:

{% highlight js %}
tx.executeSql("CREATE TABLE IF NOT EXISTS Transaction( " +
  "id INTEGER PRIMARY KEY NOT NULL, " +
  /* other columns... */
  "transactionDate TEXT" +
  ");"
);
{% endhighlight %}

The table will be created if it does not already exist. 

## Insert

Later on, when you'd like to write to this table, craft an INSERT statement that formats your `Moment` object into a string matching one of the supported SQLite time string formats:

{% highlight js %}
function insertTransaction(transactionDate: moment.Moment, tx) {
  tx.executeSql(
    // Other columns removed to simplify example
    "INSERT INTO Transactions (transactionDate) VALUES (?)",
    [transactionDate.format("YYYY-MM-DD")]
  )
}
{% endhighlight %}

## Select

To read your date values back from the DB, craft a query that returns the column as a string and create a new `Moment` from it's value:

{% highlight js %}
function getTransactions(tx): Promise<Transaction[]> {
  return tx.executeSql(
    "SELECT id, transactionDate " +
    /* other columns... */
    "FROM Transactions " +
    /* WHERE... */
    /* 1. Note date() function call */
    "ORDER BY date(transactionDate) ASC;"
  )
  .then(([results]) => {
    if (results === undefined) return [];
    
    // Build the array of transactions
    const transactions: Transaction[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      transactions.push(
        newTransactionFromObject(row)
      );
    }
    return transactions;
  });
}

function newTransactionFromObject(row): Transaction {
  // 2. Create a new Moment from the transactionDate string
  const transactionDate = row.transactionDate ? moment(row.transactionDate) : null;
  return new Transaction(row.id, transactionDate);
}
{% endhighlight %}

There are a couple of interesting things happening in the code above:

1. Note the `date(transactionDate)` function call. This enables us to `ORDER BY` based on the date, amongst other [date-related things](https://www.sqlite.org/lang_datefunc.html). In this example the transactions will be ordered oldest to newest.
2. We can conditionally create a new `Moment` instance if the row's `transactionDate` is defined. Otherwise, it will be `null`.

You now have a date value available for use on the app's client side, in the super flexible and versatile `Moment` type.

## Further reading

The SQLite docs are concise and easy to parse: https://www.sqlite.org/docs.html

I've written a few other posts on the topic of SQLite and React Native. Check out:

- [Building an offline first app with React Native and SQLite](/blog/2018/11/06/react-native-offline-first-db-with-sqlite/)
- [Sync your React Native SQLite database between devices with Dropbox](/blog/2018/12/05/sync-react-native-sqlite-db-with-dropbox/)


