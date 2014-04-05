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
        render: function () {
            $(this.el).html('Sender');
            return this;
        }
    });

    return SenderView;
});
