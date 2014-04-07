/*global define*/

define([
    'jquery',
    'backbone',
    'routes/router'
], function ($, Backbone) {
    'use strict';

    var app = window.app = {
        initialize: function () {
        },
        updateAuthState: function (state) {
            if (state === 'success') {
                Backbone.history.navigate('/', { trigger: true });
            }
            else {
                Backbone.history.navigate('/login', { trigger: true });
            }
        },
    };

    return app;
});
