JSGraph = 0;

function Graph()
{
  JSGraph = this;

  // Array of control points
  this.controlPoints = [];

  // Array of curve points
  this.curvePoints = [];

  // Array of shell points
  this.shellPoints = [];

  // Array of knot values
  this.knots = [];

  // Array of selected points
  this.selectedPoints = [];

  // Container of curve functions
  this.curveFunctionName = "None";
  this.curveFunctions = {};

  // Function to draw shells
  this.shellFunction = function(){};

  // Distance from which a control point can be selected
  this.controlPointRadius = 15;

  // Number of iterations for algorithms to perform
  this.minIterations = 0;
  this.maxIterations = 10;
  this.numIterations = this.minIterations + ((this.maxIterations - this.minIterations) * curveDefaultIterations);

  // Degree value for relevant curves (DeBoor)
  this.degree = 1;

  // Current T value being displayed
  this.currentT = 0.5;

  this.RebuildUI();

  // Handle placing a point
  $("body").keydown(function(event)
  {
    var src = (event.srcElement || event.target);
    var isInput = $(src).is("input");
    // Delete removes a point
    if (event.keyCode == 8 && !isInput)
    {
      StopEventPropagation(event);
      //RemovePoint();
      return false;
    }
  });

  // Handle selecting a point
  $(JSGraphics.canvas).mousedown(function(event)
  {
    GetMousePos(event);
    mouseDown = true;
    var selected = SelectPoint();
    event.stopPropagation();

    if (!selected)
    {
      StopEventPropagation(event);
      //PlacePoint();
      return false;
    }
  });

  JSGraphics.canvas.addEventListener("mousemove", function(event)
  {
    var oldMouseX = mouseX;
    var oldMouseY = mouseY;
    GetMousePos(event);

    var deltaX = mouseX - oldMouseX;
    var deltaY = mouseY - oldMouseY;

    // If mouse is down, drag selected points
    if (mouseDown)
      MovePoints(deltaX, deltaY);
  });

  $(JSGraphics.canvas).mouseup(function(event)
  {
    GetMousePos(event);
    mouseDown = false;
    SelectPoint();
    event.stopPropagation();
  });
}

Graph.prototype.CalculateCurve = function()
{
  var func = this.curveFunctions[document.getElementById('ui-curve-function').value];
  this.curveFunctionName = document.getElementById('ui-curve-function').value;
  if (func.minIterations) this.minIterations = func.minIterations;
  if (func.maxIterations) this.maxIterations = func.maxIterations;
  if (this.numIterations > this.maxIterations)
    this.numIterations = this.maxIterations;
  if (this.numIterations < this.minIterations)
    this.numIterations = this.minIterations;
  $('#ui-iterations').prop("min", this.minIterations);
  $('#ui-iterations').prop("max", this.maxIterations);
  $('#ui-control-points').text("Control Points: " + this.controlPoints.length);
  //this.curvePoints = [];
  this.shellPoints = [];
  if (this.controlPoints.length > 0)
    func(this.controlPoints, this.curvePoints);

  //this.shellFunction(this.controlPoints, this.shellPoints, this.currentT);
}

Graph.prototype.ResetKnots = function()
{
	/*
	// Clamp degree
	this.degree = 3;
	this.degree = ((this.degree > this.controlPoints.length - 1) ? this.controlPoints.length - 1 : this.degree);
	this.degree = ((this.degree < 1) ? 1 : this.degree);

	// Call knot function
	this.knots = [];
	if (this.knotFunction)
	this.knotFunction(this.controlPoints, this.knots);

	$('#ui-knot-input').val(this.knots.join(" "));
	*/
}

Graph.prototype.AddCurveFunction = function(name, func, minIterations, maxIterations, shellsEnabled)
{
  func.minIterations = minIterations;
  func.maxIterations = maxIterations;
  func.shellsEnabled = shellsEnabled;
  this.curveFunctions[name] = func;
  this.RebuildUI();
}
	
Graph.prototype.SetShellFunction = function(func)
{
  this.shellFunction = func;
}

Graph.prototype.SetKnotFunction = function(func)
{
  this.knotFunction = func;
}

Graph.prototype.AddControlPoint = function(x, y)
{
	if (this.selectedPoints.length == 1 && this.selectedPoints[0] == this.controlPoints[0])
		this.controlPoints.unshift({x: x, y: y, selected: false});
	else
		this.controlPoints.push({x: x, y: y, selected: false});
  //this.ResetKnots();
  //this.CalculateCurve();
}

Graph.prototype.ResetControlPoints = function() {
	this.controlPoints = [];
}

Graph.prototype.RemoveControlPoint = function(x, y)
{
  var newArray = [];
  for (var i = 0; i <  this.controlPoints.length; ++i)
  {
    var p = this.controlPoints[i];
    var removed = false;
    for (var j = 0; j < this.selectedPoints.length; ++j)
    {
      if (p == this.selectedPoints[j])
        removed = true;
    }

    if (!removed)
      newArray.push(p);
  }

  this.controlPoints = newArray;

  if (this.selectedPoints.length > 0)
  {
    for (var i in this.selectedPoints)
      this.selectedPoints[i].selected = false;

    if (this.controlPoints.length > 0)
    {
      this.selectedPoints = [this.controlPoints[this.controlPoints.length - 1]];
      this.controlPoints[this.controlPoints.length - 1].selected = true;
    }
    else
      this.selectedPoints = [];
  }

  this.ResetKnots();
  this.CalculateCurve();
}

Graph.prototype.SelectControlPoint = function(x, y, add)
{
  if (!add)
  {
    for (var i in this.selectedPoints)
      this.selectedPoints[i].selected = false;
    this.selectedPoints = [];
  }

  var selected = false;
  for (var i in this.controlPoints)
  {
    var p = this.controlPoints[i];
    var dist = Math.sqrt((p.x - x) * (p.x - x) + (p.y - y) * (p.y - y));
    if (dist < this.controlPointRadius)
    {
      this.selectedPoints.push(p);
      p.selected = true;
      selected = true;
      break;
    }
  }

  if (!selected)
  {
    for (var i in this.selectedPoints)
      this.selectedPoints[i].selected = false;
    this.selectedPoints = [];
    return false;
  }

  return true;
}

Graph.prototype.MoveSelectedPoints = function(x, y)
{
  for (var i in this.selectedPoints)
  {
    //this.selectedPoints[i].x += x;
    this.selectedPoints[i].y += y;
	
	let newY = pointGrapher.ScreenToValueY(this.selectedPoints[i].y);
	newY = Math.max(Math.min(newY, 3), -3);
	this.selectedPoints[i].y = pointGrapher.ValueToScreenCoordY(newY);
  }

  this.CalculateCurve();
}

Graph.prototype.Draw = function()
{
  JSGraphics.Clear();

  // Draw graph
  JSGraphics.GraphPoints(this.controlPoints, controlPointLineColor, controlPointLineWidth, true, controlPointColor, controlPointSelectedColor, controlPointRadius);
  JSGraphics.GraphPoints(this.curvePoints, curvePointLineColor, curvePointLineWidth, false);

  // Draw shells if enabled for this func
  var func = this.curveFunctions[document.getElementById('ui-curve-function').value];
  if (func.shellsEnabled == undefined || func.shellsEnabled == true)
    for (var i = 0; i < this.shellPoints.length; ++i)
      JSGraphics.GraphPoints(this.shellPoints[i], shellPointLineColor, shellPointLineWidth, true, shellPointColor, shellPointColor, shellPointRadius);

  // Calculate t pos
  var tX = 0;
  var tY = 0;
  var numPoints = this.curvePoints.length;
  var tIndexA = Math.floor(numPoints * this.currentT);
  var tIndexB = Math.ceil(numPoints * this.currentT);
  if (tIndexA >= numPoints)
    return;
  if (tIndexB >= numPoints)
    tIndexB = tIndexA;
  var pA = this.curvePoints[tIndexA];
  var pB = this.curvePoints[tIndexB];
  tX = (1 - this.currentT) * pA.x + this.currentT * pB.x;
  tY = (1 - this.currentT) * pA.y + this.currentT * pB.y;

  // Draw T value
  JSGraphics.context.fillStyle = tPointColor;
  JSGraphics.context.beginPath();
  JSGraphics.context.arc(tX, tY, tPointRadius, 0, 2 * Math.PI);
  JSGraphics.context.fill();
  JSGraphics.context.closePath();
}

Graph.prototype.RebuildUI = function()
{
  $("#ui").remove();

  var ui = "<div id='ui'>";

  // Curve function box
  ui += "Curve Function: <select id='ui-curve-function' class='ui-item'>";
  for (var i in this.curveFunctions)
    ui += "<option>" + i + "</option>";
  ui += "</select>";

  // Iterations control
  if (iterationSliderEnabled)
  {
    ui += "<div class='ui-item'>";
    ui += "<div id='ui-iterations-count'>Iterations: " + this.numIterations + "</div>";
    ui += "<input id='ui-iterations' type='range' name='Iterations' min='" +
          this.minIterations + "' max='" + this.maxIterations + "' value='" + this.numIterations + "'></input>";
    ui += "</div>"
  }
  
	// Degree control
  ui += "<div class='ui-item'>";
  ui += "<div id='ui-degree-value'>Degree: " + this.degree + "</div>";
  ui += "<input id='ui-degree' type='range' name='Degree' min='1' max='80' step='1' value='" + this.degree + "'></input>";
  ui += "</div>"
  
  /*
  // T control
  ui += "<div class='ui-item'>";
  ui += "<div id='ui-t-value'>T: " + this.currentT + "</div>";
  // ui += "<div id='ui-t-value'>T</div>";
  ui += "<input id='ui-t' type='range' name='T' min='0.0' max='1.0' step='0.01' value='" + this.currentT + "'></input>";
  ui += "</div>"

  // Knot input in case you are feeling "knotty" - Grant Wynn
  ui += "<div class='ui-item'>";
  ui += "<div>Knot Sequence</div>";
  ui += "<input id='ui-knot-input'></input>";
  ui += "</div>";

  // Control point count
  ui += "<div class='ui-item' id='ui-control-points'>";
  ui += "Control Points: " + this.controlPoints.length;
  ui += "</div>"
  */

  // Some instructions
  ui += "<div class='ui-item'>Left Click: Place or select control point </div>";
  ui += "<div class='ui-item'>Left Click & Drag: Drag selected control point</div>";
  ui += "<div class='ui-item'>Backspace: Delete selected control point</div>";
  ui += "<div class='ui-item'><button id='ui-save'>Save Control Points</button></div>";

  ui += "</div>";

  $(ui).appendTo($("body"));
  $('#ui').css({
      "position": "absolute",
      "top": "10px",
      "left": "10px",
      "background-color": "rgb(40, 40, 40)",
      "width": "180px",
      "padding": "10px",
      "font-size": "12px",
      "color": "rgb(120, 120, 120)",
  });
  $('.ui-item').css({
      "padding-top": "10px",
  });

  $('#ui-save').click(function()
  {
      pointGrapher.WriteControlPoints(that.controlPoints);
  });

  // Set selected function
  $("#ui-curve-function").val(this.curveFunctionName);

  var that = this;
  $('#ui-curve-function').change(function()
  {
    that.ResetKnots();
    that.CalculateCurve();
    that.Draw();
    that.RebuildUI();
  });
  if (iterationSliderEnabled)
  {
    $('#ui-iterations').change(function()
    {
      var val = $("#ui-iterations").val();
      that.numIterations = val;
      $("#ui-iterations-count").text("Iterations: " + that.numIterations);
      that.CalculateCurve();
      that.Draw();
    });
  }
  
  $('#ui-degree').change(function()
  {
    var val = $("#ui-degree").val();
    that.degree = val;
    $("#ui-degree-value").text("Degree: " + that.degree);
    //that.CalculateCurve();
	pointGrapher.SetControlPoints(that.degree);
    that.Draw();
  });
  
  
  /*
  $('#ui-t').change(function()
  {
    var val = $("#ui-t").val();
    that.currentT = val;
    $("#ui-t-value").text("T: " + that.currentT);
    that.CalculateCurve();
    that.Draw();
  });
  */
  /*
  $('#ui-knot-input').change(function()
  {
    // Convert the text into an array of numbers
    var inputText = $(this).val();
    for (var i = 0; i < inputText.length; ++i)
    {
      inputText = inputText.replace(", ", " ");
      inputText = inputText.replace(",", " ");
      inputText = inputText.replace("  ", " ");
    }
    var inputArray = inputText.split(" ");
    for (var i in inputArray)
      inputArray[i] = parseInt(inputArray[i]);
    for (var i in inputArray)
      if (isNaN(inputArray[i]))
        inputArray.splice(i, 1);

    // Validate knot sequence
    if (inputArray.length > that.controlPoints.length + that.degree + 1)
      return;

    // Add knots
    that.knots = [];
    for (var i in inputArray)
      that.knots.push(inputArray[i]);

    for (var i = that.knots.length; i < (that.controlPoints.length + that.degree + 1); ++i)
      that.knots.push(i - that.degree);

    $(this).val(that.knots.join(" "));

    that.CalculateCurve();
    that.Draw();
  });
  */
  this.ResetKnots();
};

function PlacePoint()
{
  JSGraph.AddControlPoint(mouseX, mouseY);
  JSGraph.Draw();
}

function RemovePoint()
{
  JSGraph.RemoveControlPoint(mouseX, mouseY);
  JSGraph.Draw()
}

function SelectPoint()
{
  let selected = JSGraph.SelectControlPoint(mouseX, mouseY);
  JSGraph.Draw();
  return selected;
}

function MovePoints(x, y)
{
  JSGraph.MoveSelectedPoints(x, y);
  JSGraph.Draw();
}

function GetMousePos(event)
{
  mouseX = event.clientX - event.target.offsetLeft;
  mouseY = event.clientY - event.target.offsetTop;
}

function StopEventPropagation(e)
{
  if (!e)
    e = window.event;

  //IE9 & Other Browsers
  if (e.stopPropagation)
  {
    e.stopPropagation();
  }
  //IE8 and Lower
  else
  {
    e.cancelBubble = true;
  }
}