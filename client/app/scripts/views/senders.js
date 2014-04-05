/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    './sender',
    '../models/sender'
], function ($, _, Backbone, JST, SenderView, SenderModel) {
    'use strict';

    var SendersView = Backbone.View.extend({
        template: JST['app/scripts/templates/senders.ejs'],

        el: $('.sidebar'),
        tagName: 'table',
        className: 'table table-striped',

        initialize: function () {
            this.model = SenderModel;
        },

        render: function () {
            var item;
            for (var i = 0; i < 10 ; i++) {
                item = new SenderView();
                this.$el.append(item.render().el);
            }
            return this;
        }
    });

    return SendersView;
});
