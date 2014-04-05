/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'routes/router'
], function ($, _, Backbone, JST, router) {
    'use strict';

    var LoginView = Backbone.View.extend({
        template: JST['app/scripts/templates/login.ejs'],

        el: '#container',

        events: {
            'click .google': 'login'
        },

        initialize: function () {
            this.render();
        },

        login: function (e) {
            var url = '/api/auth/google',
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            //after the window close
            //It will call window.app.updateAuthState
            //with the state of authorization(success/failure)
            window.open(url, 'google_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
            e.preventDefault();
        },

        render: function () {
            var _this = this;
            //Check if user already authorized
            //If it is - navigate to '/'
            //$.get('/api/auth/ping', function (data) {
                //if (data.user) {
                    //return Backbone.history.navigate('/', { trigger: true })
                //}
            //});
            _this.$el.html(_this.template());
            return this;
        }
    });

    return LoginView;
});
