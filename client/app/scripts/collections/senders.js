/*global define*/

define([
    'underscore',
    'backbone',
    'models/sender'
], function (_, Backbone, SenderModel) {
    'use strict';

    var SendersCollection = Backbone.Collection.extend({
        model: SenderModel,
        url: '/api/senders',

        initialize: function () {
            this.on('change:selected', function (sender) {
                if (this.selectedSender) {
                    this.selectedSender.set('selected', false);
                }
                this.selectedSender = sender;
            });
        }
    });

    return SendersCollection;
});
