var puzzles = {
    name: "i-colabo.space",
    description: "Colabo.space ecosystem - isomorphic",
    sudo: {
        "offer": false,
        "install": false,
        "build": false,
        "symlinks": false
    },
    dependencies: {
        "@colabo-utils/i-config": {},
        "@colabo-utils/i-pub-sub": {}
    },
    offers: {
        "@colabo-flow/i-audit": {
            npm: "@colabo-flow/i-audit",
            path: "dev_puzzles/flow/audit"
        },
        "@colabo-flow/i-go": {
            npm: "@colabo-flow/i-go",
            path: "dev_puzzles/flow/go"
        },
        "@colabo-topichat/i-core": {
            npm: "@colabo-topichat/i-core",
            path: "puzzles/topichat/core"
        },
        "@colabo-utils/i-config": {
            npm: "@colabo-utils/i-config",
            path: "dev_puzzles/utils/config"
        },
        "@colabo-utils/i-pub-sub": {
            npm: "@colabo-utils/i-pub-sub",
            path: "dev_puzzles/utils/pub-sub"
        }
    }
}

exports.puzzles = puzzles;