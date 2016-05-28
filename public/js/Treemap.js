function Treemap(){
	var data;
	var graph_container = '#treemap-canvas';
	var width, height, W, H;
	var margin = {left:20, right:20, top:20, bottom:20};
	var svg, treemap_g;
	this.init = function(){
		width = $(graph_container).width();
		height = $(graph_container).height();

		if(width === 0 || height === 0){
			width = $('#canvas').width();
			height = $('#canvas').height();
		}
		
		svg = d3.select(graph_container).append('svg')
		.attr('width', width).attr('height', height);

		treemap_g = svg.append('g')
		.attr('transform', 'translate(' + [margin.left, margin.top] + ')');
		
		W = width - margin.left - margin.right;
		H = height - margin.top - margin.bottom;
		return this;
	};

	this.update = function(){
		
		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:white'>" + d.name + "</span><span style = 'color:white'>" + d.GradRate +"</span>";
		});

		var color_scale = d3.scale.quantize().domain([0, 100]).range(['#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f']);
		function color(d){
			if(d === 0){
				return 'white';
			}
			return color_scale(d);
		}
		var dat = {
			'name' : 'root', 
			'children' : data.filter(function(d, i){
				return d.Pell[state.year] > 0 && d.GradRate[state.year] > 0;
			}).map(function(d){
				return {
					'name' : d.InstName,
					'id' : d.UnitID,
					'GradRate' : d.GradRate[state.year],
					'size' : d.Pell[state.year]
				};
			})
		};
		
		svg.call(tip);

		var treemap = d3.layout.treemap()
		.size([W, H]).sticky(true).value(function(d){
			return d.size;
		});

		// var treemap_nodes = treemap.nodes(dat);

		// var node_map = d3.map(treemap_nodes, function(d){
		// 	return d.id;
		// });

		var nodes = treemap_g.datum(dat).selectAll('.treemap-nodes')
		.data(treemap.nodes, function(d){
			return d.id;
		});

		var nodesEnter = nodes.enter().append('g')
		.attr('class', 'treemap-nodes');
		nodesEnter.append('rect');

		var nodesExit = nodes.exit();
		nodesExit.remove();

		var nodesUpdate = treemap_g.selectAll('.treemap-nodes');


		// nodesUpdate.each(function(d, i){
		// 	var n = node_map.get(d.id);
		// 	d.size = n.size;
		// 	d.GradRate = n.GradRate;
		// 	d.x = n.x;
		// 	d.y = n.y;
		// 	d.dx = n.dx;
		// 	d.dy = n.dy;
		// });
		
		nodesUpdate
		.transition()
		.duration(1500)
		.attr('transform', function(d, i){
			return 'translate(' + [d.x, d.y] + ')';
		});

		nodesUpdate.selectAll('rect')
		.transition()
		.duration(1500)
		.attr('x', 0).attr('y', 0)
		.attr('width', function(d){return d.dx;}).attr('height', function(d){return d.dy;})
		.attr('stroke-width', 1).attr('stroke', 'black').attr('fill', function(d){
			return color(d.GradRate);
		});

		nodesUpdate.on('mouseover', tip.show);
		nodesUpdate.on('mouseout', tip.hide);
		return this;
	};

	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	this.container = function(_){
		return (arguments.length > 0) ? (container = _, this) : container;
	};
}