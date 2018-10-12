var variables = {
    ANGULAR_PACKAGES_FOLDER: './',
    ANGULAR_BUILD_PACKAGES_FOLDER: './'
};

var puzzles = {
    name: "f-colabo.space",
    description: "Colabo.space ecosystem - frontend",
    dependencies: {
    },
    offers: {
        "@colabo-puzzles/f-core": {
            npm: "@colabo-puzzles/f-core",
            path: "dev_puzzles/puzzles/core"
        },
        "@colabo-knalledge/f-core": {
            npm: "@colabo-knalledge/f-core",
            path: "dev_puzzles/knalledge/knalledge_core"
        },
        "@colabo-knalledge/f-store_core": {
            npm: "@colabo-knalledge/f-store_core",
            path: "dev_puzzles/knalledge/knalledge_store_core"
        },
        "@colabo-knalledge/f-search": {
            npm: "@colabo-knalledge/f-search",
            path: "dev_puzzles/knalledge/knalledge_search"
        },
        "@colabo-knalledge/f-view_enginee": {
            npm: "@colabo-knalledge/f-view_enginee",
            path: "dev_puzzles/knalledge/knalledge_view_enginee"
        },
        "@colabo-knalledge/f-view_interaction": {
            npm: "@colabo-knalledge/f-view_interaction",
            path: "dev_puzzles/knalledge/knalledge_view_interaction"
        },
        "@colabo-rima/f-core": {
            npm: "@colabo-rima/f-core",
            path: "dev_puzzles/rima/core"
        },
        "@colabo-rima/f-aaa": {
            npm: "@colabo-rima/f-aaa",
            path: "dev_puzzles/rima/aaa"
        },
        "@colabo-topichat/f-core": {
            npm: "@colabo-topichat/f-core",
            path: "dev_puzzles/topichat/core"
        },
        "@colabo-topichat/f-talk": {
            npm: "@colabo-topichat/f-talk",
            path: "dev_puzzles/topichat/talk"
        },
        "@colabo-utils/i-pub-sub": {
            npm: "@colabo-utils/i-pub-sub",
            path: "dev_puzzles/utils/pub-sub"
        },
        "@colabo-moderation/f-core": {
            npm: "@colabo-moderation/f-core",
            path: "dev_puzzles/moderation/core"
        },
        "@colabo-flow/f-core": {
            npm: "@colabo-flow/f-core",
            path: "dev_puzzles/flow/core"
        },
        "@colabo-flow/f-topichat": {
            npm: "@colabo-flow/f-topichat",
            path: "dev_puzzles/flow/topichat"
        },
        "@colabo-topichat/f-system": {
            npm: "@colabo-topichat/f-system",
            path: "dev_puzzles/topichat/system"
        },
        "@colabo-ai-ml/f-similarity": {
            npm: "@colabo-ai-ml/f-similarity",
            path: "dev_puzzles/ai-ml/similarity"
        }
    }
}

var symlinks = [
];

exports.variables = variables;
exports.puzzles = puzzles;
exports.symlinks = symlinks;
