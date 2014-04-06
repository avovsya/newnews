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
    $(document).ajaxError(function (e, xhr, settings, error) {
        if (xhr.status === 401) {
            App.router.navigate('/login', { trigger: true });
        }
    })

    App.initialize();
    App.router = Router.initialize();
});
