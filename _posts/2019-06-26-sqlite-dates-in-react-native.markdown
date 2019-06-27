---
layout: post
title: "Using SQLite Dates in a React Native app"
date: 2019-06-26 20:04
comments: true
tags: [SQLite, React, React Native, dates, datetime]
published: true
---
When I first began working with SQLite I was surprised to learn that there was no `DATE` or `DATETIME` equivalent. Instead, time-based data must be stored as `INTEGER`, `TEXT` or `REAL` [types](https://www.sqlite.org/datatype3.html#date_and_time_datatype). But, how can you logically order a `TEXT`-based date? How can you move seamlessly between `moment` on the clientside and these primitive types in SQLite? Read on!


