var puzzles = {
    name: "colabo.space",
    description: "Colabo.space ecosystem - backend",
    sudo: {
        "offer": false,
        "install": false,
        "build": false,
        "symlinks": false
    },
    dependencies: {
        "@colabo-utils/config": {}
    },
    offers: {
        "@colabo-utils/config": {
            npm: "@colabo-utils/config",
            path: "dev_puzzles/utils/config"
        }
    }
}

exports.puzzles = puzzles;