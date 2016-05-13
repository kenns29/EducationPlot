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
	scatterPlot.update();
});

