function draw(data){
	global_data = data;
	inst_label();
	slider(data);
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
	})

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
	var margin = {top: 60, right: 20, bottom: 40, left: 40};
	var width = W - margin.left - margin.right;
	var height = H - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]).domain([0,100]);
	var y = d3.scale.linear().range([height, 0]).domain([0,100]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

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
	.attr("y", -6)
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
	.attr("dy",".71em")
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