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

No matter how you slice it, that's a pretty easy to read data container at a glance. Objects can be nested as deep as you like and everything's either a string or a number. Simple JS objects are basically glorified JSON as well, just with the added ability to contain functions for the most part. This actually leads to the next thing regarding JS that I enjoy:

### Maps/Hashes
Since everything in Javascript is an object and objects in Javascript can always have properties added and removed, this essentially makes *everything* a Map or Hash object. While many languages do have this concept, it's never been so astoundingly simple and intuitive to the language itself.

```javascript
var dict = {};
var values = ['One', 'Two', 'Three'];

values.forEach(function(val, index){
  dict[index] = val;
});

console.log(dict['2']); // logs 'Two'
```

This is a brief example of how this can be used. The key is either a direct property of the object or, if the key contains numbers or symbols, a string. The value can be anything you want. I find this to be a powerful tool both in how lenient JS is with key-value pairs and in the speed capabilities it gives you for storing data needed for other operations.

### Promises
In a way, the callbacks and promises share a similar idea. A callback is a function that is executed at a later time and a promise is an ambiguous blob of data that resolves to something more concrete at a later time. Promises and callbacks are very closely entwined in practice.

I know, I know, I already said I don't like callbacks!

However! That's not entirely true, to be honest! I do like the concept of callbacks and the power they provide to you, I just don't like the big nasty chains they can easily lead to if you're not careful!

In web development, you'll frequently find yourself requesting data from a server and then acting upon that data once it's loaded. Normally this would mean callbacks, but the extent to which you use them can be mitigated through the use of promises. [One of the most used and well know promise libraries can be found here.](https://github.com/kriskowal/q) The basic idea is something like this:

```javascript
var getDataFromServer = function(params) {
  var deferred = Q.defer();

  getData(params)
    .then(function(result) {
      deferred.resolve(result);
    })
    .catch(function(error) {
      deferred.reject(new Error('Something went wrong!'));
    });

  return deferred.promise;
}
```

You create a deferred object, call your function body to do what you need, and return the deferred object's internal promise object. At this point the object that has been returned is an object with certain promise specific methods on it for doing various things I won't cover here (they can be found in the Q documentation). The magic happens when that function body you called earlier finally finishes it's work. In my example I've set up a pass through to some AJAX calling method that makes a call. Once the call finishes, it will call `.then()` or `.catch()` accordingly and you can resolve or reject your promise. This essentially replaces the promise instance with whatever you resolve your promise to. Viola, your callbacks are contained to a simple few and your data will be there once they've finished.

This can be useful when you *need* certain data to be available before moving on to the next portion of your code. Say, for example, I have a website that registers teams of users. For an individual user to view a page with their teammates on it, I need to retrieve that data from the server. That could easily be done in a callback, sure, but what if I needed data from the team register to make *another* call to, say, get individual team member statistics? That'd need a callback chained onto your first callback. What if I needed data from *that* callback to make another call? Another callback.

You can see how this might lead to callback hell. The solution is promises and dependencies.

### Ease of Use
Honestly one of the most appealing things about Javascript to me is just how easy it is to get started. All you need is a text editor of some sort and a web browser, bare minimum. It's far less of a hassle or a headache than numerous other languages that require whole build processes and advanced IDEs just to get *started*. With JS you can make an index.html file, slap a `<script>` tag in there, load it up into your browser and **bam** you're rolling.

Obviously JS can be as complicated as you want it to be (see: frameworks, build tools, configurations, etc.) but at it's heart it's a simple langue that doesn't take much to get something showing on the screen.

## Looking Ahead
So my article has covered ES5 up to this point, but I've been doing some dabbling in ES6 as of late and have come to find it solves a lot of my smaller gripes with JS in general. Here I'll list some of the things I'm excited to see in ES6, starting with `class` syntax.

```javascript
class ParentClass {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  printPosition() {
    console.log(`${this.x} ${this.y}`)
  }
}

class ChildClass extends ParentClass {
  constructor (x, y, z) {
    super(x, y)
    this.z = z
  }

  printPosition() {
    console.log(`${this.x} ${this.y} ${this.z}`)
  }
}
```

Not only is this far more clear and concise as to what's going on, it gets rid of dealing with `prototype` entirely. Note that `prototype` is still there, but it's not something you need to deal with on a regular basis now. There's talk of doing more advanced things with it in the future, like implementing multiple class inheritance, so we'll see where that goes!

Also shown briefly above is new string interpolation. Rather than having to write the cumbersome `this.x + ' ' + this.y` it can easily be wrapped in \` and variables can be accessed via `${varName}` resulting in:
```javascript
`${this.x} ${this.y}`
```

Lastly I'll mention computed property names. While objects can have funky names with numbers, spaces, and characters in them, they need to be added after the fact. Meaning that the following would result in an error:
```javascript
let item = {
  [ "foo" + bar() ]: 123
}
```
But that's perfectly valid syntax in ES6, making your code more concise!

## In Conclusion
There's a lot to love about Javascript and there's a lot to love... not quite so much! Really though, every language has it's pros and cons and which one you end up using is ultimately up to personal preference (or job demand if you're unlucky). JS is a fun language that can also be powerful when it comes to delivering on user experiences in the modern web or servers in the form of nodejs.

I'm always interested in hearing any thoughts people might have regarding Javascript ES5 or beyond!


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
