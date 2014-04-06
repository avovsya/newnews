/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

    './sender',
    '../collections/senders'
], function ($, _, Backbone, JST, SenderView, SenderCollection) {
    'use strict';

    var SenderListView = Backbone.View.extend({
        template: JST['app/scripts/templates/senders.ejs'],

        tagName: 'table',
        className: 'table table-striped',

        initialize: function () {
            var _this = this;
            this.collection.bind('reset', this.render, this);
            this.collection.bind('add', this.render, this);
            this.collection.bind('remove', this.render, this);

            this.collection.on('change:selected', function (sender) {
                if (_this.selectedSender) {
                    _this.selectedSender.selected = false;
                }
                _this.selectedSender = sender;
            });
        },

        render: function () {
            var els = [];
            this.collection.each(function (item) {
                var itemView = new SenderView({ model: item });
                els.push(itemView.render().el)
            });
            this.$el.html(els);
            return this;
        }
    });

    return SenderListView;
});
