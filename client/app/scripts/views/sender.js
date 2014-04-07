/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var SenderView = Backbone.View.extend({
        template: JST['app/scripts/templates/sender.ejs'],

        tagName: 'tr',

        initialize: function () {
            this.model.bind('change:selected', function (model, selected) {
                selected ? this.$el.addClass('active') : this.$el.removeClass('active');
            }, this);
        },

        events: {
            'click': 'senderSelected'
        },

        senderSelected: function (e) {
            this.model.set('selected', true);
            e.preventDefault();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return SenderView;
});
