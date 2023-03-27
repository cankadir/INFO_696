
// Manually generated data
let data = [
    { "country": "Oakland", "what": "I was born here.", "year": 1983 , lat:'37.8044', lon:'-122.2711', photo:"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.elitetranslingo.com%2Fwp-content%2Fuploads%2F2014%2F10%2FOaklandca.jpg&f=1&nofb=1&ipt=bf19acef8fd433760bcf944d9c2b0bdcfe349a38cf9bc8965b5b6f85e3cf5447&ipo=images"},
    { "country": "Princeton", "what": "I lived here for 3 years", "year": 1984, lat:'40.3488', lon:'-74.6598'},
    { "country": "Ankara", "what": "I lived most of my childhood in Ankara", "year": 1986, lat:'39.9334', lon:'32.8597', photo:"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fjustfunfacts.com%2Fwp-content%2Fuploads%2F2019%2F11%2Fankara-castle.jpg&f=1&nofb=1&ipt=d62cce7ced112749354f2d89b838daa432cee454a5306b5086fd51945ede81d9&ipo=images"},
    { "country": "Istanbul", "what": "Architecture school from 17 to 22 years old.", "year": 2000, lat:'41.0082', lon:'28.9784', photo:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.ne4YYP5BUNbHqdh7stPiQgAAAA%26pid%3DApi&f=1&ipt=198a4b00206eb0d7c02fad4791e22f1ed77581a2e94aa15405d9dfb3274032e8&ipo=images"},
    { "country": "Los Angeles", "what": "Did March and then started working. LA was not very nice back then. I don't remember the place very fondly.", "year": 2006, lat:'34.0489', lon:'-118.242'}, 
    { "country": "Warsaw", "what": "Worked Here", "year": 2009, lat:'52.2300', lon:'21.0254', photo:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F1940%2F30510793907_08b96ca862.jpg&f=1&nofb=1&ipt=92d4f5995e91edaec557d5abe89ecff75cf225cadd5725679461768c81a2e4f7&ipo=images'}, 
    { "country": "Istanbul", "what": "Back Home", "year": 2011, lat:'41.0082', lon:'28.97842'},
    { "country": "New York", "what": "Lev was born and I started to worked at Pratt.Now working at Numina and Lev is 3 years old already.", "year": 2019, lat:'40.7128', lon:'-74.0060'},
]

// ----- Create a map
// Set initial position to the first data point
var map = L.map('map').setView([data[0].lat, data[0].lon], 8);

//add a tile layer to the map
// Alternative tiles: https://apidocs.geoapify.com/docs/maps/map-tiles/#about
// Other tiles: https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// ----- Create DOM ELEMENTS based on data
// Add and article to the scrolly div
const scrolly = d3.select('.scrolly');
const article = scrolly.append("article")

// ---- FLOATING WINDOWS
// Add a div for each data point
data.forEach(function(d) {
    let step = article.append("div")
        .attr("class","step") // step is for floating windows
        .attr("data-index" , `${d.year}`); // Year can be the unique identifier
    
    // To style what happens in the windows
    let stepCont = step.append("div")
        .attr("class","step-content")
    
    // Add Text content to window
    stepCont.append("p")
        .html( `<b>${d.country},${d.year}</b><br><br>${d.what}` )
    
    // Add am image if there is one
    if (d.photo){
        stepCont.append("img")
            .attr("src", d.photo)
            .attr("width", "100%")
            .attr("class","city-photo")
    }
});

// ----- SCROLL ACTION
const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

// This is where all scroll related actions happen. 
function updateChart(el) {
    const index = d3.select(el).attr('data-index');
    console.log(index);
	const sel = container.select(`[data-index='${index}']`);
	
    // Get Data by index
    let dataIndex = sel.attr('data-index');
    // let value = data[dataIndex];
    console.log(dataIndex);
    let value = data.filter(d => d.year == dataIndex)[0];
    let lat = value.lat;
    let lon = value.lon; 

    // assign is-active class to the current step
    // This connectes to CSS
	stepSel.classed('is-active', (d,i)=>{
        // Check each .step if it matches the index
        let stepIndex = stepSel["_groups"][0][i].getAttribute("data-index");
        if (stepIndex === index){return true}
        else {return false}

    }); 
    
    // Do Something.

    // Remove existing markers - with class country-marker
    let all_markers = document.getElementsByClassName("country-marker");
    for (let i = 0; i < all_markers.length; i++) {
        all_markers[i].remove();
    }

    // Add the new marker
    let marker = L.circle([lat,lon], {
        fillOpacity: 0.8,
        radius: 3500
    }).addTo(map);

    // Add class to the marker
    marker._path.classList.add("country-marker");
    
    // Move the map, position and zoom
    map.flyTo([lat,lon], 8, {
        animate: true,
        duration: 2
    });
}

function init() {

	enterView({
		selector: stepSel.nodes(),
        // When does the floating box gets activated
        // Activating early - giving time for the map to fly
		offset: 0.25, 
		enter: el => {
			updateChart(el);
		},
		exit: el => {
			updateChart(el);
		}
	});
}

init();
