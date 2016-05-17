function draw(data){
	console.log(data);
	preprocess(data);
	scatterPlot = new ScatterPlot().data(data).init().update();
	inst_label();
	slider(data);
}

function preprocess(data){
	data.forEach(function(d){
		d["fade"] = false;
	})
	console.log(data);
}
/*
* Institution type label
*/
function inst_label(){
	var width = $('#school-type-selection-control').width();
	var height = $('#school-type-selection-control').height();

	var boxHeight = 20;
	var boxWidth = 30;

	var checkboxWidth = 20;
	var margin = {top: 60, right: 20, bottom: 40, left: width - checkboxWidth - 10};
	var W = width - margin.left - margin.right;
	var H = height - margin.top - margin.bottom;
	

	var svg = d3.select('#school-type-selection-control').append('svg')
	.attr('width', width).attr('height', height);

	var g = svg.append('g')
	.attr('transform', function(){
		return 'translate(' + [margin.left,  margin.top] + ')';
	});

	var boxEnter = g.selectAll('g')
	.data(inst_types)
	.enter().append('g')
	.attr('transform', function(d, i){
		return 'translate(' + [0, i*checkboxWidth] + ')';
	})

	boxEnter.append('circle')
	.attr('cx', checkboxWidth/2 + 2)
	.attr('cy', checkboxWidth/2 )
	.attr('r', checkboxWidth / 2)
	.attr('stroke', 'black')
	.attr('stroke-width', 1)
	.attr('fill', function(d, i){
		if(i == 3){
			return 'white';
		}
		return color[i];
	});

	boxEnter
	.filter(function(d, i){
		return state.InstSelections.has(d);
	})
	.append('path')
	.attr('d', function(d, i){
		return 'M6,9 L12,14 L23,4';
	})
	.attr('fill', 'none')
	.attr('stroke', 'black')
	.attr('stroke-width', 1.5);

	boxEnter.append('text')
	.attr('dominant-baseline', 'middle')
	.attr('text-anchor', 'end')
	.text(function(d){
		return d;
	})
	.attr('x', -2)
	.attr('y', boxHeight / 2);

	boxEnter.on('click', function(d, i){
		if(state.InstSelections.has(d)){
			state.InstSelections.remove(d);
			d3.select(this).select('path').remove();
		}
		else{
			state.InstSelections.add(d);
			d3.select(this).append('path')
			.attr('d', function(d, i){
				return 'M6,9 L12,14 L23,4';
			})
			.attr('fill', 'none')
			.attr('stroke', 'black')
			.attr('stroke-width', 1.5);
		}
		scatterPlot.update();
	});
}

/*
* Time slider
*/
function slider(data){

	var div = d3.select("#slider");
	var yearRange = getYearRange(data);	

	$("#slider").slider({
		range: false,
		min: yearRange[0],
		max: yearRange[1],
		step: 1,
		slide: function(event, ui){
			state.year = ui.value;
			scatterPlot.update();
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