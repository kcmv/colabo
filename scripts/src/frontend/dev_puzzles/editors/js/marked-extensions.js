// setting up marked
marked.setOptions({
    gfm: true // this should be true by default
});

// https://www.npmjs.com/package/marked#renderer
// https://github.com/chjj/marked/blob/master/lib/marked.js#L869
var renderer = new marked.Renderer();

var originalLink = renderer.link.bind(renderer);
// open a link in a new tab
renderer.link = function link(href, title, text) {
    var linkStr = originalLink(href, title, text);
    linkStr = linkStr.replace("<a", '<a target="_blank"');
    return linkStr;
}

marked.nodeEditor = {
    renderer: renderer
};