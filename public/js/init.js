$(document).ready(function(){
    var data_url = service_url + 'loaddata';
    var conf_url = service_url + 'loadconfs';
    var userCohorts_url = service_url + 'loadusercohorts';
    var config = {
    };

    var store = new Object();
    $.when(
        $.get(data_url, config, function(data) {
            store.data = data;
        }, 'json'),
        $.get(conf_url, config, function(conf) {
            store.conf = conf;
        }, 'json'),
        $.get(userCohorts_url, config, function(cohorts) {
            store.userCohorts = cohorts;
        }, 'json')
    ).then(function() {
        draw(store.data, store.conf, store.userCohorts);
    });
});