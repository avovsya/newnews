/*global define*/

define([
    'underscore',
    'backbone',
    'models/email'
], function (_, Backbone, EmailModel) {
    'use strict';

    var EmailsCollection = Backbone.Collection.extend({
        model: EmailModel
    });

    return EmailsCollection;
});
