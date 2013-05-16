navi
====

Hapi plugin for AR Drone Control over HTTP. 

## Setup

This is a sticky subject - depending on what you have controlling your Drone, you may need to get funky and creative with your setup. 

For our development and examples we were running off of a Macbook Air or Pro. The wireless adapter was connected to the drone, and the ethernet adapter was attached to an access point on the network where the site was to be made accessible. 

## Usage

### Plugin and hapi usage

We're using a [hapi](http://spumko.github.io/) plugin to handle this, so familiarity with how [hapi plugins](http://spumko.github.io/resource/api/#plugin_interface) work.

### Control of coptor

rotation:
: q - rotate left
: e - rotate right

movement:
: w - forward
: a - strafe left
: s - backward
: d - strafe right

elevation:
: up arrow - raise altitude
: down arrow - lower altitude

special:
: space - STAHP
: blah takeoff
: blah landing
