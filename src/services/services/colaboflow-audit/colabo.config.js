var puzzles = {
    name: "@colabo-flow/service-audit",
    description: "A ColaboFlow (CF) Audit service accepting (through gRPC) CF audits and storing them in MongoDB",
    dependencies: {
        "@colabo-flow/i-audit": {},
        "@colabo-flow/b-audit": {},
        "@colabo-flow/s-audit": {},
        "@colabo-utils/i-config": {}
    },
    offers: {}
}

exports.puzzles = puzzles;