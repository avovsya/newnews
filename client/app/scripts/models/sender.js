/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var SenderModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return SenderModel;
});
