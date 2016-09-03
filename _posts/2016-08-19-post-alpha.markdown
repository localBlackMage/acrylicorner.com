---
layout: post
comments: true
title: "Post Alpha Progress"
date:   2016-08-19 09:00:00 -0500
categories: game update
---
Post Alpha Progress
--------------------------------------
So! We released our alpha build almost two months ago today! We've received some great feedback from those of you that 
played and have taken action to improve upon bugs and suggestions given to us! So first and foremost, the changes made
due to feedback:

Bug Fixes and Improvements
--------------------------------------
1. Push Blocks no longer move when you land on top of them
2. Batteries no longer charge generators repeatedly
3. Push Blocks no longer go through exits, entrances, doors, or morpher spaces
4. Controls have been tweaked to improve handling
5. Control scheme has been reworked somewhat to better fit the keyboard and game pad

Push Blocks
--------------------------------------
The Push Block element, which consists of normal blocks, batteries, and ice blocks, have been revamped. While ice blocks
technically see no change, normal and battery type blocks will no longer overlap certain map elements (exits, entrances, etc.)
and will fall once pushed off of a floor! I am personally excited to present this as it took some time to get right and
adds some interesting future puzzle elements!

![Push Blocks](../../../../../../images/2016_08_19/push_block.gif)

Map Controls
--------------------------------------
Among the more common feedback given to us regarding the game was the controls. They felt sluggish and difficult to maneuver. 
Admittedly, I was likely pretty used to them from all my testing, but after some adjustments to the tilt rate and how far
you can tilt the overall map, I feel they're much tighter than before! In the end, the game is a physics puzzler, but that's
no excuse for clunky controls!

Morphers
--------------------------------------
Wesley, now that they're married and moved out to California, has had time to really dive into work on the art assets and
in just a short time has already cranked out some great stuff! One of the first items they did was the Morphers. Before
we were using a stand in mesh with a texture that I used because I enjoy the look of hexagons far too much! Now they've been
replaced with a very slick hologram that the ball rolls through to change into the different elemental power ups! Behold!

![Morphers](../../../../../../images/2016_08_19/morphers.gif)

The Elements
--------------------------------------
So I've gone on about the different ball types before, but a few things have changed and new things have been added! First and
foremost, the ball itself!

It's an actual rolled up Robo Armadillo! Our heroine has finally taken form!

![Ball 1](../../../../../../images/2016_08_19/ball_1.png)
![Ball 2](../../../../../../images/2016_08_19/ball_2.png)

The rest of the elements have received a visual upgrade as well!

![Ice](../../../../../../images/2016_08_19/ice_morpher.gif)
![Fire](../../../../../../images/2016_08_19/fire_morpher.gif)
![Electric](../../../../../../images/2016_08_19/electric_morpher.gif)
![Armor and Normal](../../../../../../images/2016_08_19/normal_morpher.gif)

Ice Ball
--------------------------------------
Regarding one of the newer entries, we have the Ice Ball! The Freezing Carapace afforded to our armadillo friend has the
 ability to freeze the water poured forth from the brand new Water Spout tiles, creating Ice Tiles on top for the player 
 to navigate! More is planned for the Ice Ball but this makes for a pretty *chill* introduction, don't you think? I'll 
 show myself out.
 
Water Spout Tiles
--------------------------------------
A brand new tile type! 

![Water Spout](../../../../../../images/2016_08_19/water_spout.gif)

The Water Spout tile interacts with the player in different ways depending on which power up they
currently have! For instance, if the player is the Ice Ball...

![Ice Ball on Water](../../../../../../images/2016_08_19/ice_water_spouts.gif)

They'll freeze the water solid into an ice tile! 

Or perhaps the player is using the Fire Ball:

![Fire Ball on Water](../../../../../../images/2016_08_19/douse_fire_on_water.gif)

Poof! Water douses those flames lickity split! 

One has to be careful, however, when playing with electricity. Common
sense says water and our Electric Ball won't mix and, well, they sure don't!
![Electric Ball on Water](../../../../../../images/2016_08_19/kill_electric_on_water.gif)
 
Generators
--------------------------------------
The generator tile has received a visual improvement since it's introduction!

![Generator](../../../../../../images/2016_08_19/generator.png)

The glowing bit itself even indicates how much charge is left in it (as batteries are the only way to permanently charge
a generator)!

![Generator Discharge](../../../../../../images/2016_08_19/discharge_generator.gif)

And that leads us right into:

Batteries
--------------------------------------
Not only have they gotten an official look to them, a few bugs have been ironed out as well! Before there were several
instances where they'd rapidly charge a generator below when stuck up against a wall and struck by the ball in close
succession. I even believe that this happened any time the Electric Ball hit the battery as well. The batteries also
 failed to charge the generator below if they were sitting on top of it and became charged via touch of the Electric Ball.
 So I'm proud to present a fully functional battery element with all aforementioned bugs stamped out!
 
![Battery](../../../../../../images/2016_08_19/battery.png)

Last but certainly not least for this update, another brand new tile (or wall, rather) type!

Tesla Wall
--------------------------------------
While the mesh and such is currently stand in, these deadly walls will shock the player right into a game over screen if
they're not careful! 

![Tesla Kill](../../../../../../images/2016_08_19/kill_ball_on_tesla.gif)

However, they don't affect the player at all when using the Electric Ball power up!

![Tesla Ignore](../../../../../../images/2016_08_19/tesla_electric.gif)

Hopefully by next update, we'll have something prettier to look at than my shoddily textured wall mesh!



That's all for now, but there's still more to come! Several more puzzle elements are in the works now that we've gotten
through our backlog of bugs from alpha and I'm excited to show them in the next progress update! However, before that, 
we'll be putting out another release (or at least I'd like to!) to get feedback on the changes made as well as the new 
elements we've added! 

Until then, see you around!

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