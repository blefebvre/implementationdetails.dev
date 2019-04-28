---
layout: post
title: "React Ottawa: Dealing with Monetary Values"
date: 2019-04-28 11:16
comments: true
tags: [React, big.js, floating point, rounding errors]
published: true
---
I gave a talk at the April 2019 installment of the [Ottawa React](https://www.meetup.com/Ottawa-ReactJS-Meetup/) meetup on the topic of "Dealing with Monetary Values in React." I had so much fun putting together this talk; from hours spent digging through my folks' photo archives for a picture of me working at Tim Hortons, to building a working replica of the cash register I remember from 16 years ago. The slides don't really stand on their own so I thought I would put together a short post with links to a few resources.

<img src="{{ site.baseurl }}/images/react-ottawa/cash_register_and_my_replica_small.png" alt="Side by side: screengrab from a video of a Tim's register in use, and my demo app replica to the right" />

👆Side by side: screengrab from [a video](https://www.youtube.com/watch?v=ROmKx7h22M0) of a Tim's register in use, and my [demo app replica](https://brucelefebvre.com/tims-register/) to the right.


## Floating point numbers in JavaScript

While it was a React meetup and my cash register example was built with React, these principles and libraries can work in JavaScript apps of any kind: Node, web, Electron and React Native alike. 

The library that I highlighted for dealing with arbitrary-precision floating point numbers is one called `big.js` written by GitHub user [Michael M](https://github.com/MikeMcl). 

- GitHub: [github.com/MikeMcl/big.js](https://github.com/MikeMcl/big.js/)
- Docs: [mikemcl.github.io/big.js](http://mikemcl.github.io/big.js/)

Why is such a library needed, you might ask? Just type `0.3-0.1` into your nearest JS console to find out. While being "off" by such a small fraction might seem insignificant, these rounding errors become compounded over a series of operations. When precision is critical, I'd recommend reaching for a library like [big.js](https://github.com/MikeMcl/big.js/).


## Why not store prices in cents?

I wrote about this [in a previous post](https://brucelefebvre.com/blog/2019/01/31/dealing-with-monetary-values-react-native/#cents) which also goes into more detail about my admiration for `big.js`, as well as details on using it with an SQLite database in a React Native app. 

For another take on the downsides to the cents approach, check out the definitive [Floating Point Guide](https://floating-point-gui.de/formats/integer/).


## Show me the code!

The cash register example I demo'd can be found here:

- Github: [github.com/blefebvre/tims-register](https://github.com/blefebvre/tims-register)
- Deployed app (using big.js - no rounding errors 😎): [brucelefebvre.com/tims-register](https://brucelefebvre.com/tims-register/)
- Changes to move from using built-in JS math to big.js: [compare/pre-big.js...master](https://github.com/blefebvre/tims-register/compare/pre-big.js...master)

The app was built with a few neat pieces of tech:

- Latest release of [Create React App](https://facebook.github.io/create-react-app/) (v3.0.0)
- Redux! This was my first time wiring together a Redux app, end-to-end
- Hooks! I referenced code from an article ([Reusing logic with React Hooks](https://medium.com/@nicolaslopezj/reusing-logic-with-react-hooks-8e691f7352fa) by Nicolás López Jullian) to support [using the keyboard](https://github.com/blefebvre/tims-register/blob/master/src/hooks/KeyboardEvent.ts) to interact with my cash register's numpad
- CSS grid layout - I relied heavily on the [CSS-tricks guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [big.js](https://github.com/MikeMcl/big.js/), of course

Details on running the code can be found in the [README](https://github.com/blefebvre/tims-register/blob/master/README.md), but let me know if you run into any issues.


## Floating point numbers

If I piqued your interest about how floating point numbers work in computers, I would like to point you to a few resources that helped build my understanding of the topic:

1. [Floating Point Numbers - Computerphile](https://www.youtube.com/watch?v=PZRI1IfStY0) on YouTube
1. [Floating Point Arithmetic 1: Addition - Jacob Schrum](https://www.youtube.com/watch?v=KiWz-mGFqHI) on YouTube
1. The entire [Floating-Point Guide](https://floating-point-gui.de/) site

Lastly, a big thanks to those that came out to the meetup, to Shopify for hosting, and to the organizers for putting together a consistently awesome event! Don't miss Kent C. Dodds (!!) next month: [meetup.com/Ottawa-ReactJS-Meetup/events/260941602/](https://www.meetup.com/Ottawa-ReactJS-Meetup/events/260941602/)
