---
layout: post
title: "Introducing the AEM Dispatcher Optimizer Tool"
summary: "A tool to help on your journey in pursuit of an optimal dispatcher configuration."
twitter_image: "/images/aem/dispatcher"
date: 2021-03-07 21:58
comments: true
tags: [Adobe Experience Manager, AEM, dispatcher, dispatcher optimizer tool, DOT]
published: true
---
What defines an "optimal" Adobe Experience Manager (AEM) Dispatcher configuration? And if there really is such a thing, why not just print it here in place of this post? Better yet, prevent anyone from actually configuring the Dispatcher at all, and _only_ support the optimal configuration!

Unfortunately, it's not quite that simple. While the exact property values, number of farms and vhosts, and contents of the `/filter` set will vary between each AEM implementation, there does exist a common set of goals which all optimal Dispatcher configurations seek to achieve. At a high level, an optimal config will:

1. Maximize the cache hit ratio of the public facing site
2. Reduce the impact of unexpected or malicious requests
3. Limit the effect of activations on the contents of the cache

At Adobe, we've been working on a tool to help you optimize your use of the Dispatcher in pursuit of these 3 goals. In this post I'll be introducing you to the **AEM Dispatcher Optimizer Tool**, or DOT for short.

## What is the AEM Dispatcher Optimizer Tool (DOT)?

In its initial release, the DOT will be available in two forms:

- A Maven plugin for static configuration analysis during development
- A code quality step in the Adobe Managed Services (AMS) Cloud Manager pipeline

The DOT works by parsing the dispatcher module of an AEM archetype-based Maven project, analyzes it based on an extensible set of rules, and returns actionable details on all issues that are identified.

Its also completely open source! You can find the code here: [github.com/adobe/aem-dispatcher-optimizer-tool](https://github.com/adobe/aem-dispatcher-optimizer-tool) 

## What kind of issues can it detect?

The issues which the DOT detects can be broken down into two main categories: Syntax, and Best practice.

### Syntax rules

This group of rules all relate to how syntactically correct the Dispatcher configuration is. For example: Are there properties set in a section where they don't belong? Is there an extra brace? A missing brace? Mismatched quotes? Is there an `Include` directive in the Apache Httpd config which references a file that doesn't exist?

Can you spot the issue with this `/filter` configuration? The DOT can!

```
/filter {
    /00 { /url "/*" /type "deny" }
    /01 { /type "allow" /extension '(html)' /path "/content/*" } }
    /02 { /type "deny" /selectors '(feed|rss|pages)'
}
```

### Best practice rules

Configurations which are syntactically valid from the Dispatcher (or Apache's) perspective may still have other opportunities for improvement. The next group of rules detects violations of AEM best practices. 

#### Value checks

These rules look for the presence of specific values in the configuration, and can also check that a property value is above (or below) a given threshold. For example, are all the default filter deny rules set? Is `/serveStaleOnError` enabled? Are `/statfileslevel` and `/gracePeriod` set, and with values greater than or equal to 2?

These rules primarily help achieve goals 1. (Maximize the cache hit ratio) and 3. (Limit the effect of activations on the contents of the cache).

_Shameless plug:_ if you'd like to experiment with a number of these properties in a controlled environment (read: not your public site), check out the lab-format [AEM Dispatcher Experiments](https://github.com/adobe/aem-dispatcher-experiments) repository.

#### Allow list checks

The allow list rules are all about reducing the impact of _unexpected_ requests made to the public facing site. What is an unexpected request? I would classify anything that occurs outside of the regular traffic resulting from legitimate users browsing the site as "unexpected."

The 3 allow list rules help achieve goals 1. (Maximize the cache hit ratio) and 2. (Reduce the impact of unexpected or malicious requests) by preventing requests containing unexpected query parameters from being treated as a cache misses, and by outright blocking requests containing unexpected Sling selectors and suffixes.


## Can I run it on my project today?

You bet! Check out the AEM DOT Dispatcher experiment for details: [Using the Dispatcher Optimizer Tool (DOT)](https://github.com/adobe/aem-dispatcher-experiments/tree/main/experiments/optimizer)

## Can the rule set be extended?

The "core" rules that are used when the Maven plugin is run can absolutely be extended. The DOT experiment covers this use case as well: [Test #5 - Overlay some rules](https://github.com/adobe/aem-dispatcher-experiments/tree/main/experiments/optimizer#test-5---overlay-some-rules)


## Summary

It's important to remember that there is no singular "optimal" dispatcher configuration out there. However, we believe that there _is_ an optimal configuration for your unique AEM implementation. The goal of the Dispatcher Optimizer Tool is to give you guidance to help you find it, and point you to resources that can build your knowledge and understanding of this critical component of a performant and resilient AEM deployment.


<!-- 
<img src="{{ site.baseurl }}/images/react-native/macos/macOS-no-sync.png" alt="Screenshot of the app notifying the user that Dropbox sync is not available on macOS" width="350">
-->
