/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

    './email',
], function ($, _, Backbone, JST, EmailView) {
    'use strict';

    var EmailListView = Backbone.View.extend({
        template: JST['app/scripts/templates/emails.ejs'],

        tagName: 'table',
        className: 'table tabe-striped',

        initialize: function () {
            this.collection.bind('reset', this.render, this);
            this.collection.bind('add', this.render, this);
            this.collection.bind('remove', this.render, this);
        },

        render: function () {
            var els = [];
            this.collection.each(function (item) {
                var itemView = new EmailView({ model: item });
                els.push(itemView.render().el);
            });
            this.$el.html(els);
            return this;
        }
    });

    return EmailListView;
});
