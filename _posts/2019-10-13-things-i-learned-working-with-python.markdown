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
Over the past month I've been working through an introductory Machine Learning course with Python. Being completely new to Python, and finding the pace of the course quite high, I wanted to write up a post with a handful of tips and tricks I picked up before moving on to the next module in the program.

As a case study for this post, I put together some Canadian data to explore the relationship between the GDP values of each of Canada's provinces and territories to see if we can come up with a model that will predict the GDP of a region given a set of key features. 

If you have a Jupyter Notebook environment available you can download this post's [Notebook file on GitHub](https://github.com/blefebvre/machine-learning-learning/blob/master/notebooks/canada_gdp.ipynb). 👈 Whoa! Jupyter Notebooks render to HTML on GitHub. How cool is that?

## Sample data

Here's the initial dataset mentioned above, which includes the following features: `Land (km^2)`, `Population`, `Unemployment rate (%)`, as well as the target value `GDP (million, CAD)` (making this a Regression problem). Data has been collected primarily from articles on [Wikipedia](https://en.wikipedia.org/wiki/Provinces_and_territories_of_Canada):

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


## Classifying samples by their features

To further investigate this data, let's generate an additional feature based on the total GDP for the region. We'll make it a numeric value from 1 to 3, where a class of 1 indicates a relatively small GDP, 2 for medium, and 3 for large. 

We can generate this feature by calling `apply` on the DataFrame, and passing in a function to execute on each sample of the data. By passing `axis=1`, the function will be applied to each row, and the value returned from the function will be included as a new feature.

Here's how generating a GDP size class could be implemented for our problem: 

{% highlight python %}
# First, assign a class based on GDP (small: 1, medium: 2, large: 3) to enable visual differentiation 
# between the difference sizes of GDP
def classify_gdp(row):
    gdp = row['GDP (million, CAD)']
    if gdp < 10000:
        val = 1
    elif gdp >= 10000 and gdp < 100000:
        val = 2
    else:
        val = 3
    return val

canada_df['GDP size label'] = canada_df.apply(classify_gdp, axis=1)
canada_df
{% endhighlight %}


## Looking for features that will be good at predicting GDP

Now that we have our samples classified as small, medium, or large, we can use the `pandas.plotting.scatter_matrix` function to plot a matrix of scatter plots with each set of features paired up. The samples in each plot will be color coded so we can see at a glance which features are correlated to a high GPD. Here's how this code will look for our dataset:

{% highlight python %}
from matplotlib import cm
%matplotlib notebook

# First, separate training from test data
# Select only numeric features that we're interested in plotting.
# Inlcuding 'GDP (million, CAD)' wouldn't make sense here, since it would leak data about the target!
X = canada_df[['Land (km^2)', 'Population', 'Unemployment rate (%)']]

# This column of labels will be our target y values
y = canada_df['GDP size label']
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

# Plot the training values!
cmap = cm.get_cmap('gnuplot')
scatter = pd.plotting.scatter_matrix(X_train, c = y_train, marker = 'o', s = 40, hist_kwds = {'bins':15}, figsize = (9,9), cmap = cmap)
{% endhighlight %}

Here's how thr resulting chart looks:

<img src="{{ site.baseurl }}/images/python/scatter_matrix.png" alt="Comparing how feature pairs related to GDP using pandas.plotting.scatter_matrix" style="width: 100%; max-width: 500px" />


{% highlight python %}


{% endhighlight %}