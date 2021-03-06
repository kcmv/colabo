var variables = {
    ANGULAR_PACKAGES_FOLDER: '../../../',
    ANGULAR_BUILD_PACKAGES_FOLDER: '../../../'
};

var puzzles = {
    name: "topiChat-chat",
    description: "Colabo.space ecosystem - topiChat demo app for chatting test",
    dependencies: {
        "@colabo-puzzles/f-core": {},
        "@colabo-knalledge/f-core": {},
        "@colabo-rima/f-aaa": {},
        "@colabo-topichat/f-core": {},
        "@colabo-topichat/f-talk": {},
        "@colabo-knalledge/f-store_core": {},
        "@colabo-utils/i-pub-sub": {},
    },
    offers: {}
};

var symlinks = [
    {
        from: variables.ANGULAR_PACKAGES_FOLDER+"node_modules/rxjs",
        to: "node_modules/rxjs"
    },
    {
        from: variables.ANGULAR_PACKAGES_FOLDER+"node_modules/\@angular",
        to: "node_modules/\@angular"
    },
    {
        from: variables.ANGULAR_BUILD_PACKAGES_FOLDER+"node_modules/\@angular-devkit",
        to: "node_modules/\@angular-devkit"
    }
];

exports.variables = variables;
exports.puzzles = puzzles;
exports.symlinks = symlinks;