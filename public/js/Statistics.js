function stat(mean, std, InstSector, variable){
	this.mean = mean;
	this.std = std;
	this.InstSector = InstSector;
	this.variable = variable;
}

function calMeanStd(data){
	var statResult = [];
	for(var i = 0; i < inst_types.length; i ++){
		if(state.InstSelections.has(inst_types[i])){
			var mydata = [];
			data.forEach(function(d){
				if(d.InstSector == i+1 && d["GradRate"].hasOwnProperty(state.year) && d["Pell"].hasOwnProperty(state.year)){
					if(opt.filter_missing_data){
						if((d["GradRate"][state.year] >= 0 && d["Pell"][state.year] >= 0)){
							mydata.push(d);
						}
					}else{
						mydata.push(d);
					}
				}
			})

			
			mean_gradrate = 0;
			std_gradrate = 0;
			mean_pell = 0;
			std_pell = 0;
			mydata.forEach(function(d){
				mean_gradrate += d["GradRate"][state.year];
				std_gradrate += d["GradRate"][state.year] * d["GradRate"][state.year];
				mean_pell += d["Pell"][state.year];
				std_pell += d["Pell"][state.year]*d["Pell"][state.year];
			})

			mean_gradrate /= mydata.length;
			mean_pell /=mydata.length;
			std_gradrate /= mydata.length;
			std_gradrate = Math.sqrt(std_gradrate - mean_gradrate*mean_gradrate);
			std_pell /= mydata.length;
			std_pell = Math.sqrt(std_pell - mean_pell * mean_pell);

			statResult.push(new stat(mean_gradrate, std_gradrate, i+1, "GradRate"));
			statResult.push(new stat(mean_pell, std_pell, i+1 , "Pell"));
		}
		
	}
	console.log(statResult);
	return statResult;
}