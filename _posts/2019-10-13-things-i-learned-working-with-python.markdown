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
For the past month I've been working through an intro to Machine Learning course using Python. Being completely new to Python, I thought it might help with my retention of the content to put together a post on the handy libraries, functions, and tools that I've come across so far. 

As a case study for this post, I put together some Canadian data to explore the relationship between the GDP values of each of Canada's provinces and territories to see if we can come up with a model that will predict the GDP of a region given a handful of key features. 

If you have a Jupyter Notebook environment available you can download this post's [Notebook file on GitHub](https://github.com/blefebvre/machine-learning-learning/blob/master/notebooks/canada_gdp.ipynb). 👈 Whoa! Jupyter Notebooks render to HTML on GitHub. How cool is that?

## Sample data

Here's the initial dataset mentioned above, which includes features `Land (km^2)`, `Population`, `Unemployment rate (%)`, as well as the target value `GDP (million, CAD)` (making this a Regression problem):

{% highlight python %}
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

data = {
    'Province/Territory': 
        ['Nunavut', 'Alberta', 'Saskatchewan', 
        'Yukon', 'Manitoba', 'British Columbia', 
        'Ontario', 'Quebec', 'Prince Edward Island',
        'Newfoundland and Labrador', 
        'Northwest Territories', 'Nova Scotia', 
        'New Brunswick'],
    'Land (km^2)': 
        [1877787, 640081, 591670, 474391, 548360,
        925186, 917741, 1365128, 5660, 
        373872, 1183085, 52942, 71450],
    'Population': 
        [35944, 4067175, 1098352, 35874, 1278365, 
        4648055, 13448494, 8164361, 142907,
        519716, 41786, 923598, 747101],
    'Unemployment rate (%)':
        [14.1, 6.6, 6.1, 2.7, 6, 4.7, 5.6, 5.5,
        9.4, 13.8, 7.3, 7.5, 8],
    'GDP (million, CAD)': 
        [2846, 331937, 79513, 2895, 71019,
        282204, 825805, 417173, 6652,
        33074, 4856, 42715, 36088]
}

# Instantiate a new DataFrame with the above dict
canada_df = pd.DataFrame(data)

# Pick the columns we want from the original dict, and indicate the desired order.
# This is necessary for versions of Python before 3.6, which did not maintain an order in the dict type.
canada_df = canada_df[['Province/Territory', 'Land (km^2)', 'Population', 'Unemployment rate (%)', 'GDP (million, CAD)']]

print(canada_df)
{% endhighlight %}

If all goes well when the above code is run, it should render a table similar to:

<img src="{{ site.baseurl }}/images/python/canada_data.png" alt="Canada DataFrame including province & territory population data rendered as a table in the Jupyter Notebook environment" style="width: 100%; max-width: 500px" />

We'll use this data set as the subject of our investigation for the remainder of this post.


## Examining data

Most real world datasets will not be able to fit completely on your laptop monitor, so it will be necessary to examine their data programmatically. Looking at _our_ data and searching for factors that may lead to a higher GDP, let's begin by counting the number of provinces with "high" unemployment vs. "low", where a province is classified as "high" if it's % unemployment is > 7% (an arbitrary number that I picked):

{% highlight python %}
high_unemployment_series = canada_df['Unemployment rate (%)'] > 7

high_unemployment_count = len(high_unemployment_series[high_unemployment_series == True].index)
low_unemployment_count = len(high_unemployment_series[high_unemployment_series == False].index)

print("High unemployment: ", high_unemployment_count) # 6
print("Low unemployment: ", low_unemployment_count)   # 7 
{% endhighlight %}


