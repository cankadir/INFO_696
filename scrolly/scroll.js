// Import data from data.js
import data from './data.js';

// Create an article object to append the floating windows
const scrolly = d3.select('.scrolly');
const article = scrolly.append("article")

// Floating windows are generated here
for (const key in data) {
    console.log(`${key} -> ${data[key]}`)

    // You don't need D3 here but it makes life easier
    let step = article.append("div")
        .attr("class","step") // step class is for floating windows
        .attr("data-width" , `${data[key]}` ) // width of the bar
        .attr("data-index" , key); // id to match with the bar

    // Add text to the floating windows
    step.append("p")
        .html( `Data width is %${data[key]} for ${key}` )
  }

// ----- SCROLL ACTION
const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

// updateChart defines what happens when the floating windows are reached
function updateChart(el) {
    // Match data-index to data
    // Look at the class and id of the floating window
    const index = d3.select(el).attr('data-index');
	const sel = container.select(`[data-index='${index}']`);
	
    // Get Data by index
    let dataIndex = sel.attr('data-index');
    let value = data[dataIndex]; // Get data values with index

    // Assign active class to the floating window when passing
	stepSel.classed('is-active', (d,i)=>{
        // Check each .step if it matches the index
        let stepIndex = stepSel["_groups"][0][i].getAttribute("data-index");
        if (stepIndex === index){
            return true
        }else {
            return false
        }
    }); // Only for the index one

    // Update the bar with the data-index value.
	container.select('.bar-inner').style('width', `${value}%`); // Convert.
}

function init() {

	enterView({
		selector: stepSel.nodes(),
		offset: 0.5, // window is activated when the floating window is half way
		enter: el => {
			updateChart(el);
		},
		exit: el => {
			updateChart(el);
		}
	});
}

init();
