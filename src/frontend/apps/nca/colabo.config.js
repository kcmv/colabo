var variables = {
    ANGULAR_PACKAGES_FOLDER: '../../',
    ANGULAR_BUILD_PACKAGES_FOLDER: '../../'
};

var puzzles = {
    name: "collective_sustainable_activism",
    description: "Colabo.space ecosystem - collective sustainable activism",
    dependencies: {
        "@colabo-puzzles/f-core": {},
        "@colabo-knalledge/f-core": {},
        "@colabo-knalledge/f-store_core": {},
        "@colabo-rima/f-aaa": {},
        "@colabo-utils/i-config": {}
    },
    offers: {}
};

var symlinks = [{
        from: variables.ANGULAR_PACKAGES_FOLDER + "node_modules/rxjs",
        to: "node_modules/rxjs"
    },
    {
        from: variables.ANGULAR_PACKAGES_FOLDER + "node_modules/\@angular",
        to: "node_modules/\@angular"
    },
    {
        from: variables.ANGULAR_BUILD_PACKAGES_FOLDER + "node_modules/\@angular-devkit",
        to: "node_modules/\@angular-devkit"
    }
];

exports.variables = variables;
exports.puzzles = puzzles;
exports.symlinks = symlinks;