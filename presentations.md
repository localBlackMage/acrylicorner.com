---
layout: page
title: Presentations
---


<div class="page-content wc-container">
	<div class="post">
		<h1>Presentations</h1>  
    <p>Over the years I've given several presentations covering various topics. Here I've compiled all of the slide decks into one handy location!</p>
		<ul>
			{% for presentation in site.presentations %}
			<li><a href="{{site.baseurl}}/presentations/{{ presentation[0] }}">{{ presentation[1] }}</a></li>
			{% endfor %}
		</ul>
	</div>
</div>
