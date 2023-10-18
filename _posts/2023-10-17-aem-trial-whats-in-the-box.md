---
layout: post
title: "What can you do with an AEM Headless Trial?"
summary: "Let's dig into an Adobe Experience Manager Headless trial and see what you get in the box."
twitter_image: "/images/aem/trial/thumbnail.png"
date: 2023-10-17 16:03
comments: true
tags: [Adobe Experience Manager, AEM, headless, trial]
published: true
---
Are you curious about Adobe Experience Manager's headless feature set and want to give it a try? Have you heard about AEM as a Cloud Service but don't have access to an environment to explore it for yourself? Your search is over!

_If you're just here for the link, look no further: [Test drive our headless CMS today](https://commerce.adobe.com/business-trial/sign-up?items%5B0%5D%5Bid%5D=649A1AF5CBC5467A25E84F2561274821&cli=bruce_blog_top&co=US&lang=en)_

Provisioning your trial environment will take up to 30 minutes, so sign up first then read on for an overview of what you can do with it. Once ready, you'll be presented with 6 learning modules that will guide you through AEM's headless features:

<img src="{{ site.baseurl }}/images/aem/trial/trials-guides.png" width=750 alt="The headless trials landing page experience, complete with 6 learning guides" >

I'll focus on my personal top 3 below.


## The Universal Editor

You've heard about it. You've seen it on stage [at conferences](https://adapt.to/2023/schedule/edit-anything-with-the-universal-editor). Why not give it a try yourself with a [live site](https://ue-trials-app.adobe.net/), backed by content in your own AEM trial environment?

<img src="{{ site.baseurl }}/images/aem/trial/ue-content-updates.png" width=750 alt="The Universal Editor, as seen authoring content in a trials environment" >

_But is it really live?_ It's a live site alright, which can be configured with a query param to fetch data from other AEM environments. You can check out my published changes here: [https://ue-trials-app.adobe.net/?publishHost=...](https://ue-trials-app.adobe.net/?publishHost=https://publish-p123104-e1209472.adobeaemcloud.com&endpoint=aem-demo-assets)

For the technical folks, the frontend React source code of this app can be found [on Github](https://github.com/blefebvre/universal-editor-sample-editable-app/).


## New Content Fragment tools

The Content Fragment Admin and Editor apps have been completely redesigned to be more intuitive, and enable your authors to independently manage content without development time.

Dig into the module titled _Customize content in a sample React app_ to test drive the new user interfaces, and preview your changes instantly in a beautiful, modern React site built for the fictitious outdoor brand WKND:

<img src="{{ site.baseurl }}/images/aem/trial/sparkle-app.png" width=750 alt="The WKND site which is used to show off the new headless features" >

Make changes directly to the content — including a swap of the main mountain biker image — then preview them instantly on the site:

<img src="{{ site.baseurl }}/images/aem/trial/cf-authoring.png" width=750 alt="Author Content Fragments with ease in the new Admin and Editor apps" >


## GraphQL APIs

Last but not least is a module which explores the GraphQL-based APIs for delivering your precious content directly to your apps and sites, in an optimized manner (thanks to persisted queries). Sticking with the WKND theme, you'll create a query that extracts your _Adventure_ content based on the model and fragment you created in earlier modules:

<img src="{{ site.baseurl }}/images/aem/trial/graphql-query.png" width=750 alt="Author Content Fragments with ease in the new Admin and Editor apps" >

With that query saved and published you'll be all set for the next module, where you'll use a CodePen app and the [AEM Headless Client for JavaScript](https://github.com/adobe/aem-headless-client-js) to fetch content directly from the publish tier of your trial environment.


## But wait, there's more!

Our hope with providing each trial environment for 30 days is that you'll go well beyond the learning guide material and build out your own models and content, to truly get a feel for AEM. Since each trial environment is a full AEM as a Cloud Service environment (albeit with no Cloud Manager deployment pipeline), you're free to explore the many features included in the platform as well.

_If you'd like to start your own trial, click here! 👉 [Test drive our headless CMS today](https://commerce.adobe.com/business-trial/sign-up?items%5B0%5D%5Bid%5D=649A1AF5CBC5467A25E84F2561274821&cli=bruce_blog_bottom&co=US&lang=en)_

And feel free to contact us directly at [aem-headless-trials-support@adobe.com](mailto:aem-headless-trials-support@adobe.com) if you run into any issues.
