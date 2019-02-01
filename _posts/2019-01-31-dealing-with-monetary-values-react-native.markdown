---
layout: post
title: "Dealing with monetary values in a React Native app"
date: 2019-01-31 23:50
comments: true
tags: [React Native, SQLite, big.js, TypeScript, SQLite, mobile, apps]
published: true
---
If you've been following along with the [previous](/blog/2018/12/05/sync-react-native-sqlite-db-with-dropbox/) [few](/blog/2018/11/06/react-native-offline-first-db-with-sqlite/) [posts](/blog/2018/10/12/react-native-typescript-cocoapods/), you'll know that I recently shipped a React Native app that deals with financial data. Financial data values are very often represented by decimal numbers. Computers are good at many things, but representing decimal numbers (known technically as "floating point" numbers) is not one of them - and JavaScript is no exception. Need proof? Just copy and paste `0.3-0.2` into your nearest browser's console. If JS can't be trusted with basic math _that you can do in your head_, how can it be trusted with real data?

![Console output showing how 0.3-0.2 does not exactly equal 0.1]({{ site.baseurl }}/images/react-native/decimal_math.png)

## Goal

This post will highlight a handy library named [big.js](http://mikemcl.github.io/big.js/) for working with floating point numbers in a React Native app (or the web, or even node!), and show how it can be used with TypeScript as well as persisted in an SQLite database.


## Cents?

One suggestion I've heard for working around floating point issues is to store your monetary values in cents instead of dollars. This approach suggests that you simply multiply each value by 100 before storing it, and divide by 100 before displaying it to the user. All operations are then performed on the `x 100` version of the value, making it effectively an integer. However, this method can only work _if your data is limited to 2 decimal places_. While this might be OK in some cases, it's not at all solid for multiplication or division. For example, say you wanted to calculate the total cost of a $24.00 item with Canadian sales tax included: `2400 * 1.13 / 100 = 27.119999999999994` - pretty close! But not close enough for my purposes.

I should be clear that this method is [definitely not recommended](https://floating-point-gui.de/formats/integer/), but I've heard it mentioned enough that I wanted to address it.


## big.js

In my search for a better solution I came across [big.js](https://github.com/MikeMcl/big.js/) which claims to be, "A small, fast JavaScript library for arbitrary-precision decimal arithmetic". I became a Big fan (ha) of this library and ended up using it in my app whenever I needed to store a decimal value of any kind (including security prices, exchange rates, quantities, interest rates, etc.). One of my favourite features of big.js is that each operation method returns a Big value, so they can be chained together. Take for example a piece of code that sums up a number of items contained in the `results` array:

<!--
{% highlight js %}

{% endhighlight %}
-->

{% highlight js %}
const total: Big = results.reduce((accumulator, item) => {
    return accumulator.plus(item.value);
}, new Big(0));
{% endhighlight %}

Pretty slick!


## big.js and TypeScript

The npm module `@types/big.js` contains the [TypeScript definition](https://github.com/MikeMcl/big.js/#typescript) for big.js, and I've found it to be excellent. With this definition installed you can create interfaces and classes which have properties that are `Big` typed, allowing you to deal strictly with them whenever you would have traditionally chosen a `number`. For an example of how this looks in practice, consider the key parts of a class from my app which represents a cached stock price:

{% highlight js %}
class StockPrice {
    public price: Big;

    constructor(
        public tickerSymbol: string,
        private priceParam: number | string,
        public isExpired = false
    ) {
        // The provided priceParam is converted to a Big immediately
        this.price = newBigOrNull(priceParam);
    }
}
{% endhighlight %}

A keen eye will note the `newBigOrNull` helper function, which simply returns a new Big with the value of it's single param, or null if a non-numeric value is provided:

{% highlight js %}
const newBigOrNull = (input: number | string): Big | null => {
    if (input == null || (typeof input === "string" && input.length === 0)) {
        return null;
    }
    try {
        const big = new Big(input);
        return big;
    } catch (error) {
        return null;
    }
};
{% endhighlight %}

👆 I found this helpful when dealing with optional form fields in my app. Having a value missing from a form entry is not necessarily an error case, nor is it `0`, so I would fall back to `null`. The alternative is handling an error thrown by the library's constructor: `[big.js] Invalid number`


## big.js values and SQLite

I found that the best way to manage `Big` values in SQLite was to store them as a `TEXT` type. Reusing the stock price example from above, the `CREATE TABLE` statement would look as follows:

```
// tx is an SQLite transaction object
tx.executeSql("CREATE TABLE IF NOT EXISTS StockQuotes( " +
    "ticker_symbol TEXT PRIMARY KEY NOT NULL, " +
    "quote_value_per_unit TEXT, " +      // big.js
    "quote_invalid_after_time INTEGER" +
    ");");
```

Once read from the database, a new `StockPrice` instance can be instantiated with the `TEXT` value stored in `quote_value_per_unit` provided as `priceParam`, and a corresponding new `Big` will be initialized with it's value.

Persisting a `Big` value back to the database is also straightforward. Either insert it's `toString()` value, or store `null` in the case where a value has not been set.


## Handling different currencies

My app handled values in American (USD) and Canadian (CAD) currencies, so I needed a way to show the type of currency each time a value was rendered on the screen. I anticipated users in both the USA and Canada so I could not assume that CAD would be everyone's home currency. I came up with the following function to help render out each value in the correct locale:

{% highlight js %}
export const formatCurrency = (
    amount: Big,
    currency: string = "CAD",
    locale: string = "en-CA"
): string => {
    if (amount == null) {
        return "-";
    }

    const amountNumber: number = parseFloat(amount.toFixed(2));

    return amountNumber.toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2
    });
};
{% endhighlight %}

This helper leans on the `Number.toLocaleString()` method to do the grunt work by passing the provided `currency` and `locale` strings to it. Since we are only rendering this value out (and not performing any mathematical operations on it), we call Big's `toFixed(2)` to round the number to 2 decimal places and return a string. 

The result, as seen by a person with a device set to an American locale rendering a Canadian dollar figure:

```
cadPrice.toLocaleString("en-US", {style: "currency", currency: "CAD", minimumFractionDigits: 2});
"CA$50.25"
```

Compare this to the result of the same individual viewing a figure in USD:

```
usdPrice.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
"$50.25"   // Note how the "CA" currency code was omitted
```


## Conclusion

If you're looking to deal with numbers in a JavaScript-based app and are concerned at all about their precision or size, I highly recommend big.js: [github.com/MikeMcl/big.js/](https://github.com/MikeMcl/big.js/)

And if you're curious about why computers have such difficulty with decimal numbers, I highly recommend checking out the [Floating-Point Guide](https://floating-point-gui.de/). It gets right to the point and should help to clear up any confusion on this topic in general.

