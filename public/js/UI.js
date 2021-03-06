/*
*	Filter Missing Data Checkbox
*/
$('#filter-missing-data-checkbox').change(function(){
	if($(this).is(':checked')){
		opt.filter_missing_data = true;
	}
	else{
		opt.filter_missing_data = false;
	}
	if(scatterPlot)
		scatterPlot.update();
	if(treemap)
		treemap.update();
});

$('#show-mean-std-checkbox').change(function(){
	if($(this).is(':checked')){
		opt.show_mean_std = true;
	}else{
		opt.show_mean_std = false;
	}
	scatterPlot.update();
});

$('#show-trajectory-button').click(function(){
	if(!$(this).hasClass('active')){
		scatterPlot.showTrajectory();
		if(scatterPlot.mode() === ScatterPlot.TRAJECTORY)
			$(this).addClass('active');
	}
	else{
		$(this).removeClass('active');
		scatterPlot.removeTrajectory();
		scatterPlot.update();
	}
});

$('#multiple-select-checkbox').change(function(){
	if($(this).is(':checked')){
		$('#tokenfield-div').show();
		opt.multiple_select = true;
	}
	else{
		$('#tokenfield-div').hide();
		opt.multiple_select = false;
		scatterPlot.search();
		scatterPlot.removeTrajectory();
		scatterPlot.update();
	}
});

$('#box-pell').click(function(){
	if(!$(this).hasClass('active')){
		$(this).addClass('active');
		$('#box-grad').removeClass('active');
		opt.box_plot_pell = true;
		scatterPlot.InstClick();
		boxPlot.update();
	}
});

$('#box-grad').click(function(){
	if(!$(this).hasClass('active')){
		$(this).addClass('active');
		$('#box-pell').removeClass('active');
		opt.box_plot_pell = false;
		scatterPlot.InstClick();
		boxPlot.update();
	}
});


$('ul#view-nav-bar li').each(function(){
	$(this).on('click', function(){
		var id = $(this).attr('id');
		if(id === 'scatter-plot-tab-btn'){
			if(scatterPlot){
				scatterPlot.showLegend();
				scatterPlot.update();
			}

		}
		else if(id === 'treemap-tab-btn'){
			if(scatterPlot){
				scatterPlot.hideLegend();
				treemap.update();
			}
		}
	});
});

$('#addCustomCohort').click(function() {
	$("#availableSchools div").each(function() {
		$(this).removeClass('selected');
	});
	$('#newCohortName').val('');
	$("#chosenSchools").empty();
});

$('#removeCustomCohort').click(function(e) {
	$('#user-cohort-checkboxes').find('.remove-icon').toggle(300);
	e.stopPropagation();
});

$('#saveCustomCohort').click(function(e) {
	if($('#newCohortName').val() != '') {
		$('#newCohortName').closest('div').removeClass('has-error');
		$('#modal-error-msg').html('');
		$('#modal-error-msg').hide();
		var name = $('#newCohortName').val()
		var data = {}
		data[name] = []
		$("#chosenSchools div").each(function() {
			data[name].push(parseInt($(this).attr('value')));
		});
		$.post('/saveusercohorts', data, function(req, res){
			inst_userCohorts(JSON.parse(req))
		});

	}
	else {
		$('#newCohortName').closest('div').addClass('has-error');
		$('#modal-error-msg').html('Please choose a name');
		$('#modal-error-msg').show();
		e.stopPropagation();
	}
});

$(window).resize(function(){
	//resizes all svg and their contents
	if(scatterPlot) scatterPlot.resize();
	if(instLabel) instLabel.resize();
	if(treemap) treemap.resize();
	if(slider) slider.resize();
	
});