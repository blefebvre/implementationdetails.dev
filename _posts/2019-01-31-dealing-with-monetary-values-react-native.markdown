---
layout: post
title: "Dealing with monetary values in a React Native app"
date: 2019-01-30 21:17
comments: true
tags: [React Native, SQLite, Big.js, TypeScript, SQLite, mobile, apps]
published: true
---
If you've been following along with the [previous](/blog/2018/12/05/precise-numbers-in-a-react-native-app/) [few](/blog/2018/11/06/react-native-offline-first-db-with-sqlite/) [posts](/blog/2018/10/12/react-native-typescript-cocoapods/), you'll know that I recently shipped a React Native app that deals with financial data. Programming languages are notably bad at representing numbers with decimal places ("floating point" numbers), and JavaScript is no exception. Need proof? Just copy and paste `console.log(0.3-0.2)` into your browser's console. If JS can't be trusted to get basic math _that you can do in your head_ right, how can it be trusted with real data?


## Goal

This post will introduce Big.js for working with floating point numbers in a React Native app, and show how it can be used with TypeScript as well as an SQLite database.


## Cents?

One option I've heard suggested is to store your monetary values in cents instead of dollars. This approach suggests that you simply multiply each value by 100 before storing it, and divide by 100 before displaying it to the user. All operations are then performed on the x100 version of the value, making it effectively an integer _assuming your data is limited to only 2 decimal places_. While this might work OK for some operations, it's not at all solid for multiplication or division. For example, say you wanted to calculate the total cost of a $24.00 item with Canadian sales tax included: `2400 * 1.13 = 2711.9999999999995` - pretty close! But not close enough for my purposes. 


## Big.js

In my search for a better solution I came accross [Big.js](https://github.com/MikeMcl/big.js/) which claims to be, "A small, fast JavaScript library for arbitrary-precision decimal arithmetic". I became a big fan (ha) of this library and ended up using it in my app wherever I needed to store a monetary value such as stock prices, exchange rates, or interest rates. One of my favourite features of Big.js is that each operation method returns a Big value, so they can be chained together. Take for example a piece of code that sums up a number of items contained in the `results` array:

```
const total: Big = results.reduce((accumulator, item) => accumulator.plus(item.value), new Big(0));
```


## Big.js and TypeScript

The npm module `@types/big.js` contains the TypeScript definition for Big.js, and I've found it to work great. With this definition installed you can create interfaces and classes which have properties that are `Big`s. 


## Big.js values and SQLite


## Extras


