---
layout: post
title: "Cypress (and the Electron browser) has a problem with Promises"
summary: "Tips and tricks on avoiding issues with Promises in your Cypress E2E tests."
twitter_image: "url/to/twitter/image.png"
date: 2019-08-25 21:16
comments: true
tags: [Cypress, E2E, JavaScript]
published: true
---
Before I begin: The Cypress docs are [very clear](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Not-Promises) that while the Cypress API looks a lot like it's based on `Promise`'s, it actually isn't. There's plenty of detail about the fact that Cypress has it's own command queuing mechanism which means that — in theory — there should be no need to write your own asynchronous Promise-based code. Nevertheless, since many of the Cypress commands appear Promise-like, your temptation to try and `catch` an error or even write your own helper function that returns a `Promise` would be completely understandable. My experience with the latter is what led me to write this post, in which I'll share a simple trick for avoiding issues while using Promises from your Cypress test code.

## Background

We use the [Cypress](https://www.cypress.io/) test framework at work for running our end-to-end tests both locally and on our continuous integration server (Jenkins). Aside from a touch of flakiness and some challenges with the Adobe ID login flow, Cypress has been excellent. That is, until I discovered that some test suites were running fine locally but being skipped altogether _yet still passing_ due to the way I had written a helper script to read from sessionStorage asynchronously, using Promises.

## Why?

We use an internal feature flags service (similar to LaunchDarkly) to turn app features on and off across `dev`, `stage`, and `prod` environments. Since the service is internal, it uses our app's access token to determine the enabled feature flags for the current user, on the environment they are signed in to. This part of the system works great.

As part of our end-to-end testing effort I wrote a helper function that determines if the test user has access to a given feature. After all, there is no point running a test on `stage` if the relevant feature flag is off on `stage` for `testUser1`. The function I wrote uses `cy.request` to hit our feature flag service directly with the access token _reused_ by pulling it out of `sessionStorage`. This is where things got interesting.

## Promises in Cypress, by example

I created a small function to read from `sessionStorage` and asynchronously fulfill a Promise once the token was successfully read. It looked similar to the below code block (from a repository I created to demonstrate this issue: [github.com/blefebvre/cypress-electron-promise-issue](https://github.com/blefebvre/cypress-electron-promise-issue)):

{% highlight js %}
// Get the user's access token from sessionStorage
export function getAccessTokenPromise() {
  return new Promise(resolve => {
    cy.window().then(win => {
      const token = win.sessionStorage.getItem("token");
      resolve(token);
    });
  });
}
{% endhighlight %}

When this function is called, it immediately returns a Promise which only becomes fulfilled once `win.sessionStorage.getItem("token")` is called and the token is read. Looks simple enough, right?

Aside! if you're new to Promises, I'd like to take this moment to recommend [We have a problem with promises
](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html) by Nolan Lawson which completely changed the way that I thought about Promises when I was first wrapping my head around them. The [Promises/A+ standard](https://promisesaplus.com/) is also worth a read, and gets right to the point.

## The issue

The above code looks correct, and Chrome thinks that it's correct too! You could run a test that uses the above function and it would happily work locally when run via the Cypress UI, assuming you are targeting the Chrome browser. 

However, if you were to run your tests using the Electron browser which ships with Cypress _or headlessly_ (which uses Electron under the hood), the tests would do perhaps the worst thing they could: **pass, but skip any test code which occurs after the call to `getAccessTokenPromise()`**.

## The solution

The Cypress docs truly are great, and the solution that I needed to make this work was in there all along: use the [Cypress.Promise utility](https://docs.cypress.io/api/utilities/promise.html#Syntax) in your test code (which is [Bluebird](https://github.com/petkaantonov/bluebird) under the hood) instead of native Promises. A replacement for the above function could be written as follows:

{% highlight js %}
export function getAccessTokenCypressPromise() {
  return new Cypress.Promise(resolve => {
    cy.window().then(win => {
      const token = win.sessionStorage.getItem("token");
      resolve(token);
    });
  });
}
{% endhighlight %}

The only difference is that I'm instantiating a new `Cypress.Promise` in this block.

## Gotchas

The one annoyance I found with using Cypress.Promise is that the resulting "Promise" cannot be `await`ed natively, since the browser does not view it as an actual Promise. Other than that, this approach has been working great.

## Result

Dare to compare the resulting log output (left hand pane) of the identical test suite run on Chrome:

<img src="{{ site.baseurl }}/images/cypress/promises/chrome.png" alt="Chrome browser running a Cypress test suite where the tests pass and all the expected log output is present." style="width: 100%; max-width: 800px" />

... with the result of that same test suite running on Electron:

<img src="{{ site.baseurl }}/images/cypress/promises/electron.png" alt="Cypress' Electron browser running a test suite where the tests pass BUT they don't execute completely." style="width: 100%; max-width: 800px" />

Oops! It appears that the Electron browser encounters a native Promise and stops dead, but the test case is still marked as ✅. You'll also notice that `await` does not work with Cypress.Promise. 

You can try out this code yourself here: [github.com/blefebvre/cypress-electron-promise-issue](https://github.com/blefebvre/cypress-electron-promise-issue)

## Conclusion

My hope is that by sharing my experience with this gotcha that I can help someone avoid a headache. It is not lost on me that I could have avoided my own headache by reading the docs more thoroughly. My experience with Cypress has otherwise been great, and I (still) highly recommend that everyone check it out for their E2E testing needs. 

Big thanks to the Cypress team for an awesome tool!
