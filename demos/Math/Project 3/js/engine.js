JSEngine = 0;

function Engine()
{
  // Set global
  JSEngine = this;

  // Time tracking
  this.last_time = new Date();

  // Listeners
  this.listeners = {};
}

Engine.prototype.AddEventListener = function(listener, event_name)
{
  if (!this.listeners[event_name])
    this.listeners[event_name] = [];

  this.listeners[event_name].push(listener);
}

Engine.prototype.DispatchEvent = function(event_name, args)
{
  // Construct arguments
  var message_args = [];
  for (var i = 1; i < arguments.length; ++i)
    message_args.push(arguments[i]);

  // Dispatch to listeners
  var listeners = this.listeners[event_name];
  if (listeners)
  {
    for (var i in listeners)
    {
      var listener = listeners[i];
      listener[event_name].apply(listener, message_args);
    }
  }
}
