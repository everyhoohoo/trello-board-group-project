function (user, context, callback) {
    user.app_metadata = user.app_metadata || {};

    if ('stripe_customer_id' in user.app_metadata) {
        context.idToken['https://example.com/stripe_customer_id'] = user.app_metadata.stripe_customer_id;
        return callback(null, user, context);
    }

    var stripe = require('stripe')('sk_....');
    var customer = {
        email: user.email
    };

    stripe.customers.create(customer, function(err, customer) {
        if (err) {
            return callback(err);
        }

        user.app_metadata.stripe_customer_id = customer.id;

        auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
            .then(function() {
                context.idToken['https://example.com/stripe_customer_id'] = user.app_metadata.stripe_customer_id;
                callback(null, user, context);
            })
            .catch(function(err) {
                callback(err);
            });
    });
}