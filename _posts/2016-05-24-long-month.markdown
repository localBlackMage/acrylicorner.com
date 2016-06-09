---
layout: post
comments: true
title: "Long Month"
date:   2016-05-24 11:00:00 -0500
categories: personal update
---
May has proven to be quite something. Attended [Stir Trek](http://stirtrek.com/) early on in the month and saw 
Captain America: Civil War, so that was a fun way to start! I started really cracking at the game, still tentatively named
"Tiltaball Z", until we hit a pretty major snag. Started wedding arrangements as well! Then had a car accident. Needless
to say, it's been a lot of ups and downs this month.

Stir Trek
---------
In years past when I attended Stir Trek or Codemash it was more exciting. Lately my passion for web development has really
taken a back seat to the burning desire to work on games and these events end up being a lot less amazing than they used
to be. If anything, it's really just spelled out for me what my goal is! 

So, the Game!
-------------
We've been making some good progress this month despite some set backs early on. Likely due to my lack of experience with
Unreal 4, the use of C++ has been abandoned in favor of a Blue Print approach. I'm not exactly happy about the shift,
but I can't argue with the results. The initial trouble came from what I feel to be Unreal 4's lack of good support for 
C++ projects, not to mention the sheer amount of documentation and examples given in Blue Prints! Of course, hardly
a day after we switch over to an all Blue Print approach, I got some good advice on how to better run a C++ driven project.
At least I'll know for next time!

That said, things have been progressing pretty smoothly since the transition! All of our previous work has been reimplemented
in good time and we've started working on new features. One of the things we (I) struggled with was getting Unreal to 
activate a camera that belonged to a non-controller-possessed pawn. To me, it should be a relatively easy thing to have
even if not necessarily always used. 

The solution ended up coming from Wesley himself, giving me the idea to have our separate pawn simply be a component
on the possessed pawn itself and enabling physics on the object so that it would remain free moving of it's parent. A couple
hours later and we had a working camera attached to the ball!

The next big task was getting some menus put together. While the main menu is hardly a problem and Wesley took care of
most of it, wiring up the [Classic Settings Menu](https://www.unrealengine.com/marketplace/quality-game-settings) as a
sub menu of our Main Menu proved to be harder than I thought as Unreal's event dispatcher system still eludes me. So with
a bit of a work around, I got it functioning. It's not the best solution in the world, but far from the worst, I feel. 
Given more time, I plan to go back in and figure out what I was doing wrong and hook things up properly.

I've started working on different tile elements over the last few days, getting prototypes put together so we can have
something playable by June 17th! We've got a short list of elements we want implemented by then so I've got my work cut out for me!
Last night came button tiles and door tiles and the linking of the two. Next up will be conveyor belt tiles which, at a glance,
seem to be more difficult than I first thought. And of course, we'll need the level to actually be able to be started
and completed, so the implementation of our spawn and exit tiles will follow shortly after. 

Stepping on Toes and Learning
-----------------------------
Over the course of the development work so far I've come across a couple instances where Wesley or I simply step on each
other's toes, albeit unintentionally. 99% of it can be chalked up to communication break downs. It's taught me that I need
to be more willing to ask about things I don't understand, even if they don't immediately strike me as incorrect. 

For example: our game is modular, built out of tiles so that puzzles can easily be assembled. The sample meshes I created
in Blender had their pivot points directly in the center of the mesh. It made logical sense to me that it would be like 
that! However, the meshes Wesley gave me had their pivot in the upper corner of the thing. It didn't occur to me to ask 
why they were doing this, so instead I simply adjusted their position so that they would be centered as before. 

When we finally discussed it and Wesley brought up that it was off (which came from a different yet related discussion),
they told me why it was off and why they had them set up like that. So after having it explained to me and seeking
information of my own from other game developers, it clicked. I apologized for the assumption and set about correcting
the problem! 

The real moral, however, is that instead of letting something go when you don't understand it, you should instead ask!
Which can be tough! I don't know where it came from exactly, but there seems to be a deep, innate fear of looking stupid 
to other people within humans and all it really does is hold us back. It's a problem I had for a long time and am 
still working through here or there, particularly as I get into the game dev field! 

And lastly...

Some Personal Stuff
-------------------
So here a week and a half ago or so I got into a car accident on my way home from work. Fortunately no one was seriously
injured with most damage being done to the cars. The timing, however, couldn't have been much worse than it was. My 
fiancé and I had just put a down payment on reserving the spot for our wedding so things are going to be tight for awhile.
But the good news is, hey, I'm getting married! So lots to do and plan in the up coming months! Not only that, but my
brother that just finished with his Masters degree will be moving in with us and I've been excited about that for months!
So I'll leave you with that happy note! More updates to come as the game development process really heats up!


See you around,
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