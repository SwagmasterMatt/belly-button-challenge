// URL of JSON Data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data
d3.json(url).then(function(data) {
  console.log(data);

  // Populate Dropdown
  const names = data.names;
  names.forEach(name => {
    const option = d3.select("#selDataset").append("option");
    option.text(name);
    option.attr("value", name);
  });

  const metadata = data.metadata;

  function createMetadata(sample) {
    // Clear existing metadata
    d3.select("#sample-metadata").html("");

    const panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(sample).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  }

  

  // Extract samples
  const samples = data.samples;

  // Function to Create Chart using Plotly
  function createChart(sample) {
    // Prepare Data
    const { otu_ids, sample_values, otu_labels } = sample;
    const sampleData = otu_ids.map((otu_id, index) => {
      return {
        otu_id,
        sample_value: sample_values[index],
        otu_label: otu_labels[index]
      };
    });


    // Sort and Filter Top 10 Samples
    const sortedData = sampleData.sort((a, b) => b.sample_value - a.sample_value).slice(0, 10);
    sortedData.reverse();
    
    // Prepare data for Plotly bar chart
    const barTrace = {
      x: sortedData.map(d => d.sample_value),
      y: sortedData.map(d => `OTU ${d.otu_id}`),
      text: sortedData.map(d => d.otu_label),
      type: "bar",
      orientation: 'h'
    };

    // Layout for Plotly bar chart
    const barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };

    // Prepare data for Plotly bubble chart
    const bubbleTrace = {
      x: sampleData.map(d => d.otu_id),
      y: sampleData.map(d => d.sample_value),
      text: sampleData.map(d => d.otu_label),
      mode: "markers",
      marker: {
        size: sampleData.map(d => d.sample_value),
        color: sampleData.map(d => d.otu_id)
      }
    };

    // Layout for Plotly bubble chart
    const bubbleLayout = {
      title: "OTU ID",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    // Create Plotly chart
    Plotly.newPlot("bar", [barTrace], barLayout);
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  }

  // Create Chart with First Sample
  createChart(samples[0]);
  createMetadata(metadata[0]);

  // Update Plot on Dropdown Change
  d3.select("#selDataset").on("change", function() {
    const selectedID = this.value;
    const selectedSample = samples.find(sample => sample.id === selectedID);
    const selectedMetadata = metadata.find(sample => sample.id === parseInt(selectedID));
    createChart(selectedSample);
    createMetadata(selectedMetadata);
  });
});






