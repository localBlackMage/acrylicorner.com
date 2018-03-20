---
layout: post
comments: true
title: "Particles in OpenGL"
date:   2018-03-18 00:00:00 -0800
categories: programming C++
---
Particles in OpenGL
-------------------------------------
It's been awhile since I've posted. DigiPen and my own personal studies have been keeping me plenty busy lately and this week is my first GDC in over 5 years. Needless to say, I'm a little anxious!

But that's not what I'm here to talk to you about today. It's far more interesting to talk about what I've been learning during my time at DigiPen! So to start off with, the particle system! Let me preface this with the acknowledgement that there are superior ways of accomplishing what I'm about to go over, but it was my first time making this sort of thing at all, so go easy on me!

Building a Particle System
-------------------------------------
Fire, smoke, sparks, clouds, fog, etc. All are examples of particle systems you've likely come across in the games you've played. The full list of uses for particles is extensive and the sorts of visuals you can create with such a simple yet powerful tool is truly awe inspiring. So how does one build a particle system?

To begin with, your engine will need to support some form of emitter. The emitter is essentially a set of configurations for spawning particles and how they'll behave over time. Behaviors such as their scale, velocity, rotation, where they're spawned at, etc. Just a quick look at Unity's particle emitter system gives one an idea of just how many dials and knobs a truly fleshed out emitter can have.

![Unity Particle System](../../../../../images/2018_03_18/particles/unityParticles.png)

My own emitter supports the following properties:
- Does it loop?
- Should it delay starting emission?
- How long does each particle live?
- How fast should it animate (if it animates at all)
- How quickly should a particle move?
- What is the particle's velocity direction at a given point in time?
- How much affect should gravity have on each particle?
- What color should the particle be at a given point in time?
- At maximum, how many particles should be alive at a given point in time?
- How big should the particle be at a given time?
- How should the particle select it's texture? (animated, random sprite from those available, single sprite)

Keep in mind there are many, *many* more possible settings and certainly a lot of variations on how they can be implemented. For example, rotation over time, varying lifetime lengths, random emission, pre-warming the system, and more. So with all these settings in place, how does one actually go about making the particles? A naive approach would be to simply spawn new game objects and set each with the properties specified in the emitter. You'll certainly end up with particles this way, but particle systems are usually meant to spawn many instances, meaning your frame rate will start to suffer very quickly if you have too many in your scene.

Instead of simply spitting out entire game objects all willy nilly, my particles live in the form of an array of Particle structs, each containing pertinent information such as current animation time, life time, position, etc. The emitter takes care of updating each as the system would any normal game object, minus physics as that was a bit beyond the scope of our project. For my implementation, I chose to have my emitter be both the configuration and the manager of the particles associated with that emitter for the sake of keeping similar code ideas together and easier to find.

![Particle Struct](../../../../../images/2018_03_18/particles/particleStruct.png)

![Array of Particles](../../../../../images/2018_03_18/particles/particleArray.png)

Rendering the Particles
-------------------------------------

So with the system set up and ready to spawn new and update existing particles, the next step is getting things over to the GPU so the particles can be rendered! Before I get to that step, a small caveat that wasn't mentioned in the Particle properties is the `m_cameraDistance` property. Every frame, after the particles have been updated and before they're rendered, they are sorted by distance to the camera that will be rendering them. For our project, we only had one camera rendering the scene so it was fairly trivial to just use that camera's position to sort with, but if you plan on having multiple cameras render the same set of particles, you'll want to instead sort this array before shipping them over to the GPU.

Fair note, as our game is orthographic top-down and the Z-value of my particles never changes, I've opted to skip this sorting step to get the desired effect for our game's look, but be mindful of it!

For the actual rendering of the particles, I used a method called instance rendering, a way to drastically speed up the rendering process. It does so by shipping all the data needed for rendering many instances in long arrays and telling the GPU how how much data to consume from the array to render a single instance. The data in my particle system that gets shipped to the GPU is stored in three different arrays:

![Array of Particles](../../../../../images/2018_03_18/particles/aosParticles.png)

Pushing the data to the GPU:
![Passing Particles to GPU](../../../../../images/2018_03_18/particles/particlesOpenGL.png)

With all the data now on the GPU and OpenGL aware of how much data in each array belongs to a single instance, the next step is to tell OpenGL what the "step size" is when drawing each instance.

![Particle Attrib Divisor](../../../../../images/2018_03_18/particles/particlesAttribDiv.png)

You'll notice that I didn't explicitly specify anything about the mesh (a simple quad) data having an `glVertexAttribDivisor`. That's because they're uniform across all of the draw commands, meaning we only send one set of data and it's treated by OpenGL to have a attribute divisor of 0, meaning it will use that first set of data without iterating for every draw. The final important step is to actually render the particles!

`glDrawArraysInstanced(GL_TRANGLES, 0, 3 * faceCount, liveParticles)` is the same as calling `glDrawArrays` in a for-loop for every particle, but far faster. This new method's new and final argument is the number of instances to render, which in our case is the number of living particles.

The last step in rendering the particles are the shaders. For simplicity's sake, I've stuck to just using a vertex and fragment shader, but there are techniques that make use of geometry shaders that I'll be looking into later!

The Vertex Shader:
```c
#version 430

layout(location = 0) in vec4 position;
layout(location = 1) in vec4 normal;
layout(location = 2) in vec2 texture_coord;
layout(location = 3) in vec4 p_pos_size;
layout(location = 4) in vec4 p_color;
layout(location = 5) in vec2 p_texture_coord;

layout(location = 10) uniform mat4 persp_matrix;
layout(location = 11) uniform mat4 view_matrix;

layout(location = 33) uniform vec2 frame_size;


layout(location = 0) out vec4 vtint_color;
layout(location = 2) out vec2 vtexture_coord;
layout(location = 3) out vec2 vframe_offset;
layout(location = 4) out vec2 vframe_size;

void main() {
	// p_pos_size.w = uniform scale of the particle
	mat4 modelMatrix = mat4(
		p_pos_size.w, 0, 0, 0,
		0, p_pos_size.w, 0, 0,
		0, 0, 1, 0,
		p_pos_size.x, p_pos_size.y, p_pos_size.z, 1
	);
	// modelMatrix =    translateMatrix(p_pos_size.x, p_pos_size.y, p_pos_size.z) *
	//                  scaleMatrix(p_pos_size.w, p_pos_size.w, 1)

	gl_Position = persp_matrix * view_matrix * modelMatrix * position;
	vtexture_coord = texture_coord;
	vframe_offset = p_texture_coord;
	vframe_size = frame_size;

	vtint_color = p_color;
}
```

The Fragment Shader:
```c
#version 430

layout(location = 0) uniform sampler2D particleTexture;

layout(location = 0) in vec4 vtint_color;
layout(location = 2) in vec2 vtexture_coord;
layout(location = 3) in vec2 vframe_offset;
layout(location = 4) in vec2 vframe_size;

out vec4 frag_color;

void main(void) {
	vec2 textureCoordsInFrame = (vtexture_coord * vframe_size) + vframe_offset;
	vec4 textureColor = texture(particleTexture, textureCoordsInFrame);

	frag_color = textureColor * vtint_color;
}
```

I left out a lot of details, specifically about the update and spawning process, but in the end we ended up with something like this for our fire effects:

 ![Fire Particles](../../../../../images/2018_03_18/particles/particlesAnimated.gif)

Resources
-------------------------------------
More information on some of the information covered here can be found at the following sources:

[OpenGL Programming Guide: The Official Guide to Learning OpenGL](http://www.informit.com/articles/article.aspx?p=2033340&seqNum=5 "OpenGL Programming Guide: The Official Guide to Learning OpenGL")

[Khronos glBufferData](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glBufferData.xhtml)

[Khronos Buffer Object Streaming](https://www.khronos.org/opengl/wiki/Buffer_Object_Streaming)


Also be sure to checkout [ThinMatrix](https://twitter.com/ThinMatrix) for some amazing tutorials, they certainly helped me!




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
