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
		if(scatterPlot.mode() == ScatterPlot.TREJECTORY)
			$(this).addClass('active');
	}
	else{
		$(this).removeClass('active');
		scatterPlot.update();
	}
});

$('#multiple-select-checkbox').change(function(){
	if($(this).is(':checked')){
		opt.multiple_select = true;
	}
	else{
		opt.multiple_select = false;
		scatterPlot.search();
	}
	if(scatterPlot)
		scatterPlot.update();
	if(treemap)
		treemap.update();
});