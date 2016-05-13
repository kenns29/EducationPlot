var service_url = 'http://localhost:10081/';
var inst_types = ['Public', 'Private not-for-profit', 'Private for-profit'];
var state = {
	year: 2008,
	InstSelections: d3.set(inst_types)
};

var opt = {
	filter_missing_data : false,
	show_mean_std : false
};

var color = ['#7fc97f','#beaed4','#fdc086'];
var scatterPlot = null;