---
layout: post
title: "Writing tidy SQLite statements with JS Template Literals"
date: 2019-07-28 22:47
comments: true
tags: [SQLite, React, React Native, JavaScript, template literals]
published: true
---
In reviewing an open source React Native project I'd worked on recently, I was surprised with how difficult I found parsing the SQLite statements I'd written in JavaScript. 

Quotes, `+`, `,`, newlines -- 

SQLite is flexible (quote here "Ordinary SQL statements are free-form, and can be spread across multiple lines, and can have whitespace and comments anywhere." [from](https://www.sqlite.org/cli.html))
