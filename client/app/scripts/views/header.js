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

        render: function () {
            var _this = this;
            $.ajax('/api/auth/ping', {
                success: function (data) {
                    $('.header').html(_this.template({ user: data.user }));
                }
            })
            return this;
        }
    });

    return HeaderView;
});
