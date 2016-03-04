#!/usr/bin/env node

const DEBUG = process.argv.indexOf("--debug") > -1;
var I = require("eyespect").inspector({maxLength: -1});
var L = console.log.bind(console);

var i3 = require("i3").createClient();
i3.tree(function(error, tree) {
    if (error) process.exit(3, console.error(error.message || error))

    var win = null;
    if (process.argv.indexOf("--next") > -1)
        win = traverse(tree, false);
    else if (process.argv.indexOf("--prev") > -1)
        win = traverse(tree, true);
    else {
        console.log("Usage: i3-alt-tab --next|--prev [--debug]");
        console.log("Exit Codes:  0  Window switched successfully");
        console.log("             1  Wrong usage/show help");
        console.log("             2  No window found");
        console.log("             3  i3 connection error");
        process.exit(1);
    }
    if (!win) process.exit(2);

    DEBUG&& L(`Focusing window: [id="${win}"] focus`);
    i3.command(`[id="${win}"] focus`, function(error, value) {
        if (error) process.exit(3, console.error(error.message || error))
        DEBUG&& I(value);
        process.exit(0);
    });
})

var i3fallback = null;
var i3window = false;

// Traverse the tree until the window which should be selected is found.
function traverse(tree, reverse, nofallback) {
    if (!Array.isArray(tree)) tree = [tree];

    DEBUG&& !nofallback && L("Traversing tree:");

    if (reverse) tree.reverse();
    for (var i = 0; i < tree.length; i++) {
        if (tree[i].name == "__i3") continue; // Scratchpad
        if (tree[i].type == "dockarea") continue; // Dock

        if (tree[i].type == "con" && tree[i].window) { // Level 3
            DEBUG&& L((tree[i].focused ? "* " : "  ") + tree[i].name)

            if (!i3fallback) {
                DEBUG&& L("  -> Setting as fallback");
                i3fallback = tree[i].window;
            }

            if (tree[i].focused) i3window = true;
            else if (i3window) {
                DEBUG&& L("Window found:");
                DEBUG&& I(tree[i]);
                return tree[i].window;
            }
        }

        if (tree[i].nodes) {
            var win = traverse(tree[i].nodes, reverse, true)
            if (typeof win == "number") return win;
        }
    }

    DEBUG&& !nofallback && L("No window found. Falling back to " + i3fallback);
    return (nofallback ? null : i3fallback);
}