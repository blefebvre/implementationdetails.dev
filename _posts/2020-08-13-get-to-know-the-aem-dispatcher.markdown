---
layout: post
title: "Get to know the Adobe Experience Manager Dispatcher"
summary: "The dispatcher is a critical component of a secure, stable, fault-tolerant and lightning fast AEM implementation. Get to know some of its key configurations with a series of hands-on experiments."
twitter_image: "/images/aem/dispatcher_post.png"
date: 2020-08-13 11:03
comments: true
tags: [Adobe Experience Manager, AEM, dispatcher]
published: true
---
Are you familiar with the concept of a re-fetching Dispatcher flush? Do you understand the implications of setting up an `ignoreUrlParams` allow list, vs. a block list? Have you ever gone live with a site that had a `statfileslevel` configuration set to 0?

The Dispatcher is a critical component of a secure, stable, fault-tolerant and lightning fast AEM implementation. Unfortunately, it is often an afterthought, and its large array of configurations can be overwhelming and easily misunderstood.

Our team would like to change this. As technical folks ourselves, we learn best when we're able to experiment with new tech in a safe (read: not production) environment. This is why we've created the AEM 6.5 Dispatcher Experiments open source repository on GitHub: 

👉 [https://github.com/adobe/aem-dispatcher-experiments](https://github.com/adobe/aem-dispatcher-experiments)

The goal of this repository is simple: demonstrate the impact of the Dispatcher and its configuration parameters. The medium is a series of experiments in take-home lab format complete with sample code, instructions, and JMeter test plans. Think of it like an Adobe SUMMIT lab, delivered straight to your home.

The repository includes instructions for [Running a Dispatcher Locally](https://github.com/adobe/aem-dispatcher-experiments/blob/master/docs/Local-Dispatcher-macOS.md) on macOS, so don't worry if you do not yet have a local Dispatcher ready to go. Windows instructions are in the works, too. Once set up, you'll be ready to dive into the experiments.

What do we cover? There are currently 4 experiments in the repository:

1. [Effect of Re-fetching Dispatcher Flush](https://github.com/adobe/aem-dispatcher-experiments/blob/master/experiments/refetching-flush)
2. [Effect of a /statfileslevel greater than 0](https://github.com/adobe/aem-dispatcher-experiments/blob/master/experiments/statfileslevel)
3. [Effect of an ignoreUrlParams allow list](https://github.com/adobe/aem-dispatcher-experiments/blob/master/experiments/ignoreUrlParams)
4. [Effect of the gracePeriod setting](https://github.com/adobe/aem-dispatcher-experiments/blob/master/experiments/gracePeriod)

... and we'll be adding more. Do you have an idea for an experiment or configuration you'd like to see covered? Drop us a note in the [issues](https://github.com/adobe/aem-dispatcher-experiments/issues), or send us a PR!
