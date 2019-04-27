---
layout: post
title: "Dealing with Monetary Values in React"
date: 2019-04-26 22:16
comments: true
tags: [React, big.js, floating point, rounding errors]
published: true
---
I gave a talk at the April 2019 installment of the [Ottawa React](https://www.meetup.com/Ottawa-ReactJS-Meetup/) meetup on the topic of "Dealing with Monetary Values in React". I had so much fun putting together this talk; from hours spent digging through my folks' photo archives for a picture of me working at Tim Hortons, to building a working replica of the cash register I remember from 16 years ago. The slides don't really stand on their own so I thought I would put together a short post with links to a few key resources.


## Floating point numbers in JavaScript

While it was a React meetup and the cash register example was built in React, these principles and libraries can work in JavaScript apps of any kind: Node, web, and React Native alike. 

The library that I highlighted for dealing with arbitrary-precision floating point numbers is one call `big.js` written by GitHub user [Michael M](https://github.com/MikeMcl). 

- GitHub: [github.com/MikeMcl/big.js](https://github.com/MikeMcl/big.js/)
- Docs: [mikemcl.github.io/big.js](http://mikemcl.github.io/big.js/)

Why is such a library needed, you might ask? Just type `0.3-0.1` into your nearest JS console to find out. While being "off" by such a small fraction might seem insignificant, these rounding errors become compounded over a number of operations. When precision is critical, I'd recommend reaching for a library like [big.js](https://github.com/MikeMcl/big.js/).


## Why not store prices in cents?

I wrote about this [in a previous post](https://brucelefebvre.com/blog/2019/01/31/dealing-with-monetary-values-react-native/#cents), which also goes into more detail about my admiration for `big.js` as well as how to use it with an SQLite database in a React Native app. 

For another take on the downsides to the cents approach, check out the definitive [Floating Point Guide](https://floating-point-gui.de/formats/integer/).


## Floating point numbers

If I piqued your interest about how floating point numbers work in computers, I would like to point you to a few resources that helped me understand the topic:

1. [Floating Point Numbers - Computerphile](https://www.youtube.com/watch?v=PZRI1IfStY0) on YouTube
1. [Floating Point Arithmetic 1: Addition](https://www.youtube.com/watch?v=KiWz-mGFqHI) on YouTube
1. The entire [Floating-Point Guide](https://floating-point-gui.de/) site

