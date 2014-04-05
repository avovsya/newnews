/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

    './senders',
    './emails'
], function ($, _, Backbone, JST, SenderListView, EmailListView) {
    'use strict';

    var TwocolumnView = Backbone.View.extend({
        template: JST['app/scripts/templates/twocolumn.ejs'],
        initialize: function () {
            this.render();
        },

        render: function () {
            var senderListView = new SenderListView();
            //var emailListView = new EmailListView();

            this.$el.html(this.template());

            var sidebar = this.$el.find('.sidebar');
            var mainContent = this.$el.find('.main-content');

            sidebar.append(senderListView.render().el);
            //mainContent.append(emailListView.render().el);
            this.return;
        }
    });

    return TwocolumnView;
});
