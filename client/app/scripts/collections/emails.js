/*global define*/

define([
    'underscore',
    'backbone',
    'models/email'
], function (_, Backbone, EmailModel) {
    'use strict';

    var EmailCollection = Backbone.Collection.extend({
        model: EmailModel
    });

    return EmailCollection;
});
