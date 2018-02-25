JSGraphics = 0;

function Graphics()
{
  JSGraphics = this;

  // Canvases
  this.canvas = document.createElement('canvas');

  // Context
  this.context = this.canvas.getContext('2d');

  // Canvas size
  this.canvas.width = 800;
  this.canvas.height = 600;
  
  this.gridInfo = {
	  top: 30,
	  bottom: 570,
	  left: 50,
	  right: 750
  };
  this.gridInfo.height = this.gridInfo.bottom - this.gridInfo.top;
  this.gridInfo.width = this.gridInfo.right - this.gridInfo.left;

  // Center front canvas
  $(this.canvas).css("margin-left", "auto");
  $(this.canvas).css("margin-right", "auto");
  $(this.canvas).css("display", "block");
  
  // Add the main canvas
  document.body.appendChild(this.canvas);

  let textArea = document.createElement('textarea');
    textArea.setAttribute('id', 'ui-textarea');
    textArea.setAttribute('rows', 20);
    textArea.setAttribute('cols', 100);

    $(textArea).css("margin-left", "auto");
    $(textArea).css("margin-right", "auto");
    $(textArea).css("display", "block");
  document.body.appendChild(textArea);
}

Graphics.prototype.Clear = function()
{
  // Clear
  this.context.fillStyle = clearColor;
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
  this.DrawGridLines();
}

Graphics.prototype.GraphPoints = function(points, lineColor, lineThickness, drawPoints, pointColor, selectedPointColor, pointRadius)
{
  if (points.length == 0)
    return;

  // Draw lines
  this.context.lineWidth = lineThickness;
  this.context.strokeStyle = lineColor;

  this.context.beginPath();
  this.context.moveTo(points[0].x, points[0].y);
  for (var i = 0; i < points.length; ++i)
  {
    if (i < points.length - 1)
      this.context.lineTo(points[i + 1].x, points[i + 1].y);
  }
  this.context.stroke();
  this.context.closePath();

  // Draw the points
  if (drawPoints == true)
  {
    for (var i = 0; i < points.length; ++i)
    {
      if (points[i].selected == true)
        this.context.fillStyle = selectedPointColor;
      else
        this.context.fillStyle = pointColor;
      this.context.beginPath();
      this.context.arc(points[i].x, points[i].y, pointRadius, 0, 2 * Math.PI);
      this.context.fill();
      this.context.closePath();
    }
  }
}

Graphics.prototype.DrawGridLines = function() {
	let prevLineWidth = this.context.lineWidth;
	this.context.lineWidth = 1;
	
	let halfHeight = this.canvas.height / 2;
	
	this.DrawLine(40, halfHeight, 750, halfHeight, '#AA88FF');
	this.DrawLine(50, 0, 50, this.canvas.height, '#AA88FF');
	
	let y = [30, 120, 210, 390, 480, 570];
	for(let i = 0; i < y.length; i++) {
		this.DrawLine(40, y[i], 60, y[i], '#AA88FF');	
	}
	
	this.DrawLine(750, halfHeight - 10, 750, halfHeight + 10, '#AA88FF');
	this.DrawText(746, halfHeight + 25, "1", '#9966FF');
	
	for(let i = -3; i <= 3; i++) {
		this.DrawText(15, 35 + (90 * (-i + 3)), i, '#9966FF');
	}
	this.context.lineWidth = prevLineWidth;
}

Graphics.prototype.DrawLine = function(sX, sY, eX, eY, color) {
	this.context.beginPath();
	this.context.moveTo(sX, sY);
	this.context.lineTo(eX, eY);
	this.context.strokeStyle = color;
	this.context.stroke();
	this.context.closePath();
}

Graphics.prototype.DrawText = function(x, y, message, color) {
	this.context.font = "12px Verdana";
	this.context.fillStyle = color;
	this.context.fillText(message, x, y);	
}