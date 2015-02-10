define(['knockout', 'jquery','moment'], function (ko, $, moment) {
    "use strict";

    ko.bindingHandlers['date'] = {
        'update': function (element, valueAccessor) {
            var dateTime = ko.utils.unwrapObservable(valueAccessor());

            //todo: utiliser text binding handler

            //return moment(x).format("dddd, MMMM Do YYYY, h:mm:ss a");
            $(element).text(moment(dateTime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        }
    };
});