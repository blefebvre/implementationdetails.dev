---
layout: post
title: "Stepping through the Apache Sling Engine source code with AEM"
summary: ""
twitter_image: "/images/aem/.png"
date: 2020-09-15 11:03
comments: true
tags: [Adobe Experience Manager, AEM, Sling, Apache Sling]
published: true
---
The open source components of Adobe Experience Manager (AEM) have excellent documentation. And yet, sometimes you may find yourself wanting to go a bit deeper. A huge benefit of using open source software is the fact that _anyone_ can access the code to read it, review it, and (hopefully, one day) contribute back. So why not clone the source, hook up a debugger, and step through the code to see what's _really_ happening behind the scenes?

As a case study for this post, let's say you've noticed a strange request in your production site's logs, and want to figure out how Sling is interpreting it.

```
-> GET ///bin///querybuilder.json.css/style.css?path=/content/we-retail&p.limit=100&p.hits=full HTTP/1.1
```

For starters, I can't recommend _Reading the Docs_ - as a general approach applicable to almost any tech problem - highly enough. Sling has some great docs on it's engine which can be found here: [The Sling Engine](https://sling.apache.org/documentation/the-sling-engine.html). Of particular relevance to this post is the [URL decomposition](https://sling.apache.org/documentation/the-sling-engine/url-decomposition.html) page which includes a table of helpful examples.

Next, I'd leverage AEM's built-in tools such as the [Sling Servlet Resolver](http://localhost:4503/system/console/servletresolver) page in the Web Console. The exact purpose of this page is:

> To check which servlet is responsible for rendering a response

... and it is almost always accurate. However, if the docs don't help and the Sling Servlet Resolver isn't matching what you're seeing in practice, you may need to go a bit deeper.

## 

Clone the Sling Engine source code, which can be found here: https://github.com/apache/sling-org-apache-sling-engine

Check out the tag which is relevant to the version of AEM you are running. In my case (AEM 6.5.5), I was looking for 

You can determine the version you need by looking in the System Console for `Apache Sling Engine Implementation (org.apache.sling.engine)`: http://localhost:4502/system/console/bundles

Update the `agentlib:jdwp` JVM args you use to start AEM to enable debug mode. Add the following to the command you use to start AEM, or the quickstart/bin/start:

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:40404
```

