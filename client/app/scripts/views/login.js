/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var LoginView = Backbone.View.extend({
        template: JST['app/scripts/templates/login.ejs'],

        tagName: 'div',
        className: 'auth',

        events: {
            'click .google': 'login'
        },
        login: function (e) {
            var url = '/api/auth/google',
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            window.open(url, 'google_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
            e.preventDefault();
        },

        render: function () {
            this.$el.html(this.template());
            $('.content').html(this.$el);
            return this;
        }
    });

    return LoginView;
});
