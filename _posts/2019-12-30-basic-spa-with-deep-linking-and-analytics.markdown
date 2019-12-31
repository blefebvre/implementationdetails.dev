---
layout: post
title: "Building a basic single-page site with deep linking and analytics"
summary: "Shedding all the frameworks and libraries in pursuit of a simple, accessible, highly performant site (and a perfect Lighthouse score)."
twitter_image: "/images/simple-spa/score.png"
date: 2019-12-30 22:12
comments: true
tags: [spa, vanilla js, javascript, html]
published: true
---
This holiday break I had the chance to work on a website for a very special customer. The request was straightforward: create a site with 4 pages, each with a small amount of content on it, and a clean design. Include Google Analytics to track how often it's being viewed. And it _must_ render nicely on mobile. 

No problem, I thought. This will be a straightforward site for React. Perhaps I've finally found a use case for Gatsby. Or, should I try out something new like Svelte? Maybe what my spouse really wants is a React Native App, which I can then output to web using... 

_What have I become_, I thought. There was nothing in those requirements that couldn't be handled perfectly with HTML, CSS, and a bit of JS.


## Objective

My goal for this post is to showcase the approach I took to building out this little site, and show how you too can achieve the coveted perfect Lighthouse score with nothing more than some semantic HTML (and in this case, a little hash-based navigation system):

<img src="{{ site.baseurl }}/images/simple-spa/score.png" alt="Perfect score using Chrome's Lighthouse audit tool" style="width: 100%; max-width: 700px" />


## Demo

If you'd like to skip right to the Codepen, look no further:

[https://codepen.io/blefebvre/pen/mdyMWVK](https://codepen.io/blefebvre/pen/mdyMWVK)

The details below will all be based on this stripped-down version of the actual site that I made.


## Interesting bits

When I began putting this site together, I was pleasantly surprised with how easy it was to go framework-free. A few areas to note:

### Navigation

The tabs are implemented with semantically appropriate elements; `nav` with a `role="tablist"` attribute set, and anchor elements for each tab with `role="tab"` set (lines 8-13 of the HTML in the [Codepen](https://codepen.io/blefebvre/pen/mdyMWVK)). 

With each anchor element's href set to a hash (i.e. `<a href="#fees">`), there is no need to set up a click handler on the tab elements themselves. Instead, we set up a `hashchange` event listener on the window which will fire whenever the page's hash is changed - which is the effect a click on one of our `tab` anchors will have:

{% highlight javascript %}
// Lines 34-43 in the JS pane
window.addEventListener(
  "hashchange",
  function hashChangeHandler(e) {
    e.preventDefault();
    if (location.hash) {
      openTab(location.hash);
    }
  },
  false
);
{% endhighlight %}

By centralizing the `openTab` logic in a function, we can reuse this code when the site is first opened. If a hash is provided initially we "open" that tab right away:

{% highlight javascript %}
var initialHash = location.hash;
if (initialHash) {
  openTab(initialHash);
}
{% endhighlight %}

### No JS?

What if JS is disabled? In our case, all the content is still readable! It will appear inline, section after section, but it will all be present and accessible to the user.

The trick is in avoiding hiding the content if JS is disabled, which can be done by adding a class to a top level element (such as the body) _in JS_. If the code is run, you can be confident that JS is available in this user's browser:

{% highlight javascript %}
// JS is enabled! Set a class on the body to enable our 'visuallyhidden' class
  document.body.classList.add("js-enabled");
{% endhighlight %}

On the CSS side, our `.visuallyhidden` class will only be applied when it is a child of a `.js-enabled` element:

{% highlight css %}
.js-enabled .visuallyhidden {
  /* */
}
{% endhighlight %}


## Try it yourself

It was fun to go back to the basics with this site. While I won't be moving away from React anytime soon for my more complex projects, I do recommended trying to work framework-free when possible. 

Performance, accessibility, and the maintainability of your code are three great (and important!) reasons to do so.
