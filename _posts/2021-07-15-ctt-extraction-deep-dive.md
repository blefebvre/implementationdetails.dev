---
layout: post
title: "AEM Content Transfer Tool: Everything you wanted to know about Extraction"
summary: "From content paths to 'Overwrite staging container', get to know the Extraction phase a bit better."
twitter_image: "/images/aem/dispatcher/introducing_the_aem_dot.png"
date: 2021-03-08 21:49
comments: true
tags: [Adobe Experience Manager, AEM, dispatcher, dispatcher optimizer tool, DOT]
published: true
---
The Content Transfer Tool (CTT) is essential if you have an existing AEM site or app and intend to migrate it to AEM as a Cloud Service (AEMCS). I contribute to the CTT as part of my day job, and wanted to share an in-depth, technical 2-part series into the phases of a migration. First up: Extraction.

There is lots to consider when executing a migration, and this post is going to assume you're [read the official docs](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/moving/cloud-migration/content-transfer-tool/using-content-transfer-tool.html) already before trying any of the below on your own environment. If you do wish to follow along, you will need a source AEM instance (6.3-6.5) and be an Administrator on an AEMCS instance. I'll be using an AEM 6.4 instance backed by an Azure data store, and my AEMCS is on the latest release at the time of writing (`2021.7.5607`).

<img src="{{ site.baseurl }}/images/aem/ctt/blank-slate.png" alt="Create migration set form, all filled out" >

## Creating the migration set

While not technically part of the extraction, it is an important step so we'll cover it quickly. 

Note that if you're going to include versions, it is advised to include `/var/audit` as well, which is where some of the Assets timeline data is stored. Here's my migration set, just prior to hitting save:

<img src="{{ site.baseurl }}/images/aem/ctt/create-migration-set.png" alt="Create migration set form, all filled out" >

What should be put in "Paths to be included", you ask? Any *mutable* content paths can be migrated by the CTT. The AEM components, OSGi configs, and other immutable bits should be checked in to git instead.

