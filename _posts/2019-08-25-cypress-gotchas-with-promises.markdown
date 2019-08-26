---
layout: post
title: "Cypress (and the Electron browser) has a problem with promises"
summary: "Tips and tricks on avoiding issues with Promises in your Cypress E2E tests."
twitter_image: "url/to/twitter/image.png"
date: 2019-08-25 21:16
comments: true
tags: [Cypress, E2E, JavaScript]
published: true
---
We use the [Cypress](https://www.cypress.io/) test framework at work for running our end-to-end tests both locally and on our continuous integration server (Jenkins). Aside from a bit of flakiness and some challenges with the Adobe ID login flow, Cypress has been excellent. That is, until I discovered that some test suites were running fine locally but being skipped altogether _yet still passing_ due to the way I had written a helper script to read from sessionStorage asynchronously, using Promises.

Before I begin: The docs are [very clear](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Not-Promises) about the fact that Cypress has it's own command queuing mechanism which means that (in theory) there should be no need to write your own asynchronous Promise-based code. Nevertheless, since many of the Cypress commands appear to be Promise-like, you might be tempted to try and `catch` an error or even write your own Promise-based helper. My experience with the latter is what led me to write this post, in which I'll share some tips and tricks on avoiding issues while using Promises from your Cypress test code.



https://github.com/blefebvre/cypress-electron-promise-issue