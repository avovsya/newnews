/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var HeaderView = Backbone.View.extend({
        template: JST['app/scripts/templates/header.ejs'],

        initialize: function () {
            this.render();
        },

        render: function () {
            var _this = this;
            $.get('/api/auth/ping', function (data) {
                _this.$el.html(_this.template({ user: data.user }));
            })
            return this;
        }
    });

    return HeaderView;
});
