var variables = {
    ANGULAR_PACKAGES_FOLDER: './',
    ANGULAR_BUILD_PACKAGES_FOLDER: './'
};

var puzzles = {
    name: "poetry-art-dialogue",
    description: "Poetry on the Road @ the International Poetry Festival Milan",
    dependencies: {
        "@colabo-puzzles/f-core": {},
        "@colabo-knalledge/f-core": {},
        "@colabo-knalledge/f-store_core": {},


        "@colabo-ware/core": {},
        "@colabo-ware/rfid": {},

        "@colabo-utils/config": {},
        "@colabo-utils/i-pub-sub": {},

        "@colabo-knalledge/f-view_node": {},
        // "@colabo-rima/rima_core": {},
        // "@colabo-rima/rima_aaa": {},

        // "@colabo-topichat/f-core": {},
        // "@colabo-topichat/f-talk": {},

    },
    offers: {}
};

var symlinks = [];

exports.variables = variables;
exports.puzzles = puzzles;
exports.symlinks = symlinks;
