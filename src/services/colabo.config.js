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
        "@colabo-flow/i-go": {},
        "@colabo-flow/s-go": {},
        "@colabo-utils/i-config": {}
    },
    offers: {
        "@colabo-flow/s-audit": {
            npm: "@colabo-flow/s-audit",
            path: "puzzles/flow/audit/node"
        },
        "@colabo-flow/s-go": {
            npm: "@colabo-flow/s-go",
            path: "puzzles/flow/go/node"
        }
    }
}

exports.puzzles = puzzles;