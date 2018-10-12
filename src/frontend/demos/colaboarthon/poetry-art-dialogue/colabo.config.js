var variables = {
    ANGULAR_PACKAGES_FOLDER: './',
    ANGULAR_BUILD_PACKAGES_FOLDER: './'
};

var puzzles = {
    name: "poetry-art-dialogue",
    description: "Poetry on the Road @ the International Poetry Festival Milan",
    dependencies: {
        "@colabo-puzzles/puzzles_core": {},
        "@colabo-knalledge/knalledge_core": {},
        "@colabo-knalledge/knalledge_store_core": {},


        "@colabo-colaboware/colaboware_core": {},
        "@colabo-colaboware/colaboware_rfid": {},

        "@colabo-utils/config": {},
        "@colabo-utils/pub-sub": {},

        "@colabo-knalledge/knalledge_view_node": {},
        // "@colabo-rima/rima_core": {},
        // "@colabo-rima/rima_aaa": {},

        // "@colabo-topiChat/core": {},
        // "@colabo-topiChat/talk": {},

    },
    offers: {}
};

var symlinks = [];

exports.variables = variables;
exports.puzzles = puzzles;
exports.symlinks = symlinks;
