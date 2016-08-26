function draw(data, confs, userCohorts){
	preprocess(data);
	scatterPlot = new ScatterPlot().data(data).init().update();
	treemap = new Treemap().data(data).init().update();
	boxPlot = new BoxPlot().data(data).init().update();
	init_search(data);
	instLabel = new InstLabel().init();;
	inst_confs(confs);
	inst_userCohorts_modal(data)
	inst_userCohorts(userCohorts);
	// slider(data);
	slider = new Slider().data(data).init();
}

function preprocess(data){
	data.forEach(function(d){
		d["fade"] = false;
	})
}
/*
* Institution type label
*/

function init_search(data){

	var institution = ["All"];
	var tokenfield = $("#tokenfield");
	data.forEach(function(d){
		institution.push(d.InstName);
	})
	$("#institution").val("All");
	var institutionList = $("#institution").autocomplete({
		source:institution,	
		select:function(event, ui){			
			if(ui.item == null){
				scatterPlot.search("All");
			}else{
				scatterPlot.search(ui.item.value);
			}
		}
	});

	tokenfield.tokenfield();
	tokenfield.tokenfield('writeable');
	tokenfield.tokenfield('setTokens', [{value : 0, label : "All"}]);
	tokenfield.on('tokenfield:createtoken', function (event) {
	    var existingTokens = $(this).tokenfield('getTokens');
	    for(var key in existingTokens) {
	    	if(existingTokens[key].value == event.attrs.value) {
	    		event.preventDefault();
	    		break;
	    	}
	    }
	    // if(event.attrs.value == 0 && existingTokens.length > 0)
	    // 	event.preventDefault();
	});
	tokenfield.on('tokenfield:removetoken', function(event) {
		if(event.attrs.value == 0)
			event.preventDefault();
	});
	tokenfield.on('tokenfield:removedtoken', function(event) {
		scatterPlot.search();
	});
}


/*
   Conference dropdown
 */
function inst_confs(confs){
	var dropdown = $("#conference-dropdown");
	confs.sort(function(a, b) {
		if(a.Name < b.Name)
			return -1;
		else if(a.Name > b.Name)
			return 1;
		else
			return 0;
	});
	for(var key in confs) {
		var element = $('<label style="display:block;width:200px;"><input type="checkbox"/>' + confs[key].Name + '</label>');
		element.attr("value", confs[key].Code);
		element.click(function() {
			var checkboxes = $("#conference-dropdown")[0].childNodes;
			var selected_confs = [];
			for(var i = 0; i < checkboxes.length; i++) {
				if(checkboxes[i].childNodes[0].checked)
					selected_confs.push(Number(checkboxes[i].getAttribute("value")));
			}
			state.ConfSelections = d3.set(selected_confs);
			if(scatterPlot)
				scatterPlot.update();
			if(treemap)
				treemap.update();
		});
		dropdown.append(element).end();
	}
}

function inst_userCohorts_modal(data) {
	for(var key in data) {
		$("#availableSchools").append('<div value=' + data[key].UnitID + '>' + data[key].InstName + '</div>')
	}

	$("#availableSchools div").click(function() {
		if(!$(this).hasClass('selected')) {
			$(this).addClass('selected');
			var chosen = $(this).clone()
			$("#chosenSchools").append(chosen);
			$(chosen).click(function(){
				$("#availableSchools div").each(function() {
					if($(this).attr('value') == $(chosen).attr('value')) {
						$(this).removeClass('selected')
					}
				});
				$(this).remove()
			})
		}
	})
}
/*
   User Defined dropdown
 */
function inst_userCohorts(cohorts) {
	for(var key in cohorts) {
		var element = $('<div class="checkbox checkbox-primary"><input type="checkbox"><label>' + key + '</label></div>');
		element.attr("value", key);
		element.click(function() {
			var checkboxes = $("#user-cohort-checkboxes")[0].childNodes;
			var selected_cohorts = [];
			for(var i = 0; i < checkboxes.length; i++) {
				if(checkboxes[i].childNodes[0].checked) {
					for(var j in cohorts[checkboxes[i].getAttribute("value")]) {
						selected_cohorts.push(Number(cohorts[checkboxes[i].getAttribute("value")][j]));
					}
				}
			}
			state.CohortSelections = d3.set(selected_cohorts);
			if(scatterPlot)
				scatterPlot.update();
			if(treemap)
				treemap.update();
		});
		$("#user-cohort-checkboxes").append(element).end();
	}
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
			if(scatterPlot.mode() === ScatterPlot.SCATTER)
				scatterPlot.update();
			else
				scatterPlot.updateTrajectory();
			treemap.update();
			boxPlot.update();
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