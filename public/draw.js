function draw(data){
	global_data = data;
	inst_label();
	slider(data);
	updatePlot();
}

function slider(data){

	var div = d3.select("#slider");
	var yearRange = getYearRange(data);	
	console.log(yearRange);

	$("#slider").slider({
		range: false,
		min: yearRange[0],
		max: yearRange[1],
		step: 1,
		slide: function(event, ui){
			state.year = ui.value;
			console.log(ui.value);
			updatePlot();
		}
	});

	var s_width = $('#slider').width();
	var t_width = $('#slider-ticks').width();
	var t_height = $('#slider-ticks').height();
	var t_margin = {left:(t_width - s_width) / 2, right:(t_width - s_width)/2, top:2, bottom:1};

	var marks = d3.select('#slider-ticks').append('svg')
	.attr('width', t_width+t_margin.left+t_margin.right)
	.attr('height', t_height+t_margin.top + t_margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + [t_margin.left, t_margin.top] + ')')
	.selectAll('g')
	.data(d3.range(yearRange[0], yearRange[1] + 1, 1))
	.enter()
	.append('g');

	var ticks = marks.append('line')
	.attr('x1', function(d, i){
		var p = s_width / (yearRange[1] - yearRange[0]);
		return i * p;
	})
	.attr('y1', function(){
		return 2;
	})
	.attr('x2', function(d, i){
		var p = s_width / (yearRange[1] - yearRange[0]);
		return i * p;
	})
	.attr('y2', function(){
		return 10;
	}).attr('stroke', 'black').attr('stroke-width', 1);


	var texts = marks.append('text')
	.attr('x', function(d, i){
		var p = s_width / (yearRange[1] - yearRange[0]);
		return i * p;
	})
	.attr('y', function(){
		return 12;
	})
	.attr('dominant-baseline', 'hanging')
	.attr('text-anchor', 'middle')
	.attr('fill', 'black')
	.text(function(d){
		return d;
	});
	function getYearRange(data){
		var min = new Date().getFullYear();
		var max = 0;
		
		for(var i = 0; i < data.length; i ++){
			var obj = data[i];
			if(obj.hasOwnProperty("GradRate")){
				for(year in obj["GradRate"]){
					year = parseInt(year);
					if(year < min) min = year;
					if(year > max) max = year;
				}
			}
		}		
		
		return [min, max];
	}
}

function updatePlot(){
	$("#plot").remove();

	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<span style='color:white'>" + d.InstName + "</span>";
	});
	var data = global_data;
	var div = d3.select("#canvas").append("div").attr("id","plot");
	var W = $("#canvas").width();
	var H = $("#canvas").height();
	var margin = {top: 60, right: 20, bottom: 40, left: 60};
	var width = W - margin.left - margin.right;
	var height = H - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]).domain([-10,110]);
	var y = d3.scale.linear().range([height, 0]).domain([-10,110]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom")
	.innerTickSize(-height);
	var yAxis = d3.svg.axis().scale(y).orient("left")
	.innerTickSize(-width);

	var svg = div.append("svg")
	.attr("width", W)
	.attr("height", H)
	.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);
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

	var enter = svg.selectAll(".dot")
	.data(data)
	.enter().append("circle");

	enter
	.filter(function(d, i){
		return state.InstSelection ? (d.InstSector == state.InstSelection) : true;
	})
	.attr("class","dot")
	.attr("r", function(d){
		return Math.ceil(Math.log(Math.max(2, d["NumStudents"][state.year]/10)));
	})
	.attr("cx", function(d){return x(d["GradRate"][state.year])})
	.attr("cy", function(d){return y(d["Pell"][state.year])})
	.attr('stroke', 'gray')
	.attr('stroke-width', 0.5)
	.attr("fill", function(d){
		return color[d.InstSector - 1];
	});

	enter.on('mouseover', tip.show);
	enter.on('mouseout', tip.hide);
}


function inst_label(){
	var width = $('#control').width();
	var height = $('#control').height();

	var boxHeight = 20;
	var boxWidth = 30;
	var margin = {top: 60, right: 20, bottom: 40, left: width - boxWidth - 10};
	var W = width - margin.left - margin.right;
	var H = height - margin.top - margin.bottom;
	

	var svg = d3.select('#control').append('svg')
	.attr('width', width).attr('height', height);

	var g = svg.append('g')
	.attr('transform', function(){
		return 'translate(' + [margin.left,  margin.top] + ')';
	});
	var boxEnter = g.selectAll('g')
	.data(['Public', 'Private not-for-profit', 'Private for-profit', 'All'])
	.enter().append('g')
	.attr('transform', function(d, i){
		return 'translate(' + [0, i*boxHeight] + ')';
	})

	boxEnter.append('rect')
	.attr('x', 0).attr('y', 0)
	.attr('width', boxWidth).attr('height', 20)
	.attr('stroke', 'black').attr('stroke-width', 1)
	.attr('fill', function(d, i){
		if(i == 3)
			return 'white'
		return color[i];
	});

	boxEnter.append('text')
	.attr('dominant-baseline', 'middle')
	.attr('text-anchor', 'end')
	.text(function(d){
		return d;
	})
	.attr('x', -2)
	.attr('y', boxHeight / 2);

	boxEnter.on('click', function(d, i){
		if(i > 2){
			state.InstSelection = null;
			d3.select(this.parentNode).selectAll('g')
			.select('rect')
			.attr('stroke', 'black');
			
		}
		else{
			state.InstSelection = i + 1;
			d3.select(this).select('rect').attr('stroke', 'red');
			d3.select(this.parentNode).selectAll('g').filter(function(g, j){
				return g != d;
			})
			.select('rect')
			.attr('stroke', 'black');
		}

		updatePlot();
	});
}