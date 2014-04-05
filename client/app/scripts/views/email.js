/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var EmailView = Backbone.View.extend({
        template: JST['app/scripts/templates/email.ejs'],

        tagName: 'tr',

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return EmailView;
});
