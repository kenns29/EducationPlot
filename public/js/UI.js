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
	}
});

$('#box-pell').click(function(){
	if(!$(this).hasClass('active')){
		$(this).addClass('active');
		$('#box-grad').removeClass('active');
		opt.box_plot_pell = true;
		boxPlot.update();
	}
});

$('#box-grad').click(function(){
	if(!$(this).hasClass('active')){
		$(this).addClass('active');
		$('#box-pell').removeClass('active');
		opt.box_plot_pell = false;
		boxPlot.update();
	}
});