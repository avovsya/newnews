/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var EmailsView = Backbone.View.extend({
        template: JST['app/scripts/templates/emails.ejs']
    });

    return EmailsView;
});
