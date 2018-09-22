var puzzles = {
    name: "b-colabo.space",
    description: "Colabo.space ecosystem - backend",
    dependencies: {
        "@colabo-knalledge/b-knalledge-storage-mongo": {},
        "@colabo-knalledge/b-knalledge-core": {},
        "@colabo-knalledge/b-knalledge-search": {},
        "@colabo-media/media-upload": {},
        "@colabo-rima/rima-connect": {},
        "@colabo-topiChat/b-core": {},
        "@colabo-topiChat/b-knalledge": {},
        "@colabo-topiChat/b-talk": {},
        "@colabo-utils/b-config": {},
        "@colabo-flow/b-services": {}
    },
    offers: {
        "@colabo-knalledge/b-knalledge-storage-mongo": {
            npm: "@colabo-knalledge/b-knalledge-storage-mongo",
            path: "dev_puzzles/knalledge/knalledge-storage-mongo"
        },
        "@colabo-knalledge/b-knalledge-core": {
            npm: "@colabo-knalledge/b-knalledge-core",
            path: "dev_puzzles/knalledge/knalledge-core"
        },
        "@colabo-knalledge/b-knalledge-search": {
            npm: "@colabo-knalledge/b-knalledge-search",
            path: "dev_puzzles/knalledge/knalledge-search"
        },
        "@colabo-media/media-upload": {
            npm: "@colabo-media/media-upload",
            path: "dev_puzzles/media/media-upload"
        },
        "@colabo-rima/rima-connect": {
            npm: "@colabo-rima/rima-connect",
            path: "dev_puzzles/rima/rima-connect"
        },
        "@colabo-topiChat/b-core": {
            npm: "@colabo-topiChat/b-core",
            path: "dev_puzzles/topiChat/core"
        },
        "@colabo-topiChat/b-knalledge": {
            npm: "@colabo-topiChat/b-knalledge",
            path: "dev_puzzles/topiChat/knalledge"
        },
        "@colabo-topiChat/b-talk": {
            npm: "@colabo-topiChat/b-talk",
            path: "dev_puzzles/topiChat/talk"
        },
        "@colabo-utils/b-config": {
            npm: "@colabo-utils/b-config",
            path: "dev_puzzles/utils/config"
        },
        "@colabo-flow/b-services": {
            npm: "@colabo-flow/b-services",
            path: "dev_puzzles/flow/services"
        }
    }
}

exports.puzzles = puzzles;