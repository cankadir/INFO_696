import data from './data.js';

// ----- Create DOM ELEMENTS based on data
const scrolly = d3.select('.scrolly');
const article = scrolly.append("article")

// Floating windows are generated here
for (const key in data) {
    console.log(`${key} -> ${data[key]}`)

    let step = article.append("div")
        .attr("class","step")
        .attr("data-width" , `${data[key]}` )
        .attr("data-index" , key);

    step.append("p")
        .html( `Data width is %${data[key]} for ${key}` )
  }

// ----- SCROLL ACTION
const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

function updateChart(el) {
    const index = d3.select(el).attr('data-index');
	const sel = container.select(`[data-index='${index}']`);
	
    // Get Data by index
    let dataIndex = sel.attr('data-index');
    let value = data[dataIndex];

	stepSel.classed('is-active', (d,i)=>{
        // Check each .step if it matches the index
        let stepIndex = stepSel["_groups"][0][i].getAttribute("data-index");
        if (stepIndex === index){return true}
        else {return false}

    }); // Only for the index one
	container.select('.bar-inner').style('width', `${value}%`); // Convert.
}

function init() {

	enterView({
		selector: stepSel.nodes(),
		offset: 0.5,
		enter: el => {
			updateChart(el);
		},
		exit: el => {
			updateChart(el);
		}
	});
}

init();
