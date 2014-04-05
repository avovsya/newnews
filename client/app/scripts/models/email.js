/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var EmailModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return EmailModel;
});
