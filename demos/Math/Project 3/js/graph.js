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

  this.shellFunctions = {};

  // Function to draw shells
  this.shellFunction = function(){};

  // Distance from which a control point can be selected
  this.controlPointRadius = 15;

  // Number of iterations for algorithms to perform
  this.minIterations = 0;
  this.maxIterations = 10;
  this.numIterations = this.minIterations + ((this.maxIterations - this.minIterations) * curveDefaultIterations);

  // Degree value for relevant curves (DeBoor)
  this.degree = 0;

  // Current T value being displayed
  this.currentT = 0.5;

  this.RebuildUI();

  // Handle placing a point
  $("body").keydown(function(event)
  {
      let src = (event.srcElement || event.target);
      let isInput = $(src).is("input");
      // Delete removes a point
      if (event.keyCode === 8 && !isInput)
      {
        StopEventPropagation(event);
        RemovePoint();
        return false;
      }
      if (event.keyCode === 77 && !isInput) {
          StopEventPropagation(event);
          JSGraph.CalculateCurve();
          JSGraph.Draw();
          return false;
      }
  });

  // Handle selecting a point
  $(JSGraphics.canvas).mousedown(function(event)
  {
    GetMousePos(event);
    mouseDown = true;
    let selected = SelectPoint();
    event.stopPropagation();

    if (!selected)
    {
      StopEventPropagation(event);
      PlacePoint();
      return false;
    }
  });

  JSGraphics.canvas.addEventListener("mousemove", function(event)
  {
    let oldMouseX = mouseX;
    let oldMouseY = mouseY;
    GetMousePos(event);

    let deltaX = mouseX - oldMouseX;
    let deltaY = mouseY - oldMouseY;

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
  this.curveFunctionName = document.getElementById('ui-curve-function').value;
  let func = this.curveFunctions[this.curveFunctionName];
  let shellFunc = this.shellFunctions[this.curveFunctionName];
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
    pointGrapher.SetCurvePoints();
  this.shellPoints = [];
  if (this.controlPoints.length > 0)
    func(this.controlPoints, this.curvePoints);

  if (shellFunc)
    shellFunc(this.controlPoints, this.shellPoints, this.currentT);
};

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
};

Graph.prototype.AddCurveFunction = function(name, func, minIterations, maxIterations, shellsEnabled, shellFunc)
{
  func.minIterations = minIterations;
  func.maxIterations = maxIterations;
  func.shellsEnabled = shellsEnabled;
  this.curveFunctions[name] = func;
  this.shellFunctions[name] = shellFunc;
  this.RebuildUI();
};
	
Graph.prototype.SetShellFunction = function(func) {
  this.shellFunction = func;
};

Graph.prototype.ResetShellFunction = function() {
    this.shellFunction = function(){};
};

Graph.prototype.SetKnotFunction = function(func) {
  this.knotFunction = func;
};

Graph.prototype.AddControlPoint = function(x, y)
{
	if (this.selectedPoints.length === 1 && this.selectedPoints[0] === this.controlPoints[0])
		this.controlPoints.unshift({x: x, y: y, selected: false});
	else
		this.controlPoints.push({x: x, y: y, selected: false});

	this.degree++;
	pointGrapher.SetDegree(this.degree - 1);
	pointGrapher.SetCurvePoints();
  //this.ResetKnots();
  this.CalculateCurve();
};

Graph.prototype.ResetControlPoints = function() {
	this.controlPoints = [];
};

Graph.prototype.RemoveControlPoint = function(x, y)
{
  let newArray = [];
  for (let i = 0; i <  this.controlPoints.length; ++i)
  {
    let p = this.controlPoints[i];
    let removed = false;
    for (let j = 0; j < this.selectedPoints.length; ++j) {
      if (p === this.selectedPoints[j]) removed = true;
    }

    if (!removed) newArray.push(p);
  }

  this.controlPoints = newArray;

  if (this.selectedPoints.length > 0)
  {
    for (let i in this.selectedPoints)
      this.selectedPoints[i].selected = false;

    if (this.controlPoints.length > 0)
    {
      this.selectedPoints = [this.controlPoints[this.controlPoints.length - 1]];
      this.controlPoints[this.controlPoints.length - 1].selected = true;
    }
    else
      this.selectedPoints = [];
  }
  this.degree--;
  pointGrapher.SetDegree(this.degree - 1);
  this.ResetKnots();
  this.CalculateCurve();
};

Graph.prototype.SelectControlPoint = function(x, y, add)
{
  if (!add)
  {
    for (let i in this.selectedPoints)
      this.selectedPoints[i].selected = false;
    this.selectedPoints = [];
  }

  let selected = false;
  for (let i in this.controlPoints)
  {
    let p = this.controlPoints[i];
    let dist = Math.sqrt((p.x - x) * (p.x - x) + (p.y - y) * (p.y - y));
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
    for (let i in this.selectedPoints)
      this.selectedPoints[i].selected = false;
    this.selectedPoints = [];
    return false;
  }

  return true;
};

Graph.prototype.MoveSelectedPoints = function(x, y)
{
  for (let i in this.selectedPoints) {
    this.selectedPoints[i].x += x;
    this.selectedPoints[i].y += y;
  }

  this.CalculateCurve();
};

Graph.prototype.Draw = function()
{
  JSGraphics.Clear();

  // Draw graph
  JSGraphics.GraphPoints(this.controlPoints, controlPointLineColor, controlPointLineWidth, true, controlPointColor, controlPointSelectedColor, controlPointRadius);
  JSGraphics.GraphPoints(this.curvePoints, curvePointLineColor, curvePointLineWidth, false);

  // Draw shells if enabled for this func
  let func = this.curveFunctions[document.getElementById('ui-curve-function').value];
  if (func.shellsEnabled === undefined || func.shellsEnabled === true)
    for (let i = 0; i < this.shellPoints.length; ++i)
      JSGraphics.GraphPoints(this.shellPoints[i], shellPointLineColor, shellPointLineWidth, true, shellPointColor, shellPointColor, shellPointRadius);

  // Calculate t pos
  let tX = 0;
  let tY = 0;
  let numPoints = this.curvePoints.length;
  let tIndexA = Math.floor(numPoints * this.currentT);
  let tIndexB = Math.ceil(numPoints * this.currentT);
  if (tIndexA >= numPoints)
    return;
  if (tIndexB >= numPoints)
    tIndexB = tIndexA;
  let pA = this.curvePoints[tIndexA];
  let pB = this.curvePoints[tIndexB];
  tX = (1 - this.currentT) * pA.x + this.currentT * pB.x;
  tY = (1 - this.currentT) * pA.y + this.currentT * pB.y;

  // Draw T value
  JSGraphics.context.fillStyle = tPointColor;
  JSGraphics.context.beginPath();
  JSGraphics.context.arc(tX, tY, tPointRadius, 0, 2 * Math.PI);
  JSGraphics.context.fill();
  JSGraphics.context.closePath();
};

Graph.prototype.RebuildUI = function()
{
  $("#ui").remove();

  let ui = "<div id='ui'>";

  // Curve function box
  ui += "Curve Function: <select id='ui-curve-function' class='ui-item'>";
  for (let i in this.curveFunctions)
    ui += "<option>" + i + "</option>";
  ui += "</select>";

  // Iterations control
  if (iterationSliderEnabled) {
      ui += "<div class='ui-item'>";
      ui += "<div id='ui-iterations-count'>Iterations: " + this.numIterations + "</div>";
      ui += "<input id='ui-iterations' type='range' name='Iterations' min='" +
          this.minIterations + "' max='" + this.maxIterations + "' value='" + this.numIterations + "'></input>";
      ui += "</div>"
  }

  // T control
  ui += "<div class='ui-item'>";
  ui += "<div id='ui-t-value'>T: " + this.currentT + "</div>";
  ui += "<input id='ui-t' type='range' name='T' min='0.0' max='1.0' step='0.01' value='" + this.currentT + "'></input>";
  ui += "</div>";

    // Depth control
    ui += "<div class='ui-item'>";
    ui += "<div id='ui-depth-value'>Max Depth: " + pointGrapher.maxDepth + "</div>";
    ui += "<input id='ui-depth' type='range' name='Depth' min='1' max='10' step='1' value='" + pointGrapher.maxDepth + "'></input>";
    ui += "</div>";

  /*
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

  ui += "</div>"

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

  // Set selected function
  $("#ui-curve-function").val(this.curveFunctionName);

  let that = this;
  $('#ui-curve-function').change(function()
  {
    //that.ResetKnots();
    that.CalculateCurve();
    that.Draw();
    that.RebuildUI();
  });
  if (iterationSliderEnabled)
  {
    $('#ui-iterations').change(function()
    {
      that.numIterations = $("#ui-iterations").val();
      $("#ui-iterations-count").text("Iterations: " + that.numIterations);
      that.CalculateCurve();
      that.Draw();
    });
  }

  let uiTUpdateFunc = function() {
      that.currentT = $("#ui-t").val();
      $("#ui-t-value").text("T: " + that.currentT);
      that.CalculateCurve();
      that.Draw();
  };

  $('#ui-t').change(uiTUpdateFunc);
  $('#ui-t').on("input", uiTUpdateFunc);

  let uiMaxDepthUpdateFunc = function() {
      pointGrapher.SetMaxDepth($("#ui-depth").val());
      $("#ui-depth-value").text("Max Depth: " + pointGrapher.maxDepth);
      that.CalculateCurve();
      that.Draw();
  };

    $('#ui-depth').change(uiMaxDepthUpdateFunc);

  /*
  $('#ui-knot-input').change(function()
  {
    // Convert the text into an array of numbers
    let inputText = $(this).val();
    for (let i = 0; i < inputText.length; ++i)
    {
      inputText = inputText.replace(", ", " ");
      inputText = inputText.replace(",", " ");
      inputText = inputText.replace("  ", " ");
    }
    let inputArray = inputText.split(" ");
    for (let i in inputArray)
      inputArray[i] = parseInt(inputArray[i]);
    for (let i in inputArray)
      if (isNaN(inputArray[i]))
        inputArray.splice(i, 1);

    // Validate knot sequence
    if (inputArray.length > that.controlPoints.length + that.degree + 1)
      return;

    // Add knots
    that.knots = [];
    for (let i in inputArray)
      that.knots.push(inputArray[i]);

    for (let i = that.knots.length; i < (that.controlPoints.length + that.degree + 1); ++i)
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