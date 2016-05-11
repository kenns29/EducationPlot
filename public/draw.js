function draw(data){
	global_data = data;
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

	svg.selectAll(".dot")
	.data(data)
	.enter().append("circle")
	.attr("class","dot")
	.attr("r", function(d){
		return Math.ceil(Math.log(d["NumStudents"][state.year]/10));
	})
	.attr("cx", function(d){return x(d["GradRate"][state.year])})
	.attr("cy", function(d){return y(d["Pell"][state.year])})
	.attr("fill", function(d){
		return color[d.InstSector - 1];
	});


}