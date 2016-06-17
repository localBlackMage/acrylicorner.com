---
layout: post
comments: true
title: "Maltifique's Challenge"
date:   2016-06-17 09:00:00 -0500
categories: personal update
---
Introducing: *Maltifique's Challenge!*
--------------------------------------
Tilt-A-Ball Z no more, the official name of our game is *Maltifique's Challenge!* 


**You can download it** [**here**](http://acrylicorner.com/TiltABall.zip)!
---------------------------------------------------------------------------

While art is still being worked on (Wesley's getting married tomorrow, so he's a tad preoccupied!), a lot of basic game 
features are ready for demo and we're proudly presenting it to you today! We welcome and encourage feedback as we 
aim to create as fun as an experience as we can! 

As a slight refresher for the features that will be in the demo:

Game Features
-------------
1. Press Once Button Tile
2. Door Tile
3. Ice Tile
4. Conveyor Tile
5. Sticky Tile
6. Ball Morpher Tile
7. Fire Ball Type
8. Pushable Blocks

New today!

1. Generator Tile
2. Electric Ball Type
3. Tilt-able Camera Controls (Controls have been tweaked since you last saw them!)
4. Pushable Battery Blocks
5. Non-Pushable Ice Blocks
6. Ramps (A simple addition that I feel will in the future make for some interesting puzzle designs!)

So now on to the actual dev stuff for now! We'll start with the items I didn't cover last week. 
First and foremost...

Generators
----------
As the name implies, these tiles are small machine tiles that will power other types of tiles, such as doors or conveyors.
When the ball is electrified and rolls over an powerless generator, the generator will become powered up for a short time
before discharging!

![Generator Off](../../../../../../images/2016_06_17/generatorOff.png)

![Generator On](../../../../../../images/2016_06_17/generatorOn.png)


Here you can see the generator doesn't stay powered on for long!

![Generator Roll](../../../../../../images/2016_06_17/generator.gif)

I have a few things I plan to change already for the level that introduces the generators, but for the most part I feel
it should to an ample job at showing the player what they do and the different ways they can use them. Generators do, 
however, bring us to the next two elements!

Ball Morphing - Electric
------------------------
You likely noticed in the above images and gifs that the ball is glowing yellow! This is one of the four elements planned
for the ball in the end and plays an important role in the powering of devices and batteries as well as a few surprises!

![Electric Morpher](../../../../../../images/2016_06_17/elecMorpher.gif)


Pushable Block - Batteries
--------------------------
The last "electric" element currently in game is the battery block. Batteries can start off in a charged or uncharged state.
While uncharged, they can become charged via the player's Electric Ball where they will become permanently charged. These
batteries, aside from acting as normal pushable blocks, can be used to power generators as long as they sit on top!

![Battery](../../../../../../images/2016_06_17/batteryBlock.gif)

(Okay, so I may have gone a little overboard using U4's starter content glowing hex mesh on things!)

Camera Controls
---------------
So after some discussion and brainstorming, we've implemented what is hopefully far more useful camera controls. Using the
right stick to push the camera up or down, the player can now also utilize the Q or E keys or the game pad's triggers and
bumpers to rotate the camera around the ball 90 degrees at a time. The map tilt also corresponds to the current angle 
of the camera, which does admittedly feel a lot better than rotating the view but not the controls.

![Camera](../../../../../../images/2016_06_17/cameraRotations.gif)

Non-Pushable Block - Ice
------------------------
A little different from the pushable variety, these types of blocks essentially act as walls. When the ball is powered 
up with fire and comes too close to the ice, it will melt just like our tiles do! While this may sound simple (and
admittedly it is for now), there are new features awaiting development that will make use of these, so look forward to them!

![Ice Walls](../../../../../../images/2016_06_17/iceWalls.png)

![Ice Walls Melting](../../../../../../images/2016_06_17/iceWallsMelting.gif)

And Now...
----------
A little sneak peak at the list of features we have planned for the future:

1. Water Spouts - water gushing upwards from a hydrant in the floor
2. Ice Ball - A new type of ball! When coming into contact with Water Spouts, the water will freeze, creating either
 new paths or obstacles that the player must avoid!
3. Fire/Electric Ball Water Spout Interactions - Rolling through a Water Spout as a Fire ball will reduce the ball to Normal mode while
rolling over it as an Electric ball will short the ball out and kill the player! Oh no!
4. Electric Ball Conveyor Interactions - Rolling over a Conveyor belt as the Electric ball will speed the conveyor belt up!
5. Armor/Metal Ball - Another new type of ball! This ball will feature some heavy armor and the ability to boost short 
distances in order to...
6. Smashable Walls - Smash walls! Certain walls will be *just* cracked enough for the player to bust through them with 
enough weight and speed opening up new paths and secret areas!
7. Fire Pipes - fire bursting up through a pipe creates a deadly obstacle for the player! Unless, however, they have the
Fire ball power up!
8. Enemies! - As I've mentioned before, we have three types of enemies planned for the game. Each is a little different
from the next and will require the player to outsmart them in order to proceed!
9. More art! - With Wesley's wedding out of the way and some time clearing up, expect to see lots more pretty art within 
the game itself!

That's all for now, but stay tuned for more updates as the game progresses!

See you around!

-Holden

{% if page.comments %}
<div id="disqus_thread"></div>
<script>
/**
* RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
* LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL; // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');

s.src = '//acrylicorner.disqus.com/embed.js';

s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
{% endif %}