/**
* the namespace for the notify part of the KnAllEdge system
* @namespace cf.puzzles.presentation
*/

function startPresentation(){
  console.log("hiding id='container'");
  $('#container').css('display','none');
  $('#presentation').css('display','block');
  console.log("Reveal-ing");

  Reveal.initialize({
    // Display controls in the bottom right corner
    controls: true,

    // Display a presentation progress bar
    progress: true,

    // Display the page number of the current slide
    slideNumber: 'c/t',

    // Enable keyboard shortcuts for navigation
    keyboard: true,

    // Enable the slide overview mode
    overview: true,

    // Vertical centering of slides
    center: true,

    // Enables touch navigation on devices with touch input
    touch: true,

    // Loop the presentation
    loop: false,

    // Change the presentation direction to be RTL
    rtl: false,

    // Randomizes the order of slides each time the presentation loads
    shuffle: false,

    // Turns fragments on and off globally
    fragments: true,

    // Flags if the presentation is running in an embedded mode,
    // i.e. contained within a limited portion of the screen
    embedded: true,

    // Flags if we should show a help overlay when the questionmark
    // key is pressed
    help: true,

    history: false,

    // Flags if speaker notes should be visible to all viewers
    showNotes: false,

    // Number of milliseconds between automatically proceeding to the
    // next slide, disabled when set to 0, this value can be overwritten
    // by using a data-autoslide attribute on your slides
    autoSlide: 0,

    // Stop auto-sliding after user input
    autoSlideStoppable: true,

    // Use this method for navigation when auto-sliding
    autoSlideMethod: Reveal.navigateNext,

    // Enable slide navigation via mouse wheel
    mouseWheel: true,

    // Hides the address bar on mobile devices
    hideAddressBar: true,

    // Opens links in an iframe preview overlay
    previewLinks: true,

    // Transition style
    transition: 'concave', // none/fade/slide/convex/concave/zoom

    // Transition speed
    transitionSpeed: 'default', // default/fast/slow

    // Transition style for full page slide backgrounds
    backgroundTransition: 'concave', // none/fade/slide/convex/concave/zoom

    // Number of slides away from the current that are visible
    viewDistance: 3,

    // Parallax background image
    parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

    // Parallax background size
    parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

    // Number of pixels to move the parallax background per slide
    // - Calculated automatically unless specified
    // - Set to 0 to disable movement along an axis
    parallaxBackgroundHorizontal: null,
    parallaxBackgroundVertical: null,

    // More info https://github.com/hakimel/reveal.js#dependencies
    dependencies: [
      { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/markdown/marked.js' },
      { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/markdown/markdown.js' },
      { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/notes/notes.js', async: true },
      { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
    ]
  });

  Reveal.configure({
    keyboard: {
      // 13: 'next', // go to the next slide when the ENTER key is pressed
      27: function() {
        $('#container').css('display','block');
        $('#presentation').css('display','none');
      }, // do something custom when ESC is pressed
      // 32: null // don't do anything when SPACE is pressed (i.e. disable a reveal.js default binding)
    }
  });
}

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var presentationServices = angular.module('presentationServices', []);

/**
* the namespace for core services for the Gardening system
* @namespace cf.puzzles.presentation.presentationServices
*/

/**
* Service that is a plugin into cf.puzzles.MapVisualization
* @class ApprovalNodeService
* @memberof cf.puzzles.presentation.presentationServices
*/

}()); // end of 'use strict';
