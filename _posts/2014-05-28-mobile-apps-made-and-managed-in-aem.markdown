---
layout: post
title: "Mobile Apps: Made and managed in AEM"
date: 2014-05-30 00:07
comments: true
tags: [AEM, CQ, PhoneGap, ConnectWebex, apps]
---
I'm thrilled to be returning to Basel this summer to present at the conference formerly known as CQCON: [CONNECT Web Experience](http://www.connectcon.ch/2014/en.html). This year I'll be speaking about building and managing mobile applications within AEM, with a focus on the technical details of the solution.

To frame the context of the integration between AEM and PhoneGap, I told a story of a hypothetical company looking to extend the reach of their content by [building a mobile app](/blog/2014/03/14/so-you-want-to-build-an-app/). Since presenting at both [Adobe SUMMIT](http://tv.adobe.com/watch/adobe-summit-2014/technical-session-mobile-app-development-and-content-management-with-aem/) and [AEMHub](/blog/2014/04/10/aemhub-mobile-apps-in-aem/), I've had a chance to work with some real, non-hypothetical customers, and have selected a few themes from these experiences to highlight for an audience of highly-technical AEM pros.

<!-- more -->

Build it yourself, or leverage an existing library? Lean on jQuery/Zepto/xui, or forge on alone? AngularJS, Ember or Backbone? Bacon, ham or sausage? Today's web developer has options aplenty when it comes to building product - too many even, you might argue. As developers of mobile apps we must choose carefully to ensure we're simplifying our code base while not restricting our options as the platform evolves. We need to be conscious that all the processing power and memory available to our app will fit into our user's pocket ('Note' users excluded). We must recognize that expectations of a mobile app are very different from that of the web, especially with regard to offline availability of content. As such, the decision of which 3rd party libraries to depend and build upon must be deeper than simply picking the flavour of the week. I'll dig into the libraries we've had success working with and describe the long (and somewhat bumpy) road that led us to them.

Whether dealing with products in a commerce scenario or physical properties in hospitality, app content often involves a set of items that should be rendered in a similar fashion. This type of data lends itself nicely to a template based approach, one that is well supported by AngularJS. I'll present one approach to structuring your data for consumption by AngularJS that results in a scalable - and maintainable - AEM app. 

PhoneGap's Javascript to native bridge is a key piece of the framework, one that serves to distinguish your app from a traditional mobile website by exposing access to platform APIs through it's pluggable architecture. Some of the functionality supported by featured Cordova plugins include capturing images via the device camera(s), access to the contact database, file system access, and [many more](http://plugins.cordova.io/#/). I'll present the patterns we followed to expose this bridge to our app's components, and share code samples that'll have you up and running with your own project in no time. 

See you there.

[CONNECT Web Experience](http://www.connectcon.ch/2014/en.html)
