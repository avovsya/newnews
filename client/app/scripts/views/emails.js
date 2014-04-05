/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

    './email',

    '../collections/emails'
], function ($, _, Backbone, JST, EmailView, EmailCollection) {
    'use strict';

    var EmailListView = Backbone.View.extend({
        template: JST['app/scripts/templates/emails.ejs'],

        tagName: 'table',
        className: 'table tabe-striped',

        initialize: function () {
            this.collection = new EmailCollection({
                addr: this.addr,
                name: this.name
            });
            this.collection.fetch();

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
