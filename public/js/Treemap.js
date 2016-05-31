function Treemap(){
	var data;
	var graph_container = '#treemap-canvas';
	var width, height, W, H;
	var margin = {left:20, right:20, top:20, bottom:20};
	var svg, treemap_g;
	var treemap;
	this.init = function(){
		width = $(graph_container).width();
		height = $(graph_container).height();

		if(width === 0 || height === 0){
			width = $('#canvas').width();
			height = $('#canvas').height();
		}
		
		if(svg){
			svg.remove();
		}
		svg = d3.select(graph_container).append('svg')
		.attr('width', width).attr('height', height);

		treemap_g = svg.append('g')
		.attr('transform', 'translate(' + [margin.left, margin.top] + ')');
		
		W = width - margin.left - margin.right;
		H = height - margin.top - margin.bottom;

		treemap = d3.layout.treemap()
		.sticky(true)
		.size([W, H]).value(function(d){
			return d.size;
		});
		return this;
	};

	this.update = function(){
		this.init();

		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:white'>" + d.name + "</span>";
		});

		var color_scales = [];

		color_scales[0] = d3.scale.quantize().domain([0, 100]).range(['#edf8fb','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824']);
		color_scales[1] = d3.scale.quantize().domain([0, 100]).range(['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486']);
		color_scales[2] = d3.scale.quantize().domain([0, 100]).range(['#ffffd4','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#8c2d04']);

		function color(d){
			if(d.GradRate === 0){
				return 'white';
			}
			else{
				return (color_scales[d.InstSector - 1])(d.GradRate);
			}
		}
		var dat = {
			'name' : 'root', 
			'children' : data.filter(function(d, i){
				var inst_sector_filter = state.InstSelections.has(inst_types[d.InstSector - 1]);
				var missing_data_filter = opt.filter_missing_data ?  (d["GradRate"][state.year] >= 0 && d["Pell"][state.year] >= 0) : true;
				var ncaa_conf_filter = state.ConfSelections.size() == 0 || state.ConfSelections.has(d.InstConf);
				return inst_sector_filter && missing_data_filter && ncaa_conf_filter;
			}).map(function(d){
				return {
					'name' : d.InstName,
					'id' : d.UnitID,
					'InstSector' : d.InstSector,
					'GradRate' : d.GradRate[state.year],
					'size' : d.Pell[state.year]
				};
			})
		};
		
		svg.call(tip);

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
		// .transition()
		// .duration(500)
		.attr('transform', function(d, i){
			return 'translate(' + [d.x, d.y] + ')';
		});

		nodesUpdate.selectAll('rect')
		// .transition()
		// .duration(500)
		.attr('x', 0).attr('y', 0)
		.attr('width', function(d){return d.dx;}).attr('height', function(d){return d.dy;})
		.attr('stroke-width', 1).attr('stroke', 'black').attr('fill', function(d){
			if(!d.children)
				return color(d);
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