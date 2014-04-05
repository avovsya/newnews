/*global define*/

define([
    'jquery',
    'backbone',

    'views/header',
    'views/login',
    'views/senders'
], function (
    $,
    Backbone,

    HeaderView,
    LoginView,
    SenderListView
    ) {
    'use strict';

    var Router = Backbone.Router.extend({
        routes: {
            '': 'main',
            'login': 'login',
            'logout': 'logout',
            '*actions': 'defaultAction',
        }
    });

    var initialize = function () {
        var appRouter = new Router();

        appRouter.on('route:main', function () {
            new HeaderView({ el: '.header' });

            var sendersView = new SenderListView();
            //$('body').append(sendersView.render().el);
        });

        appRouter.on('route:login', function () {
            new LoginView();
        });

        appRouter.on('route:logout', function () {
            $.ajax('/api/auth/session', {
                type: 'DELETE',
                success: function () {
                    appRouter.navigate('/', { trigger: true });
                }
            })
        })

        appRouter.on('route:defaultAction', function (actions) {
            console.log('Unknown route');
            appRouter.navigate('/', { trigger: true })
        })

        Backbone.history.start();

        return appRouter;
    }

    return {
        initialize: initialize
    };
});
