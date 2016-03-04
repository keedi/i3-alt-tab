# i3-alt-tab window switcher

Cycle through all open windows in [i3](https://i3wm.org/) using [node.js](https://nodejs.org/).

## Installation
    $ sudo npm i -g i3-alt-tab

## Usage
    $ i3-alt-tab --next  # Focus next window
    $ i3-alt-tab --prev  # Focus previous window

## Example i3 configuration
    bindsym $alt+Tab exec i3-alt-tab --next
    bindsym $alt+Shift+Tab exec i3-alt-tab --prev

## Exit codes
    0  Window switched successfully
    1  Wrong usage/show help
    2  No window found
    3  i3 connection error
