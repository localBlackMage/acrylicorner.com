---
layout: post
comments: true
title: "Lighting in OpenGL"
date:   2018-03-19 00:00:00 -0800
categories: programming C++
---
Lighting in OpenGL
-------------------------------------
I remember building raytracers in my undergrad. That seems so long ago now, but that was my first exposure to lighting a 3D environment and the math involved in doing so. Fast forward 10 years and now I've moved on to implementing a whole lighting system for a game in a custom built engine! So as it was my first time actually constructing of the sort and, given the nature of a top-down game, I decided point lights would be the easiest and best looking lights to start with. I had plans to implement shadows at some point, but I'm afraid time is not on my side with that feature. Ah well!

The first question I needed to answer was: what do I need for a point light? The answer is pretty trivial, but plays a important role when shipping data over to the GPU. Each light will need, at minimum:

- A position
- An offset from that position (in my case, this is because lights can be components on any type of game object and this allows them to be moved about freely)
- A color
- Optional: 'A' and 'B' values (I'll discuss what these are for later, just know I'm using a global A and B currently)

Since our game in particular is 2D orthographic, I designed a layering system for ease of placing objects in the game world in such a way that they'd always be rendered in the correct order. There are multiple background layers, interactive layers, and UI layers, in that order. With this in mind, I needed my lights to be able to *only* affect certain layers. I don't, for instance, need to light up background layers or the UI with my lights in most cases. So each light knows what layers it needs to actually affect in addition to the other properties described.

```cpp
class LightBase : public Component
{
private:
    Transform * m_pTransform;   // The parent game object's position
    Vector3D m_offset;          // The offset from the parent GO's pos
    Vector3D m_color;           // The color of this light

    // How far before the light falls off entirely - not used in my current implementation
    float m_distance;

    // Indicates which layers this light should affect
    bool m_layers[RENDER_LAYER::L_NUM_LAYERS];

    // ...
}
```

Game Layers and Lights
----------------------

That's all there is to the point light component itself. On to the interesting stuff! How does one support many lights in a scene? You certainly can't send the relevant data for each light over to the GPU if you have lots of lights in your scene, it simply isn't supported. For my implementation, I limited the amount of lights sent over to 16 and opted for a list of lights that was sorted by distance to the object being lit that was capped at the limit I set.

```cpp
#define MAX_LIGHTS 16

class GameObjectLayer {
private:
    std::vector<GameObject*> m_layerObjects;
    std::vector<GameObject*> m_layerLights;

    GLuint m_lightColorsBuffer;
    GLuint m_lightPositionsAndDistancesBuffer;

    static const unsigned short m_size = MAX_LIGHTS * 4;
    float m_lightColors[m_size];				// r, g, b, a
    float m_lightPositionsAndDistances[m_size];	// x, y, z, distance

    void _SetLightDataArrays();
public:
    // ..
    void AddLightToLayer(GameObject* pGO);
    void RemoveLightFromLayer(GameObject* pGO);

    // If there are fewer than MAX_LIGHTS, this will fill
    // m_lightColors and m_lightPositionsAndDistances with all light data
    void Update();

    // Binds lightColors and lightPosAndDists to OpenGL after sorting based on input position
    void BindBufferDatas(const Vector3D& pos);
};
```

The sorting and shipping of data to the GPU:

```cpp
typedef std::pair<GameObject*, float> GO_Distance;

static bool LeftDistLessOrEqualToRight(const GO_Distance& left, const GO_Distance& right) {
	return left.second <= right.second;
}

// Store all light's data into the arrays that will be shipped over to the GPU
void GameObjectLayer::_SetLightDataArrays()
{
    int idx = 0;
    for (unsigned int i = 0; i < m_layerLights.size(); ++i) {
        idx = i * 4;
        PointLight* pPointLightComp = m_layerLights[i]->GetComponent<PointLight>(ComponentType::C_PointLight);

        m_lightColors[idx + 0] = float(pPointLightComp->Red()) / 255.f;
        m_lightColors[idx + 1] = float(pPointLightComp->Green()) / 255.f;
        m_lightColors[idx + 2] = float(pPointLightComp->Blue()) / 255.f;
        m_lightColors[idx + 3] = float(pPointLightComp->Alpha()) / 255.f;

        Vector3D pos = pPointLightComp->GetPosition();
        m_lightPositionsAndDistances[idx + 0] = pos.x;
        m_lightPositionsAndDistances[idx + 1] = pos.y;
        m_lightPositionsAndDistances[idx + 2] = pos.z;
        m_lightPositionsAndDistances[idx + 3] = pPointLightComp->Distance();
    }
}

void GameObjectLayer::Update()
{
    // If there are an acceptable amount of lights, simply bind the data arrays once
    // and be done
	if (m_layerLights.size() <= MAX_LIGHTS)
		_SetLightDataArrays();
}

void GameObjectLayer::BindBufferDatas(const Vector3D& pos)
{
    //If there are fewer than MAX_LIGHTS lights, don't bother sorting by distance
    //else, Pick the MAX_LIGHTS closest lights
    if (m_layerLights.size() > MAX_LIGHTS) {
        std::fill(m_lightPositionsAndDistances, m_lightPositionsAndDistances + m_size, 0.f);
        std::vector< GO_Distance > lights;
        lights.reserve(MAX_LIGHTS);

        // Grab the first MAX_LIGHTS worth of lights and store distance to the target position
        // Sort these lights based on the calculated distance
        unsigned int i = 0;
        for (i = 0; i < MAX_LIGHTS; ++i) {
            float dist = Vector3D::SquareDistance(pos, m_layerLights[i]->GetComponent<Transform>(C_Transform)->GetPosition());
            lights.push_back(std::make_pair(m_layerLights[i], dist));
            Sorting::InsertionSort(lights, &LeftDistLessOrEqualToRight);
        }

        // For the remaining lights, calculate the distance and discard the light if it's too far away,
        // else remove the furthest light from the sorted list and perform an insertion sort with the
        // new light
        for (i = MAX_LIGHTS; i < m_layerLights.size(); ++i) {
            float dist = Vector3D::SquareDistance(pos, m_layerLights[i]->GetComponent<Transform>(C_Transform)->GetPosition());
            // If this light is farther away than the farthest light, ignore it
            if (dist > lights[MAX_LIGHTS-1].second)	continue;

            lights[MAX_LIGHTS - 1].first = nullptr;
            lights.pop_back();
            lights.push_back(std::make_pair(m_layerLights[i], dist));
            Sorting::InsertionSort(lights, &LeftDistLessOrEqualToRight);
        }

        _SetLightDataArrays();
    }

    glUniform4fv(SHADER_LOCATIONS::L_COLOR, MAX_LIGHTS, m_lightColors);
    glUniform4fv(SHADER_LOCATIONS::L_POS_DIST, MAX_LIGHTS, m_lightPositionsAndDistances);
}
```

With this, we now have a system in place that will sort our lights as needed per object and send the data to the GPU for rendering. As I haven't yet had time to implement any form of normal mapping and the game is sprite based, we're simply using just diffuse and ambient lighting for our scene.

Shaders
-------------------------

I've omitted portions of the shaders that aren't directly related to the lighting itself. This is the Vertex Shader:

```c
#version 430

// NON-UNIFORM INPUTS
layout(location = 0) in vec4 position;
layout(location = 1) in vec4 normal;

// UNIFORM INPUTS
layout(location = 10) uniform mat4 persp_matrix;
layout(location = 11) uniform mat4 view_matrix;
layout(location = 12) uniform mat4 model_matrix;
layout(location = 13) uniform mat4 normal_matrix;
layout(location = 14) uniform vec4 camera_position;

layout(location = 47) uniform bool lit;
layout(location = 50) uniform vec4 l_pos_dist[16];

// OUTPUTS
layout(location = 5) out vec4 vnormal_vector;
layout(location = 6) out vec4 vview_vector;

layout(location = 10) out vec4 vl_lightVectors[16];

void main() {
    vec4 P = model_matrix * position;
    gl_Position = persp_matrix * view_matrix * P;

    // lit simply determines if this object should be affected
    // by lights or rendered at full brightness
    if (lit) {
        for(int i = 0; i < 16; ++i) {
            // If the w component is 0, this light has not
            // been set on the CPU side, so ignore it
            if (l_pos_dist[i].w == 0)
                vl_lightVectors[i] = vec4(0,0,0,1);
            else
                vl_lightVectors[i] = vec4(l_pos_dist[i].xyz, 1) - P;
        }
    }

    vnormal_vector = normal_matrix * normal;
    vview_vector = camera_position - P;
}
```

And the following is the Fragment Shader:

```c
#version 430

// UNIFORM INPUTS
layout(location = 40) uniform vec3 ambient_global_color;
layout(location = 41) uniform vec3 ambient_color;

layout(location = 47) uniform bool lit;
layout(location = 48) uniform float l_a;
layout(location = 49) uniform float l_b;
layout(location = 50) uniform vec4 l_pos_dist[16];
layout(location = 66) uniform vec4 l_color[16];

// NON-UNIFORM INPUTS
layout(location = 5) in vec4 vnormal_vector;
layout(location = 6) in vec4 vview_vector;

layout(location = 10) in vec4 vl_lightVectors[16];

// OUTPUTS
out vec4 frag_color;

float falloff(float dist) {
    return 1.f / (1.f + l_a * dist + l_b * dist * dist);
}

void main(void) {
    vec2 offsetCoords = (vtexture_coord * vframe_size) + vframe_offset;
    vec4 m = normalize(vnormal_vector);
    vec4 v = normalize(vview_vector);
    vec3 lightColor = vec3(0,0,0);

    if (lit){
        for(int i = 0; i < 16; ++i) {
            if(vl_lightVectors[i].w == 1)
                continue;
            float d = length(vl_lightVectors[i]);

            vec4 L = normalize(vl_lightVectors[i]);
            // As d is in pixels, we want it in world units.
            // A single world unit is the diagonal of a cell
            d /= 143.108f;
            lightColor += (max(dot(m,L),0) * l_color[i].xyz) * falloff(d);
        }
        lightColor += ambient_global_color;
    }
    else
        lightColor = vec3(1,1,1);

    frag_color = /* Some texture color here */ * vec4(lightColor,1);
}
```

A couple interesting things to note about the code shown here. The first thing that may have caught your eye is the falloff function, taking in the distance from the light to the object being lit. This is where those earlier mentioend A and B values come in. In my research on physically simulated lights, there's a forumla for point lights equal to the following:

```
        1
-------------------
1 + A * d + B^2 * d
```

Some choice defaults for A and B are `0.1` and `0.01` respectively, but you're encouraged to play with the values until you get a look you want. These will affect the roll off affect of the light -- how quickly the light starts to fade from the origin of the light itself.

The second item of interest is the line in which I'm dividing d by some magic number: `d /= 143.108f;` Rest assured, this has purpose! Normally, in perspective projection space, objects exist in "world units". The same is true for the objects in our scene, of course, but now they're orthographically projected instead, putting them into pixel space, meaning that the distance between lights will be *far* greater. The lighting models I'm working with tend to fall off at fairly small distance values, so I used the diagonal of a world tile as the world unit size (our cells are 128x64 pixels).

Lighting: Optimization!
-----------------------
While speaking to [@AriBodaghee](https://twitter.com/AriBodaghee) of [@Shadow_Knights_](https://twitter.com/Shadow_Knights_), I received some insight on how to speed up performance of the system. An amazingly simply and probably obvious optimization in hindsight, too! In Shadow Knight's game, The Lighthouse, they use zones for the lights and only "turn lights on" when the player is in the corresponding zone, like so:

![Unity Particle System](../../../../../images/2018_03_18/lighting/LightCulling_Ari.png)

As our game doesn't quite have rooms in it in the same sense as theirs, it still gave me the idea to sort lights by player position once per frame during update and only use those lights come time to render. After all, who cares about lighting things off screen that the player will never see? Given our engine already had the ability to simply retrieve the player game object from the system, adding this optimization was a piece of cake and performance increased dramatically.


```cpp
void GameObjectLayer::Update()
{
    if (m_layerLights.size() > MAX_LIGHTS)
        // All the same sorting code from above now goes here instead!
    }

    _SetLightDataArrays();
}

void GameObjectLayer::BindBufferDatas()
{
    glUniform4fv(SHADER_LOCATIONS::L_COLOR, MAX_LIGHTS, m_lightColors);
    glUniform4fv(SHADER_LOCATIONS::L_POS_DIST, MAX_LIGHTS, m_lightPositionsAndDistances);
}
```

Final Product
-----------------------------
[The final product!](http://holdenprofit.com/videos/2018_03_19/LightingSystem.mp4 "The final product!")




Wrapping Up
-----------------------------
That was a lot of code and not a lot of in depth explanation, but hopefully you learned something from reading all of this! I sure had fun creating it and have learned a lot! I highly recommend sending some love to [@Shadow_Knights_](https://twitter.com/Shadow_Knights_) and be sure to check out The Lighthouse!

I'll be making new posts in a month or so, when classes have settled down and I have a little more time to breathe. Until then!

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
