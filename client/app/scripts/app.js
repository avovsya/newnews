/*global define*/

define([
    'jquery',
    'backbone',
    'routes/router'
], function ($, Backbone, Router) {
    'use strict';

    var app = window.app = {
        initialize: function () {
            this.router = Router.initialize();
        },
        updateAuthState: function (state, user) {
            if (state === 'success') {
                this.router.navigate('/', { trigger: true })
            }
            else {
                this.router.navigate('/login', { trigger: true })
            }
        },
    };

    return app;
});
