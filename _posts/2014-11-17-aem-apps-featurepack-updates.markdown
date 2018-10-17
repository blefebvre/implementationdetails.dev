---
layout: post
title: "AEM Apps Feature Pack Updates"
date: 2014-11-17 11:16
comments: true
tags: [AEM, CQ, Apps, PhoneGap, featurepack]
---
A keen observer of AEM's Package Share may have noticed two new offerings show up in the past couple of weeks. In particular, our team is thrilled to announce the availability of the [AEM Apps feature pack 1](https://www.adobeaemcloud.com/content/marketplace/marketplaceProxy.html?packagePath=/content/companies/public/adobe/packages/cq600/featurepack/cq-6.0.0-featurepack-4558), and an updated [Geometrixx Outdoors App sample](https://www.adobeaemcloud.com/content/marketplace/marketplaceProxy.html?packagePath=/content/companies/public/adobe/packages/cq60/product/cq-geometrixx-outdoors-app-pkg) which demonstrates the usage of these new features. Let's take a quick tour.


### Application Command Center

The feature pack includes a single user interface for managing all aspects of an app’s lifecycle. The Command Center enables you to keep app content fresh and relevant, while understanding how the app is performing in one intuitive view.

![AEM Apps Command Center]({{ site.baseurl }}/images/sample-updates/apps-command-center.png)

<!-- more -->

Towards the top left of this screenshot is the Details pane which enables configuration of app metadata including name and description, screenshots for app store submission, and update server URL amongst others. Heading clockwise is the Metrics pane which provides a high-level overview of key analytics data and gives access to Adobe Mobile Services for those wishing to delve further into the details. Last but not least is the PhoneGap Build tile which seamlessly integrates with Adobe's cloud build service, enabling users to compile apps across three platforms without installing an SDK or configuring a single environment variable (you're welcome, Windows users).


### App Update Management

Application content can be updated instantly without requiring a trip back to the platform's app store. Updates are managed through a straightforward workflow and tools are provided to verify content changes in development, staging, and production environments. 

![Content Sync Update Management]({{ site.baseurl }}/images/sample-updates/content-sync-update.jpg)

In this screenshot I'm naming my latest update - a straightforward change of business hours - to keep a log of each update that I push out to my customers.


### App Content Authoring

Content authors (non-technical users) can easily create and update app content using a touch based, WYSIWYG, drag-and-drop interface. The feature pack includes new mobile-optimized components for easy content creation.

![Touch friendly authoring in action]({{ site.baseurl }}/images/sample-updates/apps-authoring.png)

Pictured here is an app I created for my talk at [PhoneGap Day](http://pgday.phonegap.com/us2014/) which I updated over-the-air on stage to demonstrate some of the capabilities of AEM Apps. The source for my demo can be [found here](https://github.com/blefebvre/aem-pgday-talk-app).


### Digital Publishing Suite Adobe Content Viewer Access

The latest release of the Adobe Content Viewer can connect directly to an AEM authoring environment. Now AEM generated DPS content can be tested and validated without having to upload to the DPS Folio Publisher Service, enabling you to iterate more quickly on your content. 

![Adobe Content Viewer]({{ site.baseurl }}/images/sample-updates/dps-acv.png)


### But wait, there's more!

To complement the feature pack release, we've updated our [AEM Apps Starter Kit](https://github.com/Adobe-Marketing-Cloud/aem-phonegap-starter-kit) to take advantage of the state of the art in enterprise application development with AEM. Take a look at the README to see just how easy it is to bootstrap your own AEM Apps project today. 

I've also brought my [AEM Apps Kitchen Sink](https://github.com/blefebvre/aem-phonegap-kitchen-sink) project up to spec. If you haven't tried it yet, the Kitchen Sink is an AEM App which demonstrates the usage of various Cordova/PhoneGap API's, implemented as authorable components in an application that can be updated over-the-air. 

![Kitchen Sink OTA update]({{ site.baseurl }}/images/sample-updates/kitchen-sink-update.png)

On the technical side, the Kitchen Sink's AEM page component has been completely re-written using [Sightly](http://docs.adobe.com/docs/en/aem/6-0/develop/sightly.html), and we don't think you'll miss JSP _at all_. Performance junkies will be pleased to learn that every page transition in the Kitchen Sink is handled by the awesome [NativePageTransitions](http://plugins.telerik.com/plugin/native-page-transitions) plugin.

As always, feedback or questions on the above are welcome. Please feel free to reach out to me on [twitter](https://twitter.com/brucelefebvre) or via the comments on this post.

