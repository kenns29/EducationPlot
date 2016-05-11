$(document).ready(function(){
    var url = 'http://localhost:3000/loaddata';
    var config = {
    };

    $.ajax({
        type: 'GET',
        url: url,
        data: config,
        dataType: 'json',
        beforeSend: function (jqXHR, settings) {
        },
        success: function (data, textStatus, jqXHR) {
            console.log('data', data);
            draw(data);
        },
        error: function (jqXHR, textStatus, message) {
            console.log(message);
            console.log(textStatus);
        },
        complete: function (jqXHR, textStatus) {
            console.log(textStatus);
        }
    });
})