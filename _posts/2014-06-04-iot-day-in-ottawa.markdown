---
layout: post
title: "IoT Day in Ottawa"
date: 2014-06-06 11:40
comments: true
tags: [IoT, Ottawa]
---
The folks at [IoT Ottawa](http://www.meetup.com/iotottawa/events/184276702/) hosted an all-day meetup on the subject of the Internet of Things, right here in the Adobe Ottawa office tower. As someone new to the IoT field I found the many short, to-the-point sessions served as both a nice introduction to possibilities in the industry and also as a glimpse into the innovation happening right here in our backyard. What follows are my personal highlights from the day.

![Dr. Ghods on Smart Buildings]({{ site.baseurl }}/images/iot-ottawa.jpg)

(thanks to [Aali R. Alizadeh](https://twitter.com/_Aali) for sharing this picture)

<!-- more -->

### Next-Generation Wearable Tech: Fitness Intelligence

As a cyclist and runner currently tracking my training using a number of devices (Garmin Edge, Forerunner, Strava iPhone app, Wahoo Kickr) and services (Strava, TrainerRoad, Fitbit), this talk really struck a chord with me. 

In the most basic case, fitness wearables are simply accelerometers that interpret movement to calculate metrics including how many steps you've taken and floors you've climbed. When combined with some details of your physiology, they can estimate a number of additional metrics including number of calories burned and total distance traveled. The next generation of wearables will be smarter, both in terms of the sensors they use and the way they analyze and interpret the signals captured.

Advanced wearables will be able to sense and measure much more than basic motion. Hydration monitors, lactic acid monitors, and advanced motion interpretation are all features that we can expect to see in the next generation of fitness wearables. Sensors like these will be able to tell you if you're in the right zone for the length of training ride you're on, or if you're going to burn out too early. They'll be able to compare the motion and signals from your muscles to the profile of a professional athlete to provide tips on being more efficient. Using population statistics, they'll warn you if a motion you're performing has been known to lead to injury. 

Leonard MacEachern spoke on behalf of his company GestureLogic who will soon be starting a crowd funding campaign for their product, [LEO](http://leohelps.com/), which aims to fill this market niche. 


### Why Open Source will Drive IoT Innovation

When I'm not riding my bike or running I can usually be found in front of a monitor working primarily with web technology. As a web developer, I have benefited in a big way from the open nature of the www, and strongly believe that much of the success of the platform has been a result of this openness. 

Speaking as the Executive Director of the [Eclipse Foundation](http://www.eclipse.org/org/foundation/), Mike Milinkovich's message was that in order for the IoT industry to be truly disruptive, it must follow the open pattern of the web. He reminded us that no matter how much money is thrown at a technology it's still the developers who will [choose with their feet](http://thenewkingmakers.com/) where they spend their time and energy. Like Linux, Apache, the www, and the w3c have demonstrated, 'less friction' is still the best model for getting your technology in the hands of developers. 

There are many protocols emerging to support the IoT including [paho](http://www.eclipse.org/paho/), [OMA Lightweight M2M](http://iot.eclipse.org/protocols.html#oma-lwm2m), [Moquette MQTT](https://projects.eclipse.org/proposals/moquette-mqtt), and [oneM2M](http://www.onem2m.org/). Open frameworks are under development as well, including: [Kura](http://www.eclipse.org/proposals/technology.kura/), a Java & OSGi based framework, and [Ponte](https://projects.eclipse.org/projects/technology.ponte), billed as a bridge from M2M to REST.

Open hardware like the Arduino, Pi, and company will be equally as important as the software stack for ensuring the industry remains accessible to hobbyists and tinkerers alike. After his session Mike could be found giving demos of some IoT projects he's currently working on. I'm sold; my first Raspberry Pi kit will be arriving next week.


### Smart Buildings - The Future of Construction Industry

Dr. Pouria Ghods, speaking on behalf of [Giatec Scientific](http://www.giatecscientific.com/), defined 'infrastructure' as the physical structures needed to support our society. As people responsible for  infrastructure, we need to be able to sense changes, react to them, and optimize the way we perform maintenance - all while keeping things safe for public use. Traditionally this sensing has been done in two important stages: during construction, and on a schedule for the rest of the structure's lifespan.

There was much that I did not know about concrete. For example, each truckload of concrete is tested three times during the pour to ensure consistency. As I understand it, this test involves putting a small cylinder of the dried concrete under a large amount of load to ensure that it meets requirements of the structure. If it were to fail, the poured section of that structure would need to be redone. Dr. Ghods proposes that we can do better than this: by monitoring the concrete both inside the truck and again once it has been poured into its forms, we can increase our confidence in real-time that the mix is correct and consistent.

The state of the art for monitoring existing infrastructure still involves sending engineers on-site to probe and drag chains across concrete in search of faults and deterioration. Imagine instead a building that, after an earthquake, is able to report that it sensed an unusual amount of vibration on the 6th floor. Think of the time and money (and potentially, lives) that could be saved if a bridge could tell it's engineers exactly where cracking or corrosion was starting to occur, before it became a threat to public safety. 

Exciting times.
