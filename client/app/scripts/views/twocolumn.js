/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

    './senders',
    './emails',

    'collections/senders',
    'collections/emails'
], function ($, _, Backbone, JST,
    SenderListView, EmailListView,
    SenderCollection, EmailCollection
    ) {
    'use strict';

    var TwocolumnView = Backbone.View.extend({
        template: JST['app/scripts/templates/twocolumn.ejs'],

        initialize: function () {
            this.senders = new SenderCollection();
            this.emails = new EmailCollection();

            this.senderListView = new SenderListView({ collection: this.senders });
            this.emailListView = new EmailListView({ collection: this.emails });

            this.senders.bind('change:selected', function (sender) {
                if (sender.get('selected') === false) return;
                this.emails.url = '/api/emails/' + sender.get('address') + '/' + sender.get('name');
                this.emails.fetch();
            }, this);

            this.senders.fetch({
                success: function (senders) {
                    senders.at(0).set('selected', true);
                }
            });

            this.render();
        },

        render: function () {
            this.$el.html(this.template());

            var sidebar = this.$el.find('.sidebar');
            var mainContent = this.$el.find('.main-content');

            sidebar.append(this.senderListView.render().el);
            mainContent.append(this.emailListView.render().el);
            return this;
        }
    });

    return TwocolumnView;
});
