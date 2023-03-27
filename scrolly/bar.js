// Get data from data.js
import data from './data.js';

// Convert Object(dict-like) to Array
let data_array = []
for (const key in data) {
    data_array.push([key,data[key]])
  }

console.log( data_array );
  
// ---- BAR CHART with D3
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".bar-chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// ---- X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data_array.map(function(d) { return d[0]; }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(4,3)rotate(0)")
        .style("text-anchor", "end");

// ---- Y axis
var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
svg.append("g")
    .call( d3.axisLeft(y) )

// ---- Bars
svg.selectAll("bar")
  .data(data_array)
  .enter()
    .append("rect")
    .attr("class","bars")
    .attr("x", function(d) { return x(d[0]); })
    .attr("y", height)
    .attr("width", x.bandwidth())
    
// ----Animate when we reach to the chart
// -- Upward and downward functions
const barContainer = d3.select('.bar-chart');

//Animate the bars upwards
function updateBarChart(el) {
    console.log("update bar")
    let bars = d3.selectAll(".bars")
    bars
        .transition() // Animate
        .duration(400) // 0.4secs
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return height - y(d[1]); })
}

// Animate the bars downwards 
function cancelBarChart(el) {
    console.log( "cancel bar")
    let bars = d3.selectAll(".bars")
    bars
        .transition()
        .duration(400)
        .attr("y", height)
        .attr("height", function(d) { return height - y(0); })
}

// ---- EnterView: track the scroll position
// Same code as the scroll function but the enter exit are changed.
// on enter: create bars
// on exit: remove them
function init() {

    enterView({
        selector: barContainer.nodes(),
        offset: 0.6, // 60% of the element cross the middle
        enter: el => {
            updateBarChart(el);
        },
        exit: el => {
            cancelBarChart(el);
        }
    });
}

init();
