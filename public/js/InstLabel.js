function InstLabel(){
	var init_width, init_height;
	var svg, g;
	var margin;
	var aspect_ratio;
	this.init = function(){
		var width = $('#school-type-selection-control').width();
		var height = $('#school-type-selection-control').height();

		var boxHeight = 20;
		var boxWidth = 30;

		var checkboxWidth = 20;
		
		
		

		svg = d3.select('#school-type-selection-control').append('svg')
		.attr('viewport', '0 0 100% 100%')
		.attr('preserveAspectRatio', 'xMidYMid meet')
		.attr('width', '100%').attr('height', '100%');

		aspect_ratio = width / height;

		init_width = 330;
		init_height = init_width / aspect_ratio;

		margin = {top: 60, right: 20, bottom: 40, left: init_width - checkboxWidth - 10};
		var W = init_width - margin.left - margin.right;
		var H = init_height - margin.top - margin.bottom;

		var scaleX = width / init_width;
		var scaleY = height / init_height;
		g = svg.append('g')
		.attr('transform', function(){
			return 'scale(' + [scaleX, scaleY] + ') translate(' + [margin.left,  margin.top] + ')';
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
			if(scatterPlot)
				scatterPlot.update();
			if(treemap)
				treemap.update();
		});
		return this;
	};

	this.resize = function(){
		var currentWidth = $(svg.node()).width();
		var currentHeight = $(svg.node()).height();

		var scaleX = currentWidth / init_width;
		var scaleY = scaleX;

		console.log('scaleX', scaleX, 'scaleY', scaleY);
		g.attr('transform', 'scale(' + [scaleX, scaleY] + ') translate(' + [margin.left, margin.top] + ')');
		return this;
	};
}