function Treemap(){
	var data;
	var graph_container = '#treemap-canvas';
	var width, height, W, H;
	var margin = {left:20, right:20, top:20, bottom:20};
	var svg, treemap_g;
	this.init = function(){
		width = $(graph_container).width();
		height = $(graph_container).height();

		svg = d3.select(graph_container).append('svg')
		.attr('width', width).attr('height', height);

		treemap_g = svg.append('g')
		.attr('transform', 'translate(' + [margin.left, margin.top] + ')');
		
		W = width - margin.left - margin.right;
		H = height - margin.top - margin.bottom;
		return this;
	};

	this.update = function(){
		// var dat = data.map(function(d){
		// 	return {
		// 		'name' : d.InstName,
		// 		'id' : d.Inst
		// 		'value' : d.Pell[state.year]
		// 	};
		// })

		var treemap = d3.layout.treemap()
		.size([W, H]).sticky(true).value(function(d){
			console.log('d', d);
			return d.Pell[state.year];
		});

		var nodes = treemap_g.selectAll('.treemap-nodes')
		.data(treemap.nodes(data), function(d){
			return d.UnitID;
		});

		var nodesEnter = nodes.enter().append('g')
		.attr('class', 'treemap-nodes');
		nodesEnter.append('rect');

		var nodesExit = nodes.exit();
		nodesExit.remove();

		var nodesUpdate = treemap_g.selectAll('.treemap-nodes')
		.attr('transform', function(d, i){
			return 'translate(' + [d.x, d.y] + ')';
		});

		nodesUpdate.selectAll('rect')
		.attr('x', 0).attr('y', 0)
		.attr('width', function(d){return d.dx;}).attr('height', function(d){return d.dy;})
		.attr('stroke-width', 1).attr('stroke', 'black');

		return this;
	};

	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	this.container = function(_){
		return (arguments.length > 0) ? (container = _, this) : container;
	};
}