d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
var service_url = 'http://localhost:10081/';
var inst_types = ['Public', 'Private not-for-profit', 'Private for-profit'];
var state = {
	year: 2008,
	InstSelections: d3.set(inst_types),
	ConfSelections: d3.set([]),
};

var opt = {
	filter_missing_data : false,
	show_mean_std : false,
	multiple_select : false
};

var color = ['#7fc97f','#beaed4','#fdc086'];
var color_deep = ["#4daf4a","#984ea3", "#ff7f00"];
var scatterPlot = null;
var treemap = null;