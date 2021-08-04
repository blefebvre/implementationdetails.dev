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
The Content Transfer Tool (CTT) is essential if you have an existing AEM site or app and intend to migrate it to AEM as a Cloud Service (AEMaaCS). I contribute to the CTT as part of my day job, and wanted to share an in-depth, technical 2-part series into the phases of a migration. First up: Extraction.

There is lots to consider when executing a migration, and this post is going to assume you're [read the official docs](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/moving/cloud-migration/content-transfer-tool/using-content-transfer-tool.html) and explored the [Cloud Acceleration Manager](https://experience.adobe.com/#/aem/migration) before trying any of the below on your own environment. If you do wish to follow along, you will need a source AEM instance (version 6.3-6.5) and a user who is part of the `administrators` group on your target AEMaaCS environment. I'll be using an AEM 6.4 instance backed by an Azure data store, and my AEMaaCS environment is running the latest release at the time of writing (`2021.7.5662`). 

With the latest [CTT release](https://experience.adobe.com/#/downloads/content/software-distribution/en/aemcloud.html) installed on my source AEM instance — v1.5.4 at the time of writing — I'm ready to begin:

<img src="{{ site.baseurl }}/images/aem/ctt/blank-slate.png" alt="CTT tool UI, with no migration sets created yet" >

## Creating the migration set

While not technically part of the extraction, it is an important step so we'll cover it quickly. 

Note that if you're going to "Include versions", it is advised to include `/var/audit` as one of the Paths to migrate, since this the location where some of the Assets timeline data is stored. Here's my migration set, just prior to hitting save:

<img src="{{ site.baseurl }}/images/aem/ctt/create-migration-set.png" alt="Create migration set form, all filled out" >

What should be put in "Paths to be included", you ask? Any *mutable* content paths can be migrated by the CTT. The AEM components, OSGi configs, and other immutable bits should be checked in to git and pushed up to Cloud Manager instead.

## The initial Extraction 

<img src="{{ site.baseurl }}/images/aem/ctt/extract.png" width=500 alt="Extract button clicked after selecting the migration set" >

"Select the migration set you just created and click the Extract button already!" I can hear you urging. But we're not quite ready just yet. 

As stated above, my source instance is using an Azure Blob Storage data store. This means that the majority of the binary content in my AEM instance — images, videos, documents, etc; typically any file greater than 16kb — is already stored in the cloud. The *exact* public cloud used by the source is not so important, just so long as it's either Amazon S3 or Azure Blob Storage. So why is this environment detail relevant to our initial extraction?

The majority of the time spent during a typical extraction is to transfer all the large binary objects — or blobs, if you prefer — from the source AEM instance to the migration container (a temporary Azure Blob Storage container allocated for each migration set). Speeding this step up can reduce the total extraction time from the ballpark of 10 days to less than 10 hours (!) for a 10 TB data store.

The exact steps to enable this binary pre-copy step are covered very nicely in the [Handling Large Content Repositories](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/moving/cloud-migration/content-transfer-tool/handling-large-content-repositories.html?lang=en) doc. To enable it for my instance, had to add the following `azcopy.config` file my instance's `crx-quickstart/cloud-migration/` directory:

```
azCopyPath=/usr/local/bin/azcopy
azureSas=https://bruceblobs.blob.core.windows.net/azure-aem-64?sig=TOP_SECRET_SIGNATURE
```

Your own Azure SAS URI, or S3 connection details, will need to be provided in this file to enable AzCopy to orchestrate a transfer between AEM's container and the migration container.

With `azcopy.config` in place, the transfer is ready to proceed. Select the migration set and click Extract to open the following dialog:

<img src="{{ site.baseurl }}/images/aem/ctt/extraction-dialog.png" width=350 alt="Extraction dialog displaying details about the extraction" >

## To "Overwrite staging container" or not?

There's one option in this dialog which can have a big impact on subsequent "delta" or "top-up" extractions. So what does this toggle actually do?

During the initial extraction it has no effect. Since there isn't actually a migration container created until the extraction begins, there is nothing to overwrite.

However, during subsequent extractions, this setting should almost always be toggled "off" to minimize the time that the extraction will take.

So when should "Overwrite staging container" be toggled "on"

# The skyline-content-migrator Jar



## Interpreting the logs



## Deltas/Top-ups



## Next steps


