/*global define*/

define([
    'underscore',
    'backbone',
    'models/sender'
], function (_, Backbone, SenderModel) {
    'use strict';

    var SendersCollection = Backbone.Collection.extend({
        model: SenderModel
    });

    return SendersCollection;
});
