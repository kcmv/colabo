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
        "@colabo-utils/i-config": {}
    },
    offers: {
        "@colabo-utils/i-config": {
            npm: "@colabo-utils/i-config",
            path: "dev_puzzles/utils/config"
        }
    }
}

exports.puzzles = puzzles;