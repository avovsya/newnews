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
            var _this = this;
            this.model.on('change:selected', function (model, val) {
                if (val) {
                    _this.$el.addClass('active');
                }
                else {
                    _this.$el.removeClass('active');
                }
            });
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
