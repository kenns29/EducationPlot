function ScatterPlot(){
	var self = this;
	var graph_container = '#canvas';
	var title_container = '#title';
	var data;
	var W, H, margin, width, height;
	var svg;
	var xAxis, yAxis, x, y;
	this.init = function(){
		d3.select(title_container).select("H3").text("Grade Rate, Pell, Year = " + state.year);
		W = $(graph_container).width();
		H = $(graph_container).height();
		margin = {top: 20, right: 60, bottom: 40, left: 60};
		width = W - margin.left - margin.right;
		height = H - margin.top - margin.bottom;

		svg = d3.select(graph_container).append("svg")
		.attr("width", W)
		.attr("height", H)
		.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top + ")");

		//init scale and axis
		x = d3.scale.linear().range([0, width]).domain([-10,110]);
		y = d3.scale.linear().range([height, 0]).domain([-10,110]);
		xAxis = d3.svg.axis().scale(x).orient("bottom")
		.innerTickSize(-height)
		.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
		yAxis = d3.svg.axis().scale(y).orient("left")
		.innerTickSize(-width)
		.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

		//x axis
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate( 0, " + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class","label")
		.attr("x", width)
		.attr("y", 25)
		.style("text-anchor","end")
		.text("Grad Rate (%)");

		//y axis
		svg.append("g")
		.attr("class","y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y",6)
		.attr("dy","-4em")
		.style("text-anchor", "end")
		.text("Pell (%)");

		return this;
	};

	this.update = function(){
		d3.select(title_container).select("H3").text("Grade Rate, Pell, Year = " + state.year);
		//define the tooltip
		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:white'>" + d.InstName + "</span>";
		});
		svg.call(tip);
		//select the dots
		var dotSel = svg.selectAll('.dot')
		.data(data.filter(function(d, i){
			var inst_sector_filter = state.InstSelections.has(inst_types[d.InstSector - 1]);
			var missing_data_filter = opt.filter_missing_data ?  (d["GradRate"][state.year] >= 0 && d["Pell"][state.year] >= 0) : true;
			return inst_sector_filter && missing_data_filter;
		}), function(d, i){
			return d.UnitID;
		});

		//entered dots
		var dotEnter = dotSel.enter().append('circle').attr('class', 'dot')
		.attr('stroke', 'gray')
		.attr('stroke-width', 0.5)
		.style("fill", function(d){
			return color[d.InstSector - 1];
		});

		//remove exit dots
		var dotExit = dotSel.exit();
		dotExit.remove();
		//current dots
		var dotUpdate = svg.selectAll('.dot');

		dotUpdate
		.transition()
		.duration(500)
		.attr("r", function(d){
			var value =  Math.max(0, d["NumStudents"][state.year]);
			return Math.ceil(Math.log(Math.max(2, value/10)));
		})
		.attr("cx", function(d){
			var value = d["GradRate"][state.year];
			return value >= 0 ? x(value) : x(0);
		})
		.attr("cy", function(d){
			var value = d["Pell"][state.year];
			return value >= 0 ? y(value) : y(0);
		})
		.style("opacity", function(d) {
			if(d.fade == true){
				return 0.4;
			}else return 1;
		})
		.style("fill", function(d){
			return d.fade == true ? "gray" : color[d.InstSector - 1];
		});
		
		
		//mouse over events
		dotUpdate.on('mouseover', tip.show);
		dotUpdate.on('mouseout', tip.hide);
		dotUpdate.on('click',function(d){
			tip.hide();
			InstClick(d);

		});
		return this;
	};

	function InstClick(d){
		console.log(d);
		//fade out other institut
		var id = d.UnitID;
		var fade = d.fade;
		if(fade == false){
			data.forEach(function(dd){
				if(dd.UnitID != id){
					dd.fade = true;
				}else{
					dd.fade = "clicked";
				}
			})
		}else if(fade == "clicked"){
			data.forEach(function(dd){
				dd.fade = false;
			})
		}else if(fade == true){
			data.forEach(function(dd) {
				if(dd.UnitID != id){
					dd.fade = true;
				}else{
					dd.fade = "clicked";
				}
			})
		}
		self.update();
	}
	/*
	* Accessors
	*/
	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	this.graph_container = function(_){
		return (arguments.length > 0) ? (graph_container = _, this) : graph_container;
	};
	this.title_container = function(_){
		return (arguments.length > 0) ? (title_container = _, this) : title_container;
	};
}