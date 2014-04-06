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
            var _this = this;
            this.senders = new SenderCollection();
            this.emails = new EmailCollection();


            this.senderListView = new SenderListView({ collection: this.senders });
            this.emailListView = new EmailListView({ collection: this.emails });

            this.senders.on('change:selected', function (sender) {
                _this.emails.url = '/api/emails/' + sender.get('address') + '/' + sender.get('name');
                _this.emails.fetch();
            });
            
            this.senders.fetch(function () {
                _this.senders[0].selected = true;
            });

            this.render();
        },

        render: function () {
            this.$el.html(this.template());

            var sidebar = this.$el.find('.sidebar');
            var mainContent = this.$el.find('.main-content');

            sidebar.append(this.senderListView.render().el);
            mainContent.append(this.emailListView.render().el);
            this.return;
        }
    });

    return TwocolumnView;
});
