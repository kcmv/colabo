var puzzles = {
    name: "b-colabo.space",
    description: "Colabo.space ecosystem - backend",
    sudo: {
        "offer": false,
        "install": false,
        "build": false,
        "symlinks": false
    },
    dependencies: {
        "@colabo-knalledge/b-knalledge-storage-mongo": {},
        "@colabo-knalledge/b-knalledge-core": {},
        "@colabo-knalledge/b-knalledge-search": {},
        "@colabo-media/media-upload": {},
        "@colabo-rima/b-aaa": {},
        "@colabo-topichat/b-core": {},
        "@colabo-topichat/b-knalledge": {},
        "@colabo-topichat/b-talk": {},
        "@colabo-utils/i-config": {},
        "@colabo-flow/b-services": {},
        "@colabo-flow/b-topichat": {}
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
        "@colabo-rima/b-aaa": {
            npm: "@colabo-rima/b-aaa",
            path: "dev_puzzles/rima/aaa"
        },
        "@colabo-topichat/b-core": {
            npm: "@colabo-topichat/b-core",
            path: "dev_puzzles/topichat/core"
        },
        "@colabo-topichat/b-knalledge": {
            npm: "@colabo-topichat/b-knalledge",
            path: "dev_puzzles/topichat/knalledge"
        },
        "@colabo-topichat/b-talk": {
            npm: "@colabo-topichat/b-talk",
            path: "dev_puzzles/topichat/talk"
        },
        "@colabo-flow/b-services": {
            npm: "@colabo-flow/b-services",
            path: "dev_puzzles/flow/services"
        },
        "@colabo-flow/b-topichat": {
            npm: "@colabo-flow/b-topichat",
            path: "dev_puzzles/flow/topichat"
        }
    }
}

exports.puzzles = puzzles;