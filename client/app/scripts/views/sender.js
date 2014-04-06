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

        events: {
            'click a': 'senderSelected'
        },

        senderSelected: function (e) {
            this.$el.addClass('selected');
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
