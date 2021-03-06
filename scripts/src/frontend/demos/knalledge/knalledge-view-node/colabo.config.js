var variables = {
    ANGULAR_PACKAGES_FOLDER: '../../../',
    ANGULAR_BUILD_PACKAGES_FOLDER: '../../../'
};

var puzzles = {
    name: "knalledge-view-node",
    description: "Colabo.space ecosystem - KnAllEdge maps and nodes exploration",
    dependencies: {
        "@colabo-puzzles/f-core": {},
        "@colabo-knalledge/f-core": {},
        "@colabo-knalledge/f-store_core": {},
        "@colabo-knalledge/f-search": {},
        "@colabo-knalledge/f-view_node": {},
        "@colabo-rima/f-aaa": {}
    },
    offers: {}
};

// note: destination folder (like `node_modules`) needs to exist
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