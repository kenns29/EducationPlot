function initPlot(){
	//$("#plot").remove();

	d3.select("#title").select("H3").text("Grade Rate, Pell, Year = " + state.year);

	d3.selectAll("#plot").remove();
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
	var margin = {top: 20, right: 60, bottom: 40, left: 60};
	var width = W - margin.left - margin.right;
	var height = H - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]).domain([-10,110]);
	var y = d3.scale.linear().range([height, 0]).domain([-10,110]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom")
	.innerTickSize(-height)
	.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
	var yAxis = d3.svg.axis().scale(y).orient("left")
	.innerTickSize(-width)
	.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

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
		var inst_sector_filter = state.InstSelection ? (d.InstSector == state.InstSelection) : true;
		var missing_data_filter = opt.filter_missing_data ?  (d["GradRate"][state.year] >= 0 && d["Pell"][state.year] >= 0) : true;
		return inst_sector_filter && missing_data_filter;
	})
	.attr("class","dot")
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
	.attr('stroke', 'gray')
	.attr('stroke-width', 0.5)
	.attr("fill", function(d){
		return color[d.InstSector - 1];
	});

	enter.on('mouseover', tip.show);
	enter.on('mouseout', tip.hide);
}

function updatePlot(){
	d3.select("#title").select("H3").text("Grade Rate, Pell, Year = " + state.year);
	var div = d3.select("#canvas").append("div").attr("id","plot");
	var W = $("#canvas").width();
	var H = $("#canvas").height();
	var margin = {top: 20, right: 60, bottom: 40, left: 60};
	var width = W - margin.left - margin.right;
	var height = H - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]).domain([-10,110]);
	var y = d3.scale.linear().range([height, 0]).domain([-10,110]);

	d3.selectAll(".dot")
	/*.attr("r", function(d){
		return Math.ceil(Math.log(Math.max(2, d["NumStudents"][state.year]/10)));
	})*/
	.transition() 
	.attr("cx", function(d){return x(d["GradRate"][state.year])})
	.attr("cy", function(d){return y(d["Pell"][state.year])})
	.attr('stroke', 'gray')
	.attr('stroke-width', 0.5)
	.attr("fill", function(d){
		return color[d.InstSector - 1];
	});
}