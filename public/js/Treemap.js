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
		
		var color_scale = d3.scale.quantize().domain([0, 100]).range(['white','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f']);
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
		

		var treemap = d3.layout.treemap()
		.size([W, H]).sticky(true).value(function(d){
			return d.size;
		});

		var treemap_nodes = treemap.nodes(dat);
		console.log('treemap nodes', treemap_nodes);

		var nodes = treemap_g.selectAll('.treemap-nodes')
		.data(treemap_nodes, function(d){
			return d.id;
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
		.attr('stroke-width', 1).attr('stroke', 'black').attr('fill', function(d){
			return color_scale(d.GradRate);
		});

		return this;
	};

	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	this.container = function(_){
		return (arguments.length > 0) ? (container = _, this) : container;
	};
}