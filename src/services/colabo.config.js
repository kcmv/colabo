var puzzles = {
    name: "s-colabo.space",
    description: "Colabo.space ecosystem - services",
    sudo: {
        "offer": false,
        "install": false,
        "build": false,
        "symlinks": false
    },
    dependencies: {
        "@colabo-flow/i-audit": {},
        "@colabo-flow/s-audit": {},
        "@colabo-utils/i-config": {}
    },
    offers: {
        "@colabo-flow/s-audit": {
            npm: "@colabo-flow/s-audit",
            path: "puzzles/flow/audit/node"
        }
    }
}

exports.puzzles = puzzles;