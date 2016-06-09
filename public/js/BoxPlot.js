function BoxPlot() {
	var container = '#box-plot';
	var data;
	var W, H, margin, width, height;
	var svg;
	var chart;
	var min, max;
	var aspect_ratio;

	this.init = function() {
		W = $(container).width();
		H = $(container).height();
		margin = {top: 10, right: 30, bottom: 20, left: 40};
		// width = W - margin.left - margin.right;
		// height = H - margin.top - margin.bottom;

		

		min = Infinity;
    	max = -Infinity;

    	

		return this;
	};

	this.update = function() {
		if(svg === undefined) {
			aspect_ratio = W / H;
			init_width = 400;
			init_height = init_width / aspect_ratio;

			width = init_width - margin.left - margin.right;
			height = init_height - margin.top - margin.bottom;
			var scaleX = W / init_width;
			var scaleY = H / init_height;
			chart = d3.box()
		    .whiskers(iqr(1.5))
		    .width(init_width / 3 - margin.right - margin.left - 10)
		    .height(init_height);

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
			chart.domain([0, 100]);
			svg = d3.select(container).selectAll("svg")
			      .data(stripped_data)
			    .enter().append("svg")
			      .attr("class", function(i) {
			      	return "box box-" + i.sector;
			      })
			      .attr("width", width / 4 - 10)
			      .attr("height", height)
			    .append("g")
				  .attr("transform","scale(" +[scaleX, scaleY]+ ") translate(" + margin.left + "," + margin.top + ")")
			      .attr("class", function(i) {
			      	return i.sector === "public" ? 1 : i.sector === "private-not-for-profit" ? 2 : 3;
			      })
			      .call(chart);

			this.resize();
		} else {
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
			svg.data(stripped_data).call(chart.duration(1000));
		}
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

	this.resize = function() {
		var scaleX = $("#box-plot").width() / width;
		var scaleY = ($("#box-plot").height() - margin.bottom - margin.top - 15) / height;
		var scale = scaleX < scaleY ? scaleX : scaleY;
		d3.select(container).selectAll("svg")
							.attr('width', $("#box-plot").width() / 3 - 1)
							.attr('height', $("#box-plot").height());
		
		svg.attr('transform', function(){
				return 'scale(' + [scale, scale] + ') translate(' + [margin.left, margin.top] + ')';
		});
	};


	this.data = function(_) {
		return (arguments.length > 0) ? (data = _, this) : data;
	};
}