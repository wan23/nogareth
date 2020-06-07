//this is needed to load the compiled
//typescript files in the browser
//using AMD Module Loading
requirejs.config({
    //prevent caching
    urlArgs: function (id, url) {
        var rando = Math.floor(Math.random() * Math.floor(100000));
        var args = '';
        args = '?v=' + rando;
        return args;
    }
});
require(["index"]);
//# sourceMappingURL=config.js.map