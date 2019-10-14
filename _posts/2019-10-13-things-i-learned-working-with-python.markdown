---
layout: post
title: "Tips and Tricks from my first month with Python"
summary: ""
twitter_image: "/images/python/thumbnail.png"
date: 2019-10-11 22:30
comments: false
tags: [Python, numpy, pandas, machine learning]
published: true
---
For the past month I've been working through an intro course to machine learning with Python that has been offered at work. As a complete beginner to Python, I thought I would put together some of the handy APIs and tools that I used to keep as a reference for myself as I progress through the program, and also (mostly) as a means to further my comprehension of the concepts.

## Sample data

Here's a bit of Canadian data for us to work with throughout this post:

{% highlight python %}
import numpy as np
import pandas as pd

# data is a dict type
data = {'Province/Territory': 
          ['Nunavut', 'Alberta', 'Saskatchewan', 
           'Yukon', 'Manitoba', 'British Columbia', 
           'Ontario', 'Quebec', 'Prince Edward Island',
           'Newfoundland and Labrador', 
           'Northwest Territories', 'Nova Scotia', 
           'New Brunswick'],
        'Population' : 
          [35944, 4067175, 1098352, 35874, 1278365, 
           4648055, 13448494, 8164361, 142907,
           519716, 41786, 923598,
           747101],
        'Land (km^2)': 
          [1877787, 640081, 591670, 474391, 548360,
           925186, 917741, 1365128, 5660, 
           373872, 1183085, 52942, 
           71450]}

# Instantiate a new DataFrame with the above dict
canada_df = pd.DataFrame(data)
print(canada_df)
{% endhighlight %}

If all goes well when the above code is run, it should render this table:

<img src="{{ site.baseurl }}/images/python/canada_data.png" alt="Canada DataFrame including province & territory population data rendered as a table in the Jupyter Notebook environment" style="width: 100%; max-width: 500px" />