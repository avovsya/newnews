/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var EmailListView = Backbone.View.extend({
        template: JST['app/scripts/templates/emails.ejs']
    });

    return EmailListView;
});
