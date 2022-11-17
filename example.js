const visObject = {
 /**
  * Configuration options for your visualization. In Looker, these show up in the vis editor
  * panel but here, you can just manually set your default values in the code.
  **/
  options: {
    first_option: {
    	type: "string",
      label: "My First Option",
      default: "Default Value"
    },
    second_option: {
    	type: "number",
      label: "My Second Option",
      default: 42
    }
  },

 /**
  * The create function gets called when the visualization is mounted but before any
  * data is passed to it.
  **/
	create: function(element, config){
		element.innerHTML = "<h1>Ready to render!</h1>";
	},

 /**
  * UpdateAsync is the function that gets called (potentially) multiple times. It receives
  * the data and should update the visualization with the new data.
  **/
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){

    element.innerHTML = ""

    var margin = {top: 100, right: 20, bottom: 20, left: 20},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

    // The reference point is the upper left corner of the
    // useable browser window, and it is 0,0

    // Make up some simple data

    var xdata = d3.range(0, 20);
    var ydata = [1, 4, 5, 9, 10, 14, 15, 15, 11, 10, 5, 5, 4, 8, 7, 5, 5, 5, 8, 10];

    // d3.js functions want x,y data in a not-so-intuitive structure
    // Assemble the needed array structure (Thanks to FernofTheAndes on SO)
    // The new structure is technically an array of objects.
    // Each object has the structure {property: value}
    // In this case, each object is one x, y pair

    var xy = []; // start empty, add each element one at a time
    for(var i = 0; i < xdata.length; i++ ) {
       xy.push({x: xdata[i], y: ydata[i]});
    }

    console.log("xy is:", xy); // shows the data structure

    // The domain of the scales (next) refers to range of input values,
    // and range is the output range. In this example, the output
    // values are the actual pixel positions on the screen.  When combined
    // with the way the line is silently positioned, this is a common
    // strategy.  d3simpleScatter2.html shows a different and probably
    // easier to conceptualize approach.

    var xscl = d3.scaleLinear()
        .domain(d3.extent(xy, function(d) {return d.x;})) //use just the x part
        .range([margin.left, width + margin.left])

    var yscl = d3.scaleLinear()
        .domain(d3.extent(xy, function(d) {return d.y;})) // use just the y part
        .range([height + margin.top, margin.top])

    var myline = d3.line()
      .x(function(d) { return xscl(d.x);}) // apply the x scale to the x data
      .y(function(d) { return yscl(d.y);}) // apply the y scale to the y data

    console.log("line(xy) is:", myline(xy)); // shows the exact pen moves

    var svg = d3.select("body")
        .append("svg")
        .attr("width",window.innerWidth)
        .attr("height",window.innerHeight)

    svg.append('rect') // outline for reference
    	.attr({x: margin.left, y: margin.top,
    	       width: width,
    	       height: height,
    	       stroke: 'black',
    	       'stroke-width': 0.5,
    	       fill:'white'}); // attributes in JS list format

    svg.append("path")
        .attr("class", "line") // attributes given one at a time
        .attr("d", myline(xy)) // use the value of myline(xy) as the data, 'd'
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 2);

		doneRendering()
	}
};

looker.plugins.visualizations.add(visObject);
