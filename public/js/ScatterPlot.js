function ScatterPlot(){
	var self = this;
	var graph_container = '#canvas';
	var title_container = '#title';
	var legend_container = '#dot-legend-container';
	var data;
	var width, height, W, H;
	var margin, legend_margin;
	var svg, legend_svg, legend_g;
	var xAxis, yAxis, x, y;
	var mode = ScatterPlot.SCATTER;

	var init_width, init_height;
	var init_legend_width, init_legend_height;
	var aspect_ratio, legend_aspect_ratio;
	this.init = function(){
		//title
		d3.select(title_container).select("H3").text("Grade Rate, Pell, Year = " + state.year);
		
		//size
		W = $(graph_container).width();
		H = $(graph_container).height();
		margin = {top: 20, right: 60, bottom: 40, left: 60};
		

		aspect_ratio = W / H;
		init_width = 1000;
		init_height = init_width / aspect_ratio;

		width = init_width - margin.left - margin.right;
		height = init_height - margin.top - margin.bottom;
		var scaleX = W / init_width;
		var scaleY = H / init_height;
		svg = d3.select(graph_container)
		// .style('display', 'inline-block')
		// .style('position', 'relative')
		// .style('height', 0)
		// .style('width', '100%')
		// .style('padding-bottom', '100%')
		// .style('vertical-align', 'top')
		// .style('overflow', 'hidden')
		.append("svg")
		.attr('width', '100%')
		.attr('height', '100%')
		.attr('viewport', '0 0 100% 100%')
		.attr('preserveAspectRatio', 'xMidYMid meet')
		// .style('display', 'inline-block')
		// .style('position', 'absolute')
		// .style('top', 0)
		// .style('left', 0)
		.append("g")
		.attr("transform","scale(" +[scaleX, scaleY]+ ") translate(" + margin.left + "," + margin.top + ")");

		// init_width = $(d3.select(graph_container).select('svg').node()).width();
		// init_height = $(d3.select(graph_container).select('svg').node()).height();
		// console.log('init_width', init_width);
		// console.log('init_height', init_height);
		//init scale and axis
		x = d3.scale.linear().range([0, width]).domain([-10,110]);
		y = d3.scale.linear().range([height, 0]).domain([-10,110]);
		xAxis = d3.svg.axis().scale(x).orient("bottom")
		// .innerTickSize(-height)
		.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
		yAxis = d3.svg.axis().scale(y).orient("left")
		// .innerTickSize(-width)
		.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

		//x axis
		var x_axis_g = svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate( 0, " + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class","label")
		.attr("x", width)
		.attr("y", 25)
		.style("text-anchor","end")
		.text("Pell (%)");

		svg.selectAll('.scatter.horizontal_line')
		.data(yAxis.tickValues())
		.enter().append('line').attr('class', 'scatter horizontal_line')
		.attr('x1', 0).attr('x2', width)
		.attr('y1', function(d){return y(d);}).attr('y2', function(d){return y(d);})
		.attr('stroke-width', 1).attr('stroke', 'lightgrey');


		svg.append('line')
		.attr('class', 'scatter y-axis-line')
		.attr('x1', 0).attr('x2', width)
		.attr('y1', function(d){return y(-10);}).attr('y2', function(d){return y(-10);})
		.attr('stroke-width', 1).attr('stroke', 'black');

		svg.selectAll('.scatter.y-axis-tick')
		.data(yAxis.tickValues())
		.enter().append('line').attr('class', 'scatter y-axis-tick')
		.attr('x1', 0).attr('x2', -4)
		.attr('y1', function(d){return y(d);}).attr('y2', function(d){return y(d);})
		.attr('stroke-width', 1).attr('stroke', 'black');
		//y axis
		var y_axis_g = svg.append("g")
		.attr("class","y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y",6)
		.attr("dy","-4em")
		.style("text-anchor", "end")
		.text("Grad Rate (%)");

		svg.selectAll('scatter.vertical_line')
		.data(xAxis.tickValues())
		.enter().append('line').attr('class', 'scatter vertical_line')
		.attr('x1', function(d){
			return x(d);
		}).attr('x2', function(d){
			return x(d);
		})
		.attr('y1', height)
		.attr('y2', 0)
		.attr('stroke-width', 1).attr('stroke', 'lightgrey');


		svg.append('line')
		.attr('class', 'scatter x-axis-line')
		.attr('x1', function(d){return x(-10);}).attr('x2', function(d){return x(-10);})
		.attr('y1', height).attr('y2', 0)
		.attr('stroke-width', 1).attr('stroke', 'black');


		svg.selectAll('.scatter.x-axis-tick')
		.data(yAxis.tickValues())
		.enter().append('line').attr('class', 'scatter y-axis-tick')
		.attr('x1', function(d){return x(d);}).attr('x2', function(d){return x(d);})
		.attr('y1', height).attr('y2', height + 4)
		.attr('stroke-width', 1).attr('stroke', 'black');
		//init the dot legend
		this.showLegend();
		
		return this;
	};
	
	this.resize = function(){
		//size
		var currentWidth, currentHeight, scaleX, scaleY;
		if($('#scatter-plot-tab-btn').hasClass('active')){
			currentWidth = $(this.svg()).width();
			currentHeight = $(this.svg()).height();
		}
		else{
			currentWidth = $(treemap.svg()).width();
			currentHeight = $(treemap.svg()).height();
		}

		scaleX = currentWidth / init_width;
		scaleY = currentHeight / init_height;

		// console.log('scaleX', scaleX, 'scaleY', scaleY);
		svg.attr('transform', function(){
			return 'scale(' + [scaleX, scaleY] + ') translate(' + [margin.left, margin.top] + ')';
		});

		var current_legend_width = $(legend_svg.node()).width();
		var current_legend_height = $(legend_svg.node()).height();
		var legend_scale_x = current_legend_width / init_legend_width;
		var legend_scale_y = current_legend_height / init_legend_height;

		legend_g.attr('transform', function(){
			return 'scale(' + [legend_scale_x, legend_scale_y] + ') translate(' + [legend_margin.left, legend_margin.top] + ')';
		});

		boxPlot.resize();

		// $(".tokenfield, .token, .token-label").css("max-width", $("#multiple-school-tags").width());
	};

	this.update = function(){
		mode = ScatterPlot.SCATTER;
		// this.removeTrajectory();
		d3.select(title_container).select("H3").text("Grade Rate, Pell, Year = " + state.year);
		//define the tooltip
		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:white'>" + d.InstName + "</span>";
		});
		svg.call(tip);

		//init scale and axis
		x = d3.scale.linear().range([0, width]).domain([-10,110]);
		y = d3.scale.linear().range([height, 0]).domain([-10,110]);
		xAxis = d3.svg.axis().scale(x).orient("bottom")
		.innerTickSize(-height)
		.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
		yAxis = d3.svg.axis().scale(y).orient("left")
		.innerTickSize(-width)
		.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

		//select the dots
		var dotSel = svg.selectAll('.dot')
		.data(data.filter(function(d, i){
			var inst_sector_filter = state.InstSelections.has(inst_types[d.InstSector - 1]);
			var missing_data_filter = opt.filter_missing_data ?  (d["GradRate"][state.year] >= 0 && d["Pell"][state.year] >= 0) : true;
			var ncaa_conf_filter = state.ConfSelections.size() == 0 || state.ConfSelections.has(d.InstConf);
			return inst_sector_filter && missing_data_filter && ncaa_conf_filter;
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
		.style("opacity", function(d) {
			if(d.fade == true){
				return 0.4;
			}else return 1;
		})
		.style("fill", function(d){
			return d.fade == true ? "gray" : color[d.InstSector - 1];
		});

		dotUpdate
		.transition()
		.duration(function(){
			return 1000;
		})
		.attr("r", function(d){
			var value =  Math.max(0, d["NumStudents"][state.year]);
			return Math.ceil(Math.log(Math.max(2, value/10)));
		})
		.attr("cx", function(d){
			var value = d["Pell"][state.year];
			return value >= 0 ? x(value) : x(0);
		})
		.attr("cy", function(d){
			var value = d["GradRate"][state.year];
			return value >= 0 ? y(value) : y(0);
		});
		
		dotUpdate.filter(function(d){
			return !d.fade;
		}).moveToFront();

		//mouse over events
		dotUpdate.on('mouseover', tip.show);
		dotUpdate.on('mouseout', tip.hide);
		dotUpdate.on('click',function(d, i){
			// d3.select(this).moveToFront();
			tip.hide(d, i);
			self.InstClick(d);
			
		});


		//draw mean and std
		if(opt.show_mean_std == true){
			d3.selectAll(".meanstd_pell").remove();
			d3.selectAll(".meanstd_gradrate").remove();
			meanStd = calMeanStd(data);
			GradeRate_meanStd = [];
			Pell_meanStd = [];
			meanStd.forEach(function(d){
				if(d.variable == "GradRate") GradeRate_meanStd.push(d);
				if(d.variable == "Pell") Pell_meanStd.push(d);
			})

			//mean	for pell		
			var meanstd_svg = svg.selectAll(".meanstd_pell").data(Pell_meanStd).enter()
			.append("g").attr("class","meanstd_pell");
			meanstd_svg
			.append("line")
			.attr("stroke-width", 3)
			.attr("stroke",function(d){return color_deep[d.InstSector - 1];})
			.attr("x1", function(d){return x(d.mean);})
			.attr("y1", y(-10))
			.attr("x2", function(d){return x(d.mean);})
			.attr("y2", y(110));

			meanstd_svg.append("line")
			.attr("stroke-width", 2)
			.attr("stroke-dasharray",("3,3"))
			.attr("stroke",function(d){return color_deep[d.InstSector - 1];})
			.attr("x1", function(d){return x(d.mean - d.std);})
			.attr("y1", y(-10))
			.attr("x2", function(d){return x(d.mean - d.std);})
			.attr("y2", y(110));
			meanstd_svg.append("line")
			.attr("stroke-width", 2)
			.attr("stroke-dasharray",("3,3"))
			.attr("stroke",function(d){return color_deep[d.InstSector - 1];})
			.attr("x1", function(d){return x(d.mean + d.std);})
			.attr("y1", y(-10))
			.attr("x2", function(d){return x(d.mean + d.std);})
			.attr("y2", y(110));

			//mean for grade rate
			var meanstd2_svg = svg.selectAll(".meanstd_gradrate").data(GradeRate_meanStd).enter()
			.append("g").attr("class","meanstd_gradrate");
			meanstd2_svg.append("line")
			.attr("stroke-width", 3)
			.attr("stroke",function(d){return color_deep[d.InstSector - 1];})
			.attr("x1",x(-10))
			.attr("x2", x(110))			
			.attr("y1", function(d){return y(d.mean);})
			.attr("y2", function(d){return y(d.mean);})

			meanstd2_svg.append("line")
			.attr("stroke-width", 2)
			.attr("stroke-dasharray",("3,3"))
			.attr("stroke",function(d){return color_deep[d.InstSector - 1];})
			.attr("x1",x(-10))
			.attr("x2", x(110))			
			.attr("y1", function(d){return y(d.mean - d.std);})
			.attr("y2", function(d){return y(d.mean - d.std);})

			meanstd2_svg.append("line")
			.attr("stroke-width", 2)
			.attr("stroke-dasharray",("3,3"))
			.attr("stroke",function(d){return color_deep[d.InstSector - 1];})
			.attr("x1",x(-10))
			.attr("x2", x(110))			
			.attr("y1", function(d){return y(d.mean + d.std);})
			.attr("y2", function(d){return y(d.mean + d.std);})


			
		}else{
			d3.selectAll(".meanstd_pell").remove();
			d3.selectAll(".meanstd_gradrate").remove();
		}
		return this;
	};

	this.showTrajectory = function(){
		var clicked_ds = data.filter(function(d){
			return d.fade == false;
		});
		
		if(clicked_ds.length == data.length){
			alert('Please select schools to show the yearly trajectory.');
			return;
		}

		//define the tooltip
		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:white'>" + d.InstName + "</span>";
		});
		svg.call(tip);

		if(clicked_ds){
			clicked_ds.forEach(function(clicked_d){
				mode = ScatterPlot.TRAJECTORY;
				svg.selectAll('.dot').remove();

				//make dots and links
				var dat = [];
				var index = 0;
				for(var i = 2008; i <= 2014; i++){
					dat.push({
						'x' : x(clicked_d.Pell[i.toString()]),
						'y' : y(clicked_d.GradRate[i.toString()]),
						'r' : Math.ceil(Math.log(Math.max(2, Math.max(0, clicked_d.NumStudents[i.toString()])/10))),
						'year' : i,
						'InstSector' : clicked_d.InstSector,
						'index' : index++,
						'UnitID' : clicked_d.UnitID,
						'InstName' : clicked_d.InstName
					});
				}

				var link = [];
				for(var i = 0; i < dat.length - 1; i++){
					link.push({
						'source' : dat[i],
						'target' : dat[i+1]
					});
				}

				//draw dots and links
				var diagonal = d3.svg.diagonal().source(function(d){return {x : d.source.x, y:d.source.y};})
				.target(function(d){return {x : d.target.x, y:d.target.y};})
				.projection(function(d){return [d.x, d.y];});

				/*
				* Define the arrow
				*/
				// svg.append('defs')
				// .append('marker')
				// .attr('id', 'arrow-marker')
				// .attr('markerWidth', 10)
				// .attr('markerHeight', 10)
				// .attr('refX', 0)
				// .attr('refY', 3)
				// .attr('markerUnits', 'strokeWidth')
				// .attr('orient', 'auto')
				// .append('path')
				// .attr('d', 'M0,0 L0,6 L9,3 z')
				// .attr('fill', 'black');
				
				// svg.selectAll('.t-link').data(link).enter().append('path')
				// .attr('class', 't-link')
				// .attr('d', diagonal)
				// .attr('stroke', 'black')
				// .attr('stroke-width', 1)
				// .attr('fill', 'none');

				// .attr('marker-end', function(d, i){
				// 	if(i == link.length - 1){
				// 		return 'url(#arrow-marker)';
				// 	}
				// 	return null;
				// });

				var line = d3.svg.line().x(function(d){return d.x;}).y(function(d){return d.y;}).interpolate('cardinal')
				svg.append('path')
				.attr('class', 'trajectory t-link')
				.attr('d', line(dat))
				.attr('stroke', 'black')
				.attr('stroke-width', 1)
				.attr('fill', 'none');

				svg.selectAll('.trajectory.t-dot.inst-' + clicked_d.UnitID).data(dat)
				.enter().append('circle')
				.attr('class', 'trajectory t-dot inst-' + clicked_d.UnitID)
				.attr('cx', function(d){
					return d.x;
				}).attr('cy', function(d){
					return d.y;
				})
				.attr('r', function(d){
					return d.r;
				})
				.style("fill", function(d){
					return d.fade == true ? "gray" : color[d.InstSector - 1];
				})
				.attr('stroke', 'black')
				.attr('stroke-width', function(d) {
					return d.year === state.year ? 2 : 1;
				})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);
			});
		}
		mode = ScatterPlot.TRAJECTORY;
		return this;
	};

	this.updateTrajectory = function(){
		svg.selectAll('.trajectory.t-dot')
		.attr('stroke-width', function(d){
			return d.year === state.year ? 2 : 1;
		});
	};

	this.removeTrajectory = function(){
		// svg.selectAll('.t-dot').remove();0
		// svg.selectAll('.t-link').remove();
		svg.selectAll('.trajectory').remove();
		mode = ScatterPlot.SCATTER;
		// svg.selectAll('defs').remove();
		$('#show-trajectory-button').removeClass('active');
		return this;
	};

	this.search = function(institution){
		if(institution == "All"){
			this.InstClick({
				UnitID: 0,
				InstName: "All",
			});
		}else if(institution === undefined){
			var tokenfield = $("#tokenfield");
			var tokens = tokenfield.tokenfield("getTokens");
			if(tokens.length == 0) {
				this.search("All");
				return;
			} else if(tokens.length > 1 && !opt.multiple_select) {
				tokenfield.tokenfield('setTokens', []);
				this.search("All");
				return;
			} else {
				this.InstClick(undefined);
			}
		}else{
			for(var key in data) {
				if(data[key].InstName == institution) {
					data[key].fade = false;
					this.InstClick(data[key]);
					break;
				}
			}
		}
	};

	this.InstClick = function(d){
		var tokenfield = $("#tokenfield");
		var tokens = [];
		var instLabel = "";

		if(d === undefined) {
			tokens = tokenfield.tokenfield("getTokens");
			instLabel = tokens[0].label;
		} else if(d.UnitID == 0) {
			tokens.push({value : 0, label : "All"});
			instLabel = "All";
		} else {
			instLabel = d.InstName;
			tokenfield.tokenfield("createToken", {value : d.UnitID, label : d.InstName});
			tokens = tokenfield.tokenfield("getTokens");
			var allSelected = false;
			if(tokens.length > 1) {
				for(var key in tokens) {
					if(tokens[key].value == 0) {
						tokens.splice(key, 1);
						allSelected = true;
						break;
					}
				}
			}
			if(!opt.multiple_select) {
				tokenfield.tokenfield("setTokens", [{value : d.UnitID, label : d.InstName}]);
				tokens = tokenfield.tokenfield("getTokens");
			}
			if(!d.fade && !allSelected) {
				instLabel = tokens[0].label;
				for(var key in tokens) {
					if(tokens[key].value == d.UnitID) {
						tokens.splice(key, 1);
						break;
					}
				}
			}
		}
		data;

		if(tokens.length == 0) {
			tokenfield.tokenfield("setTokens", []);
			self.search("All");
			return;
		}
		var IDs = d3.set();
		tokens.forEach(function(inst) {
			IDs.add(inst.value);
		});
		state.SelectedInsts = [];
		data.forEach(function(inst) {
			if(IDs.has(0) || IDs.has(inst.UnitID)) {
				if(!IDs.has(0)) {
					state.SelectedInsts.push({
						id : inst.UnitID,
						label : inst.InstName,
						pell : inst.Pell[state.year],
						grad : inst.GradRate[state.year],
						sect : inst.InstSector
					});
				}
				inst.fade = false;
			} else {
				inst.fade = true;
			}
		});
		tokenfield.tokenfield("setTokens", tokens);
		$("#institution").val(instLabel);
		if(mode === ScatterPlot.SCATTER)
			self.update();
		// TODO: Use solution that isn't so taxing!
		if($("#treemap-tab-btn").hasClass('active'))
			treemap.update();
	};

	this.showLegend = function(){
		var space = 20;
		var legend_width = $(legend_container).width();
		var legend_height = $(legend_container).height();
		legend_margin = {top:100, bottom:20, left:10, right:10};
		if(legend_svg){
			legend_svg.remove();
		}
		legend_svg = d3.select(legend_container).append('svg')
		.attr('width', '100%').attr('height', '100%');

		// init_legend_width = $(legend_svg.node()).width();
		// init_legend_height = $(legend_svg.node()).height();

		legend_aspect_ratio = legend_width / legend_height;

		init_legend_width = 350;
		init_legend_height = init_legend_width / legend_aspect_ratio;

		var scaleX = legend_width / init_legend_width;
		var scaleY = legend_height / init_legend_height;

		var dot_min = Infinity, dot_max = -Infinity;
		for(var i = 0; i < data.length; i++){
			for(var j in data[i].NumStudents){
				if(data[i].NumStudents[j] < dot_min){
					dot_min = data[i].NumStudents[j];
				} 
				if(data[i].NumStudents[j] > dot_max){
					dot_max = data[i].NumStudents[j];
				}
			}
		}
		if(dot_min < 40) dot_min  = 40;
		var r_max = Math.ceil(Math.log(dot_max/10));
		var r_min = Math.ceil(Math.log(dot_min/10));

		var r_range = [];
		var cum = 0;
		for(var i = r_min; i < r_max; i+=3){
			var v = Math.ceil(Math.exp(i) * 10);
			var n = v.toString().length - 1;
			v = d3.round(v, -n);
			var r = Math.log(v/10);
			r_range.push({
				'r' : r,
				'cum' : cum 
			});
			cum += r*2;
		}

		if(r_max - r_range[r_range.length-1].r > 0){
			r_range.push({
				r : r_max,
				cum : cum
			});
		}
		var numDots = 5;
		var interval = (dot_max - dot_min) / numDots;

		legend_g = legend_svg.append('g')
		.attr('transform', 'scale(' + [scaleX, scaleY] +') translate(' + [legend_margin.left, legend_margin.top] + ')');

		var dot_enter = legend_g.selectAll('.dot-legend')
		.data(r_range)
		.enter()
		.append('g').attr('class', '.dot-legend')
		.attr('transform', function(d, i){
			return 'translate(' + [r_max, d.cum + d.r + space*i] + ')';
		});
		
		dot_enter.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', function(d){
			return d.r;
		})
		.attr('fill', function(d){
			return 'gray';
		})
		.attr('stroke', 'black').attr('stroke-width', 1);

		dot_enter.append('text')
		.attr('text-anchor', 'start')
		.attr('dominant-baseline', 'middle')
		.attr('x', r_max*2 + 5)
		.attr('y', 2)
		.text(function(d, i){
			if(i == r_range.length - 1){
				return Math.round(dot_max);
			}
			else {
				var value = Math.exp(d.r) * 10;
				return Math.round(value);
			}
		});
	};

	this.hideLegend = function(){
		if(legend_svg)
			legend_svg.remove();
	};
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

	this.mode = function(_){
		return mode;
	};

	this.svg = function(){
		return d3.select(graph_container).select('svg').node();
	};
}

ScatterPlot.SCATTER = 'scatter';
ScatterPlot.TRAJECTORY = 'trajectory';