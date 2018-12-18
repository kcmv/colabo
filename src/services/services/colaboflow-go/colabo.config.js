var puzzles = {
    name: "@colabo-flow/service-go",
    description: "A ColaboFlow (CF) Go service coordinating (through gRPC) CF Go aware clients",
    dependencies: {
        "@colabo-flow/i-audit": {},
        "@colabo-flow/b-audit": {},
        "@colabo-flow/s-audit": {},

        "@colabo-flow/i-go": {},
        "@colabo-flow/b-go": {},
        "@colabo-flow/s-go": {},

        "@colabo-utils/i-config": {}
    },
    offers: {}
}

exports.puzzles = puzzles;