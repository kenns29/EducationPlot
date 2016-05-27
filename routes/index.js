var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/api', function(req, res) {
	res.json('hello.');
});

router.get('/loaddata', function(req, res){
	fs.readFile('data.csv', 'utf8', function(err, contents){
		var rdata = [];
		var rows = contents.split('\n');
		var header = rows[0].split(',');

		for(var i = 1;  i < rows.length ;i++){
			var cells = rows[i].split(',');
			var useful_indices = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 28];
			var filter = (function(){
				for(var j = 0; j < useful_indices.length; j++){
					if(cells[useful_indices[j]] != ''){
						return false;
					}	
				}
				return true;
			})();
			if(!filter){
				rdata.push({
					UnitID : str2num(cells[0]),
					InstName : cells[1],
					InstSector : str2num(cells[4]),
					Pell : {
						'2008' : str2num(cells[21]),
						'2009' : str2num(cells[18]),
						'2010' : str2num(cells[15]),
						'2011' : str2num(cells[12]),
						'2012' : str2num(cells[9]),
						'2013' : str2num(cells[6]),
						'2014' : str2num(cells[2])
					},
					GradRate : {
						'2008' : str2num(cells[23]),
						'2009' : str2num(cells[20]),
						'2010' : str2num(cells[17]),
						'2011' : str2num(cells[14]),
						'2012' : str2num(cells[11]),
						'2013' : str2num(cells[8]),
						'2014' : str2num(cells[5])
					},
					NumStudents : {
						'2008' : str2num(cells[22]),
						'2009' : str2num(cells[19]),
						'2010' : str2num(cells[16]),
						'2011' : str2num(cells[13]),
						'2012' : str2num(cells[10]),
						'2013' : str2num(cells[7]),
						'2014' : str2num(cells[3])
					},
					InstConf : str2num(cells[28])
				});
			}
		}
		res.json(rdata);

		function str2num(str){
			if(str === ''){
				return  -1;
			}
			else{
				return Number(str);
			}
		}
	});
});

router.get('/loadconfs', function(req, res){
	fs.readFile('conferences.csv', 'utf8', function(err, contents){
		var rdata = [];
		var rows = contents.split('\n');
		var header = rows[0].split(',');

		for(var i = 1;  i < rows.length ;i++){
			var cells = rows[i].split(',');
			var useful_indices = [0, 1, 2];
			var filter = (function(){
				for(var j = 0; j < useful_indices.length; j++){
					if(cells[useful_indices[j]] != ''){
						return false;
					}	
				}
				return true;
			})();
			if(!filter){
				rdata.push({
					Name : cells[0],
					Short : cells[1],
					Code : str2num(cells[2])
				});
			}
		}
		res.json(rdata);

		function str2num(str){
			if(str === ''){
				return  -1;
			}
			else{
				return Number(str);
			}
		}
	});
});

module.exports = router;