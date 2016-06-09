function Slider(){
	var data, yearRange;
	this.init = function(){
		var div = d3.select("#slider");
		yearRange = getYearRange(data);	

		$("#slider").slider({
			range: false,
			min: yearRange[0],
			max: yearRange[1],
			step: 0.1,
			slide: function(event, ui){
				if(state.year !== Math.floor(ui.value)){
					state.year = Math.floor(ui.value);
					if($("#scatter-plot-tab-btn").hasClass('active')){
						if(scatterPlot.mode() === ScatterPlot.SCATTER){
							scatterPlot.update();
						}
						else{
							scatterPlot.updateTrajectory();
						}
						
					}
					else{
						treemap.update();
					}
					scatterPlot.InstClick();
					boxPlot.update();
				}
			}
		});

		this.redrawTicks();
		return this;
	};

	this.redrawTicks = function(){
		var s_width = $('#slider').width();
		var t_width = $('#slider-ticks').width();
		var t_height = $('#slider-ticks').height();
		var t_margin = {left:(t_width - s_width) / 2, right:(t_width - s_width)/2, top:2, bottom:1};

		if(d3.select('#slider-ticks').select('svg')){
			d3.select('#slider-ticks').select('svg').remove();
		}
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
		return this;
	};

	this.resize = function(){
		this.redrawTicks();
		return this;
	};

	this.svg = function(){
		return d3.select('#slider-ticks').select('svg').node();
	};

	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};

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