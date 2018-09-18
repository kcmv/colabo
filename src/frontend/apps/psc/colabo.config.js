var variables = {
    ANGULAR_PACKAGES_FOLDER: '../../',
    ANGULAR_BUILD_PACKAGES_FOLDER: '../../'
};

var puzzles = {
    name: "performing_sustainable_coevolution",
    description: "Performing Sustainable CoEvolution (PSC). Developed upon CoLaboArthon, DialoGame, and CoEvoLudens formats)",
    dependencies: {
        "@colabo-puzzles/puzzles_core": {},
        "@colabo-knalledge/knalledge_core": {},
        "@colabo-knalledge/knalledge_store_core": {},
        "@colabo-rima/rima_aaa": {},
        "@colabo-moderation/core": {}
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
