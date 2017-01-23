---
layout: post
comments: true
title: "Javascript Pros & Cons"
date:   2017-01-23 00:00:00 -0500
categories: programming javascript
---
What I Like, What I Don't
-------------------------------------
Recently I was asked what it was about Javascript that I liked and didn't like. It was a question I was oddly unprepared to answer despite my having used it pretty extensively over the last few years. So, I've decided to take it upon myself to compile a list of five or more things I like about Javascript as well as five or more that I dislike. I plan to do this for other languages in the future, but for now I'll start with what I'm currently most familiar with. Keep in mind that I'm going off of EcmaScript 5 Javascript for this article.

Perhaps it's best if I start off with the negatives about Javascript so I can end on a good note! I feel a lot of animosity for the language in general from those that aren't already avid users of it and they sometimes have good reason not to!

The Bad Stuff
-------------

### Callbacks
When I was first starting out learning Javascript, this was perhaps the single most difficult concept to get my head around. Coming from a background of C#, Python, and Java, I had never before come across such a mystifying feature. Confusion aside, however, callbacks are just a weak point in a lot of javascript code bases and can often lead to what so many refer to, lovingly, as "callback hell." This happens when you have a chain of nested callbacks that seem to spiral off into the nether and make tracing code feel like going down a rabbit hole.

```javascript
var someFunction = function(func) {
    ...do stuff...
    func();
};

someFunction(function(){});
```

Shown here is the basic premise for how callbacks are executed. A function ends up calling another function that you supply to it in one way or another. Perhaps the most common pattern you'll see is something like the following:

```javascript
var anotherFunction = function() {
    ...do stuff...
    return {
        then: function(callback){
            callback();
        }
    };
};

var callbackHandler = function() {
    ...do stuff...
};

anotherFunction().then(callbackHandler);
```

This `.then()` pattern is incredibly common in any form of promise resolution and REST calls as neither are blocking items, meaning Javascript will continue on it's happy way after the `anotherFunction` code has sent off the REST call or what-have-you. The real problem stems from nested callbacks, large chains of `.then()` type blocks where you're required to sift through several functions just to find out what happens at the end of a given non-blocking item's life span.

### Class-Like Objects
Javascript has no concept of class! **AHHH!**

Okay no, it's not *that* bad, but it's definitely weird. Weirder still is that it *does* have classes, just not in the way one would think it does. Given that everything in Javascript is an object, including functions, you can use this to create instantiatable objects, ergo, a class. It even allows you to use `new` syntax.

```javascript
var MyClass = function(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
};

var newObject = new MyClass('First', 'Second');
```

The real problem with this is that it's just not very intuitive for a beginner. Someone coming from a non-JS language doesn't equate function with objects or classes. What gets stranger still is how you add functionality to said class:

```javascript
MyClass.prototype.someNewFunction = function() {
    ...do stuff...
};
```

What is this prototype thing? What does it do? Since when did I add *that* to my MyClass object? Even better is that...

```javascript
MyClass.anotherNewFunction = function() {
    ...do stuff...
};
```

...does something completely different. Anything added to the prototype will have a copy added to `new` instances of the object where-as items added directly to the MyClass function will not be inherited.

### Inheritance
Javascript's idea of how to perform object inheritance is certainly a bit more involved than your normal `class MyClass extends SomeOtherClass` sort of syntax. It deals with a hidden object called the Prototype, which all objects in JS have.

```javascript
var ParentClass = function(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
}

var ChildClass = function(param1, param2, param3) {
    ParentClass.call(this, param1, param2);
    this.param3 = param3;
}

/* NOTE: that omitting the Object.create() call will merely
 * set ChildClass.prototype equal to ParentClass.prototype
 * This means *any* changes made to ChildClass.prototype will
 * actually also be reflected on the ParentClass, something you want to avoid!
 */
ChildClass.prototype = Object.create(ParentClass.prototype);

ChildClass.prototype.constructor = ChildClass;
```

As you can see, it's fairly wordy and not completely obvious what's going on to someone new to JS. It makes use of several advanced JS techniques and knowledge bits including function scope, prototype, and the constructor. The ChildClass constructor function binds the inner going-ons of ParentClass to itself via the `.call()` method before continuing on with the rest of it's own construction. The ChildClass' prototype is overridden by a copy of the ParentClass', giving the ChildClass access to a copy of any and all methods and fields on the ParentClass prototype object. Finally, in order to make the ChildClass *not* a straight up copy of ParentClass when one goes to create a new instance of it, the copied prototype object's constructor is set *back* to the ChildClass function.

It all makes sense if you know Javascript well, but it still manages to be somewhat cumbersome and involves a lot of steps. And speaking of `.call()`...

### Call, Apply, Bind
Three powerful pieces of functionality built right into Javascript, but what do they do?

```javascript
var someFunction = function() {
    console.log(this.message);
}
```
Normally, this code will simply log `undefined` to your console, as `this` refers to the current scope (our function) and our function has no `message` property. That's where call, apply, and bind come in. These three functions can change and even store context for a function, though each operates slightly differently.

```javascript
var someFunction = function() {
    console.log(this.message);
}

var myContextObject = {
    message: 'Hello there!'
}

someFunction.call(myContextObject, null);
someFunction.apply(myContextObject, null);
```
This will now print 'Hello there!' to your console as `this` within the function is effectively replaced with `myContextObject`. You'll notice both call and apply are being called here. For all intents and purposes, they do the exact same thing. The difference lies in the function you're calling or applying to.

```javascript
var anotherFunction = function(param1, param2) {
    console.log(param1, param2);
}

anotherFunction.call(null, 'Hello', 'world!');
anotherFunction.apply(null, ['Hello', 'world!']);
```
Literally the only difference here is in how you pass parameters to your function. Call takes them one at a time, apply takes them all as an array. Personally I find it a matter of personal preference as to which you use.

So what about bind? How does that differ?

```javascript
var finalFunction = function(param) {
    console.log(this.message, param);
}

var myContextObject = {
    message: 'Hello there!'
}

var boundFunction = finalFunction.bind(myContextObject, 'A bound parameter!');

boundFunction();
```
The arguments are the same as call, it takes a context for `this` and each parameter one at a time. However, unlike call and apply, bind does not immediately call the function. It instead, well, *binds* the function's context to the object you pass it and returns the bound function for later calling.

So the question you might be left with is: why do you dislike this, Holden?

The answer lies in the use of `this`. Javascript can be cumbersome enough for beginners trying to understanding how `this` changes based on where it's at within a set of braces, hell it trips me up once in awhile still. Now you introduce additional confusion by substituting what should be intuitive `this` with some arbitrary object. To be perfectly honest, the three functions feel like they're meant purely to fix existing problems with how Javascript operates in general.

### === and ==
In my years using Javascript, I learned that using `===` is basically *the* way to go in Javascript. Unlike `==`, which only checks value, `===` checks both type *and* value of the two objects you're comparing. Kind of like, y'know, most languages do by default with `==`. Really it leads me to ponder what the point of the `==` really is in most cases. If you wanted to do a value comparison, there's ways of doing so without having to change a basic piece of common functionality to match it. Maybe even flip flop the double and triple's purpose?

### Date
Javascript Date object just plain old sucks in my humble opinion. Why? Because you have a date in milliseconds or as a string or even a year, month, day, etc. You want this to become a Date object, right? You'd think this would operate the same all the time, but that'd be where you're wrong. Date will parse out the parameters you give it differently *based on the timezone of the machine running the code*. If it instead parsed out to a time-zoneless date and stored info that would denote what timezone it's in, I could get behind that.

What you're left with is a hassle of converting back and forth between UTC dates and local times. It's such a huge pain that there's an [entire library](http://momentjs.com/) devoted to making dealing with Dates easier by taking care of all the timezone crud for you, but that still involves another dependency that just fixes something natively wrong with the language.


The Good Stuff!
---------------
So now I get a chance to talk about the things I really like about Javascript! After all, it can't be all bad! It's certainly far better than many would have you believe at a glance! Not only that, but ES6 and beyond are coming (or here already if you're using a transpiler!) to add more functionality to Javascript and even fix some of the gripes I have with it!

### JSON
From the early days of Javascript, back in Echma Script 262 3rd Edition came the fantastically simple way to represent data: JavaScript Object Notation, or JSON. JSON has done a lot to ease the burden surrounding simple data storage, transfer, and manipulation.

```javascript
{
  propertyOne: 'Hello',
  'propertyTwo': 'World',
  'property-Three': 12.34,
  propertyFour: {
    innerProperty: 1234
  }
}
```

No matter how you slice it, that's a pretty easy to read data container at a glance. Objects can be nested as deep as you like and everything's either a string or a number. Simple JS objects are basically glorified JSON as well, just with the added ability to contain functions for the most part.

### Maps/Hashes
Since everything in Javascript is an object and objects in Javascript can always have properties added and removed, this essentially makes *everything* a Map or Hash object. While many languages do have this concept, it's never been so astoundingly simple and intuitive to the language itself.

### Promises
Due to the asynchronous nature of Javascript, the need for callbacks arise. As

### Concatenative Inheritance


### Ease of Use

Cons
Class and Inheritance
== and ===
Callbacks
Bind/Apply/Call - Scopes
.1 + .2
Different Versions
Date

Pros
Everything is a map/hash
Promises
Concatenative inheritance
Ease of Use
JSON


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
