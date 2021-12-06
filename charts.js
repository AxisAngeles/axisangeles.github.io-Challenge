function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1-1. Create the buildCharts function.
function buildCharts(sample) {
  // 1-2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 1-3. Create a variable that holds the samples & metadata array.
    var samplesData = data.samples;
    var metaData = data.metadata;

    // 1-4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSamples = samplesData.filter(sampleID => sampleID.id == sample);

    // 3-1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultMeta = metaData.filter(metaID => metaID.id == sample);

    //  1-5. Create a variable that holds the first sample in the array.
    var firstSample = resultSamples[0];
    
    // 3-2. Create a variable that holds the first sample in the metadata array.  
    var firstMeta = resultMeta[0];

    // 1-6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var sampleValues = firstSample.sample_values;
    var otuLabels = firstSample.otu_labels;

    // 3-3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(firstMeta.wfreq);
    
    // 1-7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).reverse()
 
    // 1-8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      name: "Samples",
      type: "bar",
      orientation: "h"
      
    }];

    // 1-9. Create the layout for the bar chart. 
    var barLayout = {
      autosize: false,
      width: 500,
      height: 400,
      paper_bgcolor: "whitesmoke",
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      margin: {
        t: 100,
        r: 100
        },
      yaxis: {
        type: 'category',
        tickvals: yticks,
        title: {
          text: 'OTU ID´s',
          font: {size: 14}
        }
    }
    };

    // 1-10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // 2-1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker: {size:sampleValues,color:otuIds, colorscale:"Earth"}
    }];

    // 2-2. Create the layout for the bubble chart.
    var bubbleLayout = {
     width: 1150,
     height: 500,
     title: "<b> Bacteria Cultures per Sample </b>",
     xaxis:{title: { text: "OTU ID",font: {size:18}}},
     hovermode: 'closest',
     paper_bgcolor: "whitesmoke",
     margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
    };

    // 2-3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
    
    // 3-4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: { text: "<b> Belly Button Washing Frequency </b> <br> Scrubs p/Week"},
      value: wFreq,
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "midnightblue" },
          { range: [2, 4], color: "darkblue" },
          { range: [4, 6], color: "blue" },
          { range: [6, 8], color: "cornflowerblue" },
          { range: [8, 10], color: "lightsteelblue" }
        ],
        bar: { color: "lightcyan" },
        bgcolor: "whitesmoke",
        borderwidth: 1,
        bordercolor: "black"
      }
    }];
    
    // 3-5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        width: 470,
        height: 400,
        margin: { t: 25, r: 100, l: 25, b: 25 },
        paper_bgcolor: "whitesmoke",
        font: { color: "black", family: "Arial" }     
    };

    // 3-6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);


  });
}

