---
layout: post
title: "Setting up a Dispatcher on OS X"
date: 2013-08-22 22:40
comments: true
tags: [AEM, CQ, dispatcher]
---
The dispatcher is an important piece of a secure, stable, and solidly-performing AEM implementation. According to [the documentation](http://dev.day.com/docs/en/cq/current/deploying/dispatcher.html) it can provide caching, load balancing, as well as help to protect your publish instances from attack. For such a multifaceted tool it seems to receive very little attention during the dev process, typically called to action in the final stages of a deployment when most of the dev work has already been done. I propose that developers (including myself) could write better code if they had a deeper understanding of this tool, which is why I went through the process of setting one up on my Mac. What follows are my notes.

Here's what you'll need to get started:

<!-- more -->

- OS X machine with Apache installed and enabled
- AEM 5.6.1 quickstart
	- author on :4502
	- publish on :4503

Figure out which version of Apache httpd you're working with:

	$ httpd -v

Download and extract the correct dispatcher version for your httpd:

[https://www.adobeaemcloud.com/content/companies/public/adobe/dispatcher/dispatcher.html](https://www.adobeaemcloud.com/content/companies/public/adobe/dispatcher/dispatcher.html)

Inside the extracted directory you will find a file named 'dispatcher-apache&lt;version&gt;.so'. Copy this file to /usr/libexec/apache2. In my case:

	$ sudo cp dispatcher-apache2.2-4.1.4.so /usr/libexec/apache2

Head to the apache2 modules directory:

 	$ cd /usr/libexec/apache2/

 Create a symlink to the dispatcher module you just copied over:

 	$ sudo ln -s dispatcher-apache2.2-4.1.4.so mod_dispatcher.so

Head to /etc/apache2 to configure it:

	$ cd /etc/apache2

Open httpd.conf (as root) with your editor of choice and add the following line to the end of the LoadModule section (line 119 in my case):

	LoadModule dispatcher_module libexec/apache2/mod_dispatcher.so

After this line, add the following configuration:

	# configure the minimal setting for the dispatcher
	# the main configuration is read from the 'DispatcherConfig' file.
	<IfModule disp_apache2.c>
	    # location of the configuration file. eg: 'conf/dispatcher.any'
	    DispatcherConfig /etc/apache2/conf/dispatcher.any
	 
	    # location of the dispatcher log file. eg: 'logs/dispatcher.log'
	    DispatcherLog    /var/log/apache2/dispatcher.log
	 
	    # log level for the dispatcher log
	    # 0 Errors
	    # 1 Warnings
	    # 2 Infos
	    # 3 Debug
	    DispatcherLogLevel 3
	 
	    # if turned to 1, the dispatcher looks like a normal module
	    # since build 5210, this setting has no effect, since it used to crash
	    # apache if set to 0.
	    DispatcherNoServerHeader 1
	 
	    # if turned to 1, request to / are not handled by the dispatcher
	    # use the mod_alias then for the correct mapping
	    DispatcherDeclineRoot 0
	</IfModule>
	 
	<Directory />
	    <IfModule disp_apache2.c>
	        # enable dispatcher for ALL request. if this is too restrictive,
	        # move it to another location
	        SetHandler dispatcher-handler
	        ModMimeUsePathInfo On
	    </IfModule>
	 
	    Options FollowSymLinks
	    AllowOverride None
	</Directory>

Create a directory named 'conf' in /etc/apache2

	$ sudo mkdir /etc/apache2/conf

From the extracted dispatcher directory, copy the provided dispatcher.any to conf:

	$ cd ~/Downloads/dispatcher-apache2.2-darwin-x86-64-4.1.4/conf/
	$ sudo cp dispatcher.any /etc/apache2/conf/

Open the copy of dispatcher.any with your editor of choice. Look for the '/renders' entry, and point the '/rend01' instance host name and port to your publish instance:

	/hostname "127.0.0.1"
	/port "4503"

Allow requests with authorized header (uncomment and change value) in dispatcher.any:

	/allowAuthorized "1"

Set the document root directory (search for the existing value):

	/docroot "/Library/WebServer/Documents"

Check your config syntax:

	$ sudo apachectl configtest

The previous command should have outputted 'Syntax OK'. 

Did it not? You may need to correct your configuration. 'apachectl configtest' should be able to tell you on which line your config is broken.

Give your httpd document root directory to the _www user and group:

	$ sudo chown _www:_www /Library/WebServer/Documents/

Stop Apache httpd:

	$ sudo apachectl stop

In another terminal window (or tab), tail the following log files for errors:

	$ tail -f /var/log/apache2/error_log /var/log/apache2/dispatcher.log

Start Apache httpd back up:

	$ sudo apachectl start

Barring any errors in the logs you should now be able to browse your AEM publish content via the dispatcher:

[http://localhost/content/geometrixx-media/en.html](http://localhost/content/geometrixx-media/en.html)

You can also poke around /Library/WebServer/Documents/ to see how the static content is stored on the file system.

That's it! You've just configured your very own dispatcher. I've only scratched the surface here and really glazed over much of the configuration, so make sure to read the following resources before releasing this dispatcher into the wild:

Dispatcher - [http://dev.day.com/docs/en/cq/current/deploying/dispatcher.html](http://dev.day.com/docs/en/cq/current/deploying/dispatcher.html)

Configuring Dispatcher - [http://dev.day.com/docs/en/cq/current/deploying/dispatcher/disp_config.html](http://dev.day.com/docs/en/cq/current/deploying/dispatcher/disp_config.html)

Security Checklist - [http://dev.day.com/docs/en/cq/current/deploying/security_checklist.html](http://dev.day.com/docs/en/cq/current/deploying/security_checklist.html)
