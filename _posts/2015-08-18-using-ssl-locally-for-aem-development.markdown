---
layout: post
title: "Using SSL locally for AEM dev"
date: 2015-08-19 00:02
comments: true
tags: AEM, SSL, https
---
Set up an AEM publish instance with SSL to enable local, OS X-based development on `:8443`. These instructions are deliberately concise and not designed to be used in prod (refer to the [official docs](https://docs.adobe.com/docs/en/aem/6-0/deploy/configuring/config-ssl.html) for that).

![Publish instance with an untrusted cert in action]({{ site.baseurl }}/images/ssl-pub/ssl-geo.png)


### You will need

- An AEM publish instance (accessible - for the moment - on `:4503`)
- A machine running OS X (the following was tested on Yosemite)

<!-- more -->

### Generate keys

Navigate to your publish instance's `crx-quickstart` directory:

	$ cd crx-quickstart/

Create an `ssl/` directory, and use `keytool` to generate your keystore file (replacing 'password' below, if desired):

	$ mkdir ssl
	$ cd ssl/
	$ keytool -genkeypair -keyalg RSA -validity 3650 -alias cqse -keystore cqkeystore.keystore -keypass password -storepass password
	<enter cert details as prompted>

A file named 'cqkeystore.keystore' will be created in your current working directory.


### AEM configuration

Navigate to CRX/de on your publish instance ([http://localhost:4503/crx/de/index.jsp](http://localhost:4503/crx/de/index.jsp)) and log in with an administrator account. 

Using the content browser, navigate to `/apps/`. Right click and create a folder called 'system', and inside this new folder create another called 'config'.

![Create folders using CRXde]({{ site.baseurl }}/images/ssl-pub/create-folder.png)

Tap 'Save All' to persist your new folders. 

Create a new file in `/apps/system/config/` named 'org.apache.felix.http.config'. For the contents of the file, paste in the following:

	org.apache.felix.https.enable=B"true"
	org.apache.felix.https.keystore="crx-quickstart/ssl/cqkeystore.keystore"
	org.apache.felix.https.keystore.key.password="password"
	org.apache.felix.https.truststore="crx-quickstart/ssl/cqkeystore.keystore"
	org.apache.felix.https.truststore.password="password"
	org.apache.felix.http.nio=B"true"
	org.osgi.service.http.port.secure=I"8443"

If you replaced 'password' for the `keytool` command, make sure you use the same value in the above. Tap 'Save All' to persist your new config file.


### Try it out

![Unsafe!]({{ site.baseurl }}/images/ssl-pub/ssl-unsafe.png)

With any luck, your https-capable publisher should now be available at [https://localhost:8443/](https://localhost:8443/). You may see a page warning you against servers that use untrusted certificates, but for development purposes you can hit (on Chrome) 'Advanced', and 'Proceed to localhost (unsafe)'.

