function ScatterPlot(){
	var self = this;
	var graph_container = '#canvas';
	var title_container = '#title';
	var legend_container = '#dot-legend-container';
	var data;
	var W, H, margin, width, height;
	var svg;
	var xAxis, yAxis, x, y;
	var mode = ScatterPlot.SCATTER;

	this.init = function(){
		//title
		d3.select(title_container).select("H3").text("Grade Rate, Pell, Year = " + state.year);
		
		//size
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
		.text("Pell (%)");

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
		.text("Grad Rate (%)");

		//init the dot legend
		(function(){
			var legend_width = $(legend_container).width();
			var legend_height = $(legend_container).height();
			var legend_margin = {top:100, bottom:20, left:10, right:10};
			var legend_svg = d3.select(legend_container).append('svg')
			.attr('width', legend_width).attr('height', legend_height);

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

			var legend_g = legend_svg.append('g')
			.attr('transform', 'translate(' + [legend_margin.left, legend_margin.top] + ')');

			var dot_enter = legend_g.selectAll('.dot-legend')
			.data(r_range)
			.enter()
			.append('g').attr('class', '.dot-legend')
			.attr('transform', function(d, i){
				return 'translate(' + [r_max, d.cum + d.r + 20*i] + ')';
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
		})();
		return this;
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
		.duration(500)
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
			.append("svg").attr("class","meanstd_pell");
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
			.append("svg").attr("class","meanstd_gradrate");
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
		// svg.selectAll('.t-dot').remove();
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

		if(tokens.length == 0) {
			tokenfield.tokenfield("setTokens", []);
			self.search("All");
			return;
		}
		var IDs = d3.set();
		tokens.forEach(function(inst) {
			IDs.add(inst.value);
		});
		data.forEach(function(inst) {
			if(IDs.has(0) || IDs.has(inst.UnitID)) {
				inst.fade = false;
			} else {
				inst.fade = true;
			}
		});
		tokenfield.tokenfield("setTokens", tokens);
		$("#institution").val(instLabel);
		self.update();
		// TODO: Use solution that isn't so taxing!
		treemap.update();
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

	this.mode = function(_){
		return mode;
	};
}

ScatterPlot.SCATTER = 'scatter';
ScatterPlot.TRAJECTORY = 'trajectory';