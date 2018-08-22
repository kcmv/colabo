var puzzles = {
    name: "b-colabo.space",
    description: "Colabo.space ecosystem - backend",
    dependencies: {
        "@colabo-knalledge/b-knalledge-storage-mongo": {},
        "@colabo-knalledge/b-knalledge-core": {},
        "@colabo-knalledge/b-knalledge-search": {},
        "@colabo-media/media-upload": {},
        "@colabo-rima/rima-connect": {},
        "@colabo-topiChat/b-topiChat-core": {},
        "@colabo-topiChat/b-topiChat-knalledge": {}
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
        "@colabo-topiChat/b-topiChat-core": {
            npm: "@colabo-topiChat/b-topiChat-core",
            path: "dev_puzzles/topiChat/topiChat-core"
        },
        "@colabo-topiChat/b-topiChat-knalledge": {
            npm: "@colabo-topiChat/b-topiChat-knalledge",
            path: "dev_puzzles/topiChat/topiChat-knalledge"
        }
    }
}

exports.puzzles = puzzles;