const newman = require('newman'); // require newman in your project

// const n = { ...newman };
// newman.run = (options) => new Promise((resolve, reject) =>
//   n.run(options, err => {
//     if (err) {
//       reject(err);
//     } else {
//       resolve();
//     }
//   })
// );

// (async function() {
//   await newman.run({
//     collection: require('./AddingMatch.postman_collection.json'),
//     delayRequest: 200,
//     reporters: 'cli'
//   })
//   await newman.run({
//       collection: require('./AddingMatch.postman_collection.json'),
//       delayRequest: 200,
//       reporters: 'cli'
//   });
// })();

// call newman.run to pass options object and wait for callback
newman.run({
    collection: require('./AddingMatch.postman_collection.json'),
    delayRequest: 200,
    reporters: 'cli'
}, function (err) {
    if (err) { throw err; }
    // call newman.run to pass options object and wait for callback
    newman.run({
        collection: require('./AddingMentee.postman_collection.json'),
        delayRequest: 200,
        reporters: 'cli'
    }, function (err) {
        if (err) { throw err; }
        newman.run({
            collection: require('./AddingMenteeNotUniqueEmail.postman_collection.json'),
            delayRequest: 200,
            reporters: 'cli'
        }, function (err) {
            if (err) { throw err; }
            newman.run({
                collection: require('./AddingMentors.postman_collection.json'),
                delayRequest: 200,
                reporters: 'cli'
            }, function (err) {
                if (err) { throw err; }
                newman.run({
                    collection: require('./AddingMentorsNotUniqueEmail.postman_collection.json'),
                    delayRequest: 200,
                    reporters: 'cli'
                }, function (err) {
                    if (err) { throw err; }
                    newman.run({
                        collection: require('./CreateMessage.postman_collection.json'),
                        delayRequest: 200,
                        reporters: 'cli'
                    }, function (err) {
                        if (err) { throw err; }
                        newman.run({
                            collection: require('./CreatePassword.postman_collection.json'),
                            delayRequest: 200,
                            reporters: 'cli'
                        }, function (err) {
                            if (err) { throw err; }
                            newman.run({
                                collection: require('./CreatePasswordAndLogin.postman_collection.json'),
                                delayRequest: 200,
                                reporters: 'cli'
                            }, function (err) {
                                if (err) { throw err; }
                                newman.run({
                                    collection: require('./CreatePasswordNotUniqueEmail.postman_collection.json'),
                                    delayRequest: 200,
                                    reporters: 'cli'
                                }, function (err) {
                                    if (err) { throw err; }
                                    newman.run({
                                        collection: require('./GetUserByID.postman_collection.json'),
                                        delayRequest: 200,
                                        reporters: 'cli'
                                    }, function (err) {
                                        if (err) { throw err; }
                                        newman.run({
                                            collection: require('./MenteeWorkFlow.postman_collection.json'),
                                            delayRequest: 200,
                                            reporters: 'cli'
                                        }, function (err) {
                                            if (err) { throw err; }
                                            newman.run({
                                                collection: require('./UpdateBio.postman_collection.json'),
                                                delayRequest: 200,
                                                reporters: 'cli'
                                            }, function (err) {
                                                if (err) { throw err; }
                                                newman.run({
                                                    collection: require('./UpdateEmail.postman_collection.json'),
                                                    delayRequest: 200,
                                                    reporters: 'cli'
                                                }, function (err) {
                                                    if (err) { throw err; }
                                                    newman.run({
                                                        collection: require('./UpdateHobbies.postman_collection.json'),
                                                        delayRequest: 200,
                                                        reporters: 'cli'
                                                    }, function (err) {
                                                        if (err) { throw err; }
                                                        newman.run({
                                                            collection: require('./UpdateProfessions.postman_collection.json'),
                                                            delayRequest: 200,
                                                            reporters: 'cli'
                                                        }, function (err) {
                                                            if (err) { throw err; }
                                                            newman.run({
                                                                collection: require('./UpdateSkills.postman_collection.json'),
                                                                delayRequest: 200,
                                                                reporters: 'cli'
                                                            }, function (err) {
                                                                if (err) { throw err; }

                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

newman.run({
    collection: require('./AddingMentors.postman_collection.json'),
    reporters: 'cli'
}, function (err) {
    if (err) { throw err; }

});
console.log('collection run complete!');
