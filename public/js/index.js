window.app = window.app || {};
window.app.views = window.app.views || {};

$(function () {
    var app = window.app;

    // Backbone App
    app.views.SenderList = Backbone.View.extend({
        render: function () {
            $(this.el).html(
                app.templates.senders({ senders: app.senders }))
        }
    });



    // Templates
    app.templates = {};
    app.templates.senders = Handlebars.compile($('#senders-template').html());
    app.templates.messages = Handlebars.compile($('#messages-template').html());
    app.templates.message = Handlebars.compile($('#message-template').html());

    $.get('/api/senders', function (data) {
        app.senders = data.senders;
        //select first element of senders list by default
        app.selectedSender = app.senders[0];
        $('.sender-list').html(
            app.templates.senders({ senders: app.senders }))

        getMessagesForSender(app.selectedSender);
    });

    // EVENT HANDLERS
    //
    $('.sender-list').delegate('.sender-link', 'click', function (e) {
        app.selectedSender = app.senders[$(e.target).parents('li').index()];
        getMessagesForSender(app.selectedSender);
        e.preventDefault();
    });

    $('.mail-list').delegate('.back', 'click', function (e) {
        getMessagesForSender(app.selectedSender);
        e.preventDefault();
    });

    $('.mail-list').delegate('.mail-subject', 'click', function (e) {
        var href = $(e.target).attr('href');
        getMessage(href);
        e.preventDefault();
    });

});

function getMessage (href) {
    //$.get(url, function (data) {
        //$('.mail-list').html(
            //app.templates.message({ body: data.body }));
    //});
    $('.mail-list').html($('<iframe>').attr('src', href).addClass('mail-frame'));
}

function getMessagesForSender (sender) {
    $.get('/api/senders/'
        + sender.address + '/'
        + sender.name + '/mail',
        function (data) {
            app.messages = data.messages;
            $('.mail-list').html(
                app.templates.messages({ messages: data.messages }))
        });
}
