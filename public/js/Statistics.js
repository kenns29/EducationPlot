function stat(mean, std, InstSector){
	this.mean = mean;
	this.std = std;
	this.InstSector = InstSector;
}

function calMeanStd(data){
	var mean_grate = [];
	var mean2_grate = [];
	var mean_pell = [];
	var mean2_pell = [];
	for(var i = 0; i < inst_types.length; i ++){
		mean_grate[i] = 0;
		mean2_grate[i] = 0;
		mean_pell[i] = 0;
		mean2_pell[i] = 0;
	}
	myData = [];
	if(opt.filter_missing_data){
		data.forEach(function(d) {
			if(d["GradRate"][state.year] >= 0 && d["Pell"][state.year] >= 0) {
				myData.push(d);
			}
		})
	}else myData = data;

	myData.forEach(function(d){
		var index = d.InstSector;
		mean_grate[index] += d["GrateRate"][state.year];
		mean2_grate[index] += d["GrateRate"][state.year]*d["GrateRate"][state.year];

		mean_pell[index] += d["Pell"][state.year];
		mean2_pell[index] += d["Pell"][state.year] * d["Pell"][state.year];
	});

	console.log(mean_grate);
}