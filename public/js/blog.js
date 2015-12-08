/**
 * Created by chetan on 12/4/2015.
 */
/**
 * Created by chetan on 12/4/2015.
 */
$(document).ready(function(){


    $('form').submit(function(evt){

        evt.preventDefault();

        var formData = $(this).serialize();
        alert(formData);
    });// form submit end




});// end ready