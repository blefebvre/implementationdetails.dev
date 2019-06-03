---
layout: post
title: "Building a responsive table in React Native with Hooks"
date: 2019-06-02 22:36
comments: true
tags: [React, React Native, hooks, responsive, tables]
published: true
---
This post details a technique that you can use in a dual orientation app to render more (or less) data in your tables–as space permits—using a couple of simple hooks. Keeping in mind that the _last thing_ our app users want is to be unable to access the data they're looking for, we'll provide a hint showing how they can rotate their device to reveal even more. 

Let's begin with an example of how your app can look when you try to cram _everything_ onto a small screen. This is the situation we'll aim to avoid:

<img src="{{ site.baseurl }}/images/react-native/responsive-tables/too_much_data.png" alt="Table with too many columns for the screen, data all mashed up" style="max-width: 400px" />

The first thing you'll need is some tabular data in your app. For my sample app (code can be found here: [blefebvre/react-native-responsive-table](https://github.com/blefebvre/react-native-responsive-table) ), I have used the [react-native-table-component](https://www.npmjs.com/package/react-native-table-component) package for rendering my table. This package provides a simple API and some handy extension points for styling various aspects of the table. The sample app includes six columns of data, representing securities in a stock portfolio:

{% highlight js %}
// Table header items
const head = [
  "Ticker",
  "Quantity",
  "Avg. Cost",
  "Total Cost",
  "Price",
  "Market Value"
];

// Table data rows
const data = [
  ["ADBE", "4", "$270.45", "$1,081.80", "$278.25", "$1,113.00"],
  ["AAPL", "9", "$180.18", "$1,621.62", "$178.35", "$1,605.15"],
  ["GOOGL", "3", "$1,023.58", "$3,070.74", "$1,119.94", "$3,359.82"],
  ["AIR", "10", "$113.12", "$1,131.20", "$116.64", "$1,166.40"],
  ["MSFT", "6", "$129.89", "$779.34", "$126.18", "$757.08"]
];
{% endhighlight %}

Next, you'll need to decide which columns of data you'd like to prioritize on small and medium screens. In my case, I chose to show "Ticker", "Quantity", and "Market Value" on small screens. On medium screens I chose to show everything except "Total Cost". Put your selections into two arrays:

{% highlight js %}
// Indices (columns) to include on a small screen
export const smallScreenIndices = [0, 1, 5];

// Indices to include on a medium screen
export const mediumScreenIndices = [0, 1, 2, 4, 5];
{% endhighlight %}

We will also need a function that can figure out which items should be included given a device breakpoint, and return the reduced set of data. Here's an example of how this function [could be implemented](https://github.com/blefebvre/react-native-responsive-table/blob/master/src/responsive/reduceDataForScreenSize.ts#L4):

{% highlight js %}
// Reduce arrays for display on smaller screens 
// based on the provided breakpoint.
export function reduceDataForScreenSize(
  data: any[],
  breakpoint: Breakpoint,
  smallBreakpointIndices: number[],
  mediumBreakpointIndices: number[]
) {
  switch (breakpoint) {
    case Breakpoint.SMALL:
      // Return only data in the smallBreakpointIndices
      return data.filter((_, i) => smallBreakpointIndices.indexOf(i) !== -1);
    case Breakpoint.MEDIUM:
      // Return only data in the mediumBreakpointIndices
      return data.filter((_, i) => mediumBreakpointIndices.indexOf(i) !== -1);
    default:
      // Don't filter the data at all
      return data;
  }
}
{% endhighlight %}

A keen eye will have noticed the `Breakpoint` TypeScript type above. This parameter type is an enum, and is defined in [useBreakpoint.ts](https://github.com/blefebvre/react-native-responsive-table/blob/master/src/hooks/useBreakpoint.ts#L3) as follows:

{% highlight js %}
export enum Breakpoint {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}
{% endhighlight %}

We will need a way to determine the breakpoint for use by the `reduceDataForScreenSize(..)` function. I wrote a small hook called [useBreakpoint](https://github.com/blefebvre/react-native-responsive-table/blob/master/src/hooks/useBreakpoint.ts#L10) to return the current matching breakpoint, which relies on another hook called [useScreenDimensions](https://github.com/blefebvre/react-native-responsive-table/blob/master/src/hooks/useScreenDimensions.ts#L10) to figure out the device's screen size each time it changes.

The two hooks compose together nicely, so all that needs to be done from our responsive table component is call `const breakpoint = useBreakpoint();` and pass the result along to the `reduceDataForScreenSize(..)` function.

Here's how this looks all put together (in [StockTableResponsive.tsx](https://github.com/blefebvre/react-native-responsive-table/blob/master/src/components/StockTableResponsive.tsx#L38)):

{% highlight js %}
// Component for displaying a table of stock data in a responsive manner.
export const StockTableResponsive: React.FunctionComponent<Props> = props => {
  // Get the current breakpoint from our hook
  const breakpoint = useBreakpoint();

  return (
    <>
      <Table borderStyle={styles.border} style={styles.table}>
        {/* Header row */}
        <Row
          data={reduceDataForScreenSize(
            head,
            breakpoint,
            smallScreenIndices,
            mediumScreenIndices
          )}
          style={styles.head}
          textStyle={styles.text}
        />

        {/* Data rows */}
        {data.map((entry, index) => (
          <Row
            key={index}
            data={reduceDataForScreenSize(
              entry,
              breakpoint,
              smallScreenIndices,
              mediumScreenIndices
            )}
            style={styles.dataRow}
            textStyle={styles.text}
          />
        ))}
      </Table>
      <RotationHint />
    </>
  );
};
{% endhighlight %}

Lastly, it is a good idea to tell the user that more detail can be revealed by rotating the screen. I have included a simple component above called `<RotationHint />` which is going to do exactly this:

<img src="{{ site.baseurl }}/images/react-native/responsive-tables/responsive_with_hint.png" alt="Table with columns reduced to fit on the screen, and a hint to rotate the device" style="max-width: 400px" />

Once the device is rotated, the additional columns are instantly visible to the user:

<img src="{{ site.baseurl }}/images/react-native/responsive-tables/responsive_rotated.png" alt="Device rotated, more data revealed in the table" style="max-width: 600px"/>

That's it! You now have a table that looks great on mobile and supports showing additional data by rotating the device.

The demo app can be found on GitHub: [https://github.com/blefebvre/react-native-responsive-table](github.com/blefebvre/react-native-responsive-table)
