---
layout: post
title: "Step through the source code of AEM's Apache Sling Engine"
summary: "Sling's URL decomposition can seem complicated. Hook up a debugger to see how it works behind the scenes."
twitter_image: "/images/aem/.png"
date: 2020-09-15 11:03
comments: true
tags: [Adobe Experience Manager, AEM, Sling, Apache Sling]
published: true
---
The open source components of Adobe Experience Manager (AEM) have excellent documentation. And yet, sometimes you may find yourself wanting to go a bit deeper. A huge benefit of using open source software is the fact that anyone can access the code to read it, review it, and (hopefully, one day) contribute back. So why not clone the source, hook up a debugger, and step through the code to see what's _really_ happening behind the scenes?

As a case study for this post, let's say you've noticed a strange request in your production site's logs, and want to figure out how Sling is interpreting it.

```
-> GET ///bin///querybuilder.json.css/style.css?path=/content/we-retail&p.limit=100&p.hits=full HTTP/1.1
```

For starters, I can't recommend _Reading the Docs_ - as a general approach applicable to most tech problems - highly enough. Sling has some great docs on its engine which can be found here: [The Sling Engine](https://sling.apache.org/documentation/the-sling-engine.html). Of particular relevance to this post is the [URL decomposition](https://sling.apache.org/documentation/the-sling-engine/url-decomposition.html) page which includes a table of helpful examples.

As a next step, I'd leverage AEM's built-in tools such as the [Sling Servlet Resolver](http://localhost:4503/system/console/servletresolver) page in the Web Console. The exact purpose of this page is, "to check which servlet is responsible for rendering a response". And it is _usually_ quite accurate. For instance, entering the request path above results in the following:

<img src="{{ site.baseurl }}/images/aem/sling/servletresolver.png" alt="Screenshot of AEM's Sling Servlet Resolver utility" width="700">

> The resource given by path '///bin///querybuilder' does not exist. Therefore no resource type could be determined!

It's true that there is no resource at this path. But, this request is returning JSON data, so there must be _something_ that is handling it.

If the docs aren't helping and the Sling Servlet Resolver isn't matching what you're seeing in practice, you may need to go a bit deeper.

## Get the source

To begin, clone the Sling Engine source code to your machine. It be found here: https://github.com/apache/sling-org-apache-sling-engine

```
git clone git@github.com:apache/sling-org-apache-sling-engine.git
```

Check out the tag which is relevant to the version of AEM you are running. You can determine the version you need by looking in the System Console for `Apache Sling Engine Implementation (org.apache.sling.engine)`: http://localhost:4502/system/console/bundles

<img src="{{ site.baseurl }}/images/aem/sling/sling_bundle_version.png" alt="The version of Sling can be found in the System Console" width="800">

In my case (AEM 6.5.5), Sling `2.7.2` was being used. The names of all the tags are listed on the [GitHub releases page](https://github.com/apache/sling-org-apache-sling-engine/releases):

```
git checkout org.apache.sling.engine-2.7.2
```

Open the source code using an IDE of your choice. You can debug Java code with a full fledged IDE like IntelliJ or Eclipse, or opt for a lighter-weight option with the excellent Visual Studio Code editor. Just make sure you install the [Debugger for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug) extension if you do opt to use for VS Code.

With that, you now have an exact copy of the Sling Engine source which is running inside of your AEM instance.

## Enable `debug` mode

In order to connect a debugger to the JVM which is running AEM, you will need to set the `agentlib:jdwp` JVM arg as part of the command you use to start AEM. You can update the script in quickstart/bin/start to include this arg, or simply modify the command you use to run AEM:

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:40404
```

Note that you cannot hook up a debugger to an AEM instance which was started by double-clicking the .jar file.

Make note of the address port above: `40404`. You will need this port later on when configuring your IDE.

## Connect your IDE

