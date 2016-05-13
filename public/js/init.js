$(document).ready(function(){
    var url = service_url + 'loaddata';
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