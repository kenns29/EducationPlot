function BoxPlot() {
	var container = '#box_plot';
	var data;
	var W, H, margin, width, height;
	var svg;
	var chart;
	var min, max;

	this.init = function() {
		W = $(container).width();
		H = $(container).height();
		margin = {top: 10, right: 30, bottom: 20, left: 30};
		width = W - margin.left - margin.right;
		height = H - margin.top - margin.bottom;

		min = Infinity;
    	max = -Infinity;

    	chart = d3.box()
		    .whiskers(iqr(1.5))
		    .width(30)
		    .height(height);

		return this;
	};

	this.update = function() {
		var stripped_data = [];
		stripped_data[0] = [];
		stripped_data[1] = [];
		stripped_data[2] = [];
		stripped_data[0].sector = "public";
		stripped_data[1].sector = "private-not-for-profit";
		stripped_data[2].sector = "private-for-profit";
		data.forEach(function(d) {
			var rate = (opt.box_plot_pell ? d.Pell : d.GradRate)[state.year];
			if(rate != -1) {
				stripped_data[d.InstSector - 1].push(rate);
				if (rate > max) max = rate;
				if (rate < min) min = rate;
			}
		});
		console.log(svg);
		svg = d3.select(container).selectAll("svg")
		      .data(stripped_data)
		    .enter().append("svg")
		      .attr("class", function(i) {
		      	return "box box-" + i.sector;
		      })
		      .attr("width", 30 + margin.left + margin.right)
		      .attr("height", height + margin.bottom + margin.top)
		    .append("g")
		      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		      .call(chart);
		return this;
	};

	function iqr(k) {
	  return function(d, i) {
	    var q1 = d.quartiles[0],
	        q3 = d.quartiles[2],
	        iqr = (q3 - q1) * k,
	        i = -1,
	        j = d.length;
	    while (d[++i] < q1 - iqr);
	    while (d[--j] > q3 + iqr);
	    return [i, j];
	};
}

	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
}