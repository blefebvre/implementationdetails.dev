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
For the past month I've been working through an intro to machine learning with Python course on the Coursera platform. As a complete beginner to Python, I wanted to put together some of the handy APIs and tools that I've found useful to keep as a reference for myself as I progress through the program, and also (mostly) as a means to further my comprehension of the concepts.

## Sample data

Here's a bit of Canadian data for us to work with throughout this post:

{% highlight python %}
import numpy as np
import pandas as pd

# data is a dict type
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
print(canada_df)
{% endhighlight %}

If all goes well when the above code is run, it should render a table similar to this one:

<img src="{{ site.baseurl }}/images/python/canada_data.png" alt="Canada DataFrame including province & territory population data rendered as a table in the Jupyter Notebook environment" style="width: 100%; max-width: 500px" />





# ROUGH NOTES

stacking a column onto a 2d array:

    data_and_target = np.column_stack((cancer['data'], cancer['target']))

create a pandas series with named columns (index), and an overall name:

    series = pd.Series(data=[malignant_count, benign_count], index=['malignant', 'benign'], name='target')

split the target values from the training:

    X = cancerdf.drop(['target'], axis=1)
    y = cancerdf['target']

get the mean accuracy for a classifier:

    score = knn.score(X_test, y_test)

look for relationships in the data:

    scatter = pd.plotting.scatter_matrix(X_train, c= y_train, marker = 'o', s=40, hist_kwds={'bins':15}, figsize=(9,9), cmap=cmap)