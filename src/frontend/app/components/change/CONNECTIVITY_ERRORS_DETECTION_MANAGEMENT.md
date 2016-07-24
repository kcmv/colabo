CONNECTIVITY ERRORS DETECTION MANAGEMENT
##$Resource
+ http://stackoverflow.com/questions/20584367/how-to-handle-resource-service-errors-in-angularjs
`Resource.query({
    'query': 'thequery'
}).$promise.then(function(data) {
    // success handler
}, function(error) {
    // error handler
});`
+ http://stackoverflow.com/questions/15531117/resource-callback-error-and-success
+ http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/

#
+ https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html
 + **retrying-sequences**:  https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html#retrying-sequences


# Offline / Online

show status of connection online/offline

- <https://developer.mozilla.org/en-US/docs/Online_and_offline_events>
- <https://pterkildsen.com/2012/12/12/angularjs-tips-and-tricks-broadcast-online-and-offline-status/>
- <http://stackoverflow.com/questions/24121369/how-to-check-user-has-internet-connection-using-angularjs>
- <http://stackoverflow.com/questions/23851424/how-to-detect-when-online-offline-status-changes>
- <http://jsfiddle.net/rommsen/QY8w2/>
+ https://www.thepolyglotdeveloper.com/2014/06/check-network-connection-with-ionicframework/
