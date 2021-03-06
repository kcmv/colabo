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
        "@colabo-knalledge/b-storage-mongo": {},
        "@colabo-knalledge/b-core": {},
        "@colabo-knalledge/b-search": {},
        "@colabo-media/b-upload": {},
        "@colabo-rima/b-aaa": {},
        "@colabo-topichat/b-core": {},
        "@colabo-topichat/b-knalledge": {},
        "@colabo-topichat/b-talk": {},
        "@colabo-utils/i-config": {},
        "@colabo-flow/b-services": {},
        "@colabo-flow/b-topichat": {}
    },
    offers: {
        "@colabo-knalledge/b-storage-mongo": {
            npm: "@colabo-knalledge/b-storage-mongo",
            path: "dev_puzzles/knalledge/storage-mongo"
        },
        "@colabo-knalledge/b-core": {
            npm: "@colabo-knalledge/b-core",
            path: "dev_puzzles/knalledge/core"
        },
        "@colabo-knalledge/b-search": {
            npm: "@colabo-knalledge/b-search",
            path: "dev_puzzles/knalledge/search"
        },
        "@colabo-media/b-upload": {
            npm: "@colabo-media/b-upload",
            path: "dev_puzzles/media/upload"
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