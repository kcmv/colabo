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
        "@colabo-puzzles/puzzles_core": {
            npm: "@colabo-puzzles/puzzles_core",
            path: "dev_puzzles/puzzles/puzzles_core"
        },
        "@colabo-knalledge/knalledge_core": {
            npm: "@colabo-knalledge/knalledge_core",
            path: "dev_puzzles/knalledge/knalledge_core"
        },
        "@colabo-knalledge/knalledge_store_core": {
            npm: "@colabo-knalledge/knalledge_store_core",
            path: "dev_puzzles/knalledge/knalledge_store_core"
        },
        "@colabo-knalledge/knalledge_search": {
            npm: "@colabo-knalledge/knalledge_search",
            path: "dev_puzzles/knalledge/knalledge_search"
        },
        "@colabo-knalledge/knalledge_view_enginee": {
            npm: "@colabo-knalledge/knalledge_view_enginee",
            path: "dev_puzzles/knalledge/knalledge_view_enginee"
        },
        "@colabo-knalledge/knalledge_view_interaction": {
            npm: "@colabo-knalledge/knalledge_view_interaction",
            path: "dev_puzzles/knalledge/knalledge_view_interaction"
        },
        "@colabo-topiChat/core": {
            npm: "@colabo-topiChat/core",
            path: "dev_puzzles/topiChat/core"
        },
        "@colabo-topiChat/talk": {
            npm: "@colabo-topiChat/talk",
            path: "dev_puzzles/topiChat/talk"
        },
        "@colabo-utils/pub-sub": {
            npm: "@colabo-utils/pub-sub",
            path: "dev_puzzles/utils/pub-sub"
        },
        "@colabo-moderation/core": {
            npm: "@colabo-moderation/core",
            path: "dev_puzzles/moderation/core"
        },
        "@colabo-moderation/core": {
            npm: "@colabo-colaboflow/core",
            path: "dev_puzzles/colaboflow/core"
        }
    }
}

var symlinks = [
];

exports.variables = variables;
exports.puzzles = puzzles;
exports.symlinks = symlinks;
