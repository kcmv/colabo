var variables = {
    ANGULAR_PACKAGES_FOLDER: '../../../',
    ANGULAR_BUILD_PACKAGES_FOLDER: '../../../'
};

var puzzles = {
    name: "colaboFlow-services",
    description: "Colabo.space ecosystem - ColaboFlow-services demo app for testing coordination with backend services",
    dependencies: {
        "@colabo-puzzles/puzzles_core": {},
        "@colabo-rima/rima_aaa": {},
        "@colabo-topiChat/core": {},
        "@colabo-utils/pub-sub": {},
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