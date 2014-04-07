/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore'
    }
});

require([
    'backbone',

    'app',
    'routes/router'
], function (Backbone, App, Router) {
    $(document).ajaxError(function (e, xhr) {
        if (xhr.status === 401) {
            Backbone.history.navigate('/login', { trigger: true });
        }
    });

    App.initialize();
    Router.initialize();
});
