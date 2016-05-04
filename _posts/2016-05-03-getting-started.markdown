---
layout: post
comments: true
title: "After ECGC and Getting Started"
date:   2016-05-03 11:00:00 -0500
categories: personal update
---
I had a pretty good time at [ECGC](http://ecgconf.com/)! It was a pretty fun experience filled with not necessarily firsts,
but definitely a lot more active involvement on my part from previous events of this nature. Got to meet some very
cool people and got some great info on how to sharpen myself for future applications into the game development realm. 

Most of all, however, this has me super pumped to work on the game with [Wesley Paquette](http://wesleypaquettedesigns.com/),
which is tentatively known as "Tilt-A-Ball Z" until we get a real title! The premise will set the player navigating a ball
around a puzzle maze via tilting it. We're still working out the specifics, but you can look forward to a simple demo 
within a few weeks!

In the mean time, I can share some of the hiccups I've faced getting the project set up as well as some hurdles I've 
overcome. 

Unreal 4 is, suffice it to say, daunting to learn. There's so much it can do and I've only just begun to tap into it's 
capabilities. Coming from a Unity background, it's taken some adjusting in my mindset of how things work but now I
have a decent grasp of things. First of all, I want to do this project in as much C++ as I can managed for the experience.
This is ultimately the more difficult route as not only does it require me to learn U4's API but C++ as well. While I'm
not new to C based languages, it's been a long time since I had to diddle around with pointers! I've gotten a lot of help
from some good people on [Game Dev League](https://discord.gg/0TYNJfCU4De7YIk8) on Discord! 

Learning Unreal Through C++
---------------------------
So right away I put myself straight into the crap. What can I say, I like to learn things the hard way! I begin by trying
to build a player controller for our game, what translates into the actor that will receive input and, well, do stuff. 
I got a little ahead of myself and decided to not only instantiate our controller actor, but attempted to spawn a 
map on top of it which, while it *will* be important later, it was sort of jumping the gun as far as things were. 

So! I took a couple steps back and went to controller input implementation, following some documentation and asking 
questions along the way when I hit snags. I got my InputComponent code put in and hooked up to my control schemes and
really felt like I was rocking! 

![Player Input Setup](../../../../../../images/2016_05_03/playerInput.png)

That is, until I found my controller still wouldn't move the actor... So I stewed for
about a day, asking for help and googling what I could. It didn't occur to me until the next day when I booted up U4's 
Flying demo and found their declaration of InputComponent doing the same thing I did... with a minor difference! 
The control schemes were named differently! Ahah! That had to be the key! Where were those control schemes defined? 

![Engine - Input Settings](../../../../../../images/2016_05_03/inputEngine.png)

After researching it for all of about 5 seconds with a more focused search in mind, I found the answer and **finally** 
got things moving! Needless to say, I was quite happy! So I spent that evening tweaking the inputs around so that it'd 
better control how we wanted and not tilt our map too far in a given direction. 

![Progress!](../../../../../../images/2016_05_03/tilting.gif)

Version Control
---------------
Now I'm not new to VCS or getting one set up, but with this project I wanted to try a new technology (or at least new to
me) this time around. That tech is Perforce. I'd already come across the name in several places and some research on it
only had people singing it's praises so I figured it wouldn't be too bad. This was, of course, before I started to try
and use it. 

I've spent no fewer than 2 days trying to get a Perforce server set up. Every walk through I came across that I tried
eventually hit a snag somewhere during the process. A lot of the failure is likely due to my lack of knowledge and
experience with servers but man, I was not expecting something so tedious. 

After the first day of messing around with P4, I decided to forgo it and use Git on Bitbucket instead. That took me all 
of 15 minutes to get set up with the whole repo checked in and ready. How naive I was! A day or two later when Wesley
needed to pull my changes and merge them into their own, I found out why Git is not a good choice for U4 projects. U4 
stores it's game project assets (UAsset files) as giant binaries and anyone that knows Git knows that Git has an 
extremely difficult time chugging through binaries and cannot auto-merge them. Needless to say merging a binary by hand
is simply out of the question. 

So I went back to Perforce and have since continue to struggle. We decided in the mean time to avoid being stuck we'll
simply host our files on a Google Drive with me saving files locally on Git should the need for version control really
arise. This is obviously far from ideal but unfortunately the most manageable solution until I get P4 up and running 
properly. 

So after another day of effort, I've finally got a server and client setup locally, but seem to be having trouble with 
my router. After asking my good friend Tom Carson for some assistance in the matter, we discovered that my gateway seems
to simply be impossible. So I'll have to talk to my ISP about getting the thing port forwarded. Fun times!

The Results
-----------
So my struggling may have delayed things, but I feel I understand how U4 works better already. The concept of Actors makes
much more sense when you see things from the code point of view rather than strictly the GUI they provide you with. It's a
different mindset from that of Unity (to a point, at least). My knowledge of C++ in general has also started to expand
and I'm pretty happy seeing even small steps of progress on that front, it's a pretty daunting language! 

A rough start, but in the end I feel better because of it!

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