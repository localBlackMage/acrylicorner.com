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

  // Center front canvas
  $(this.canvas).css("margin-left", "auto");
  $(this.canvas).css("margin-right", "auto");
  $(this.canvas).css("display", "block");
  
  // Add the main canvas
  document.body.appendChild(this.canvas);
}

Graphics.prototype.Clear = function()
{
  // Clear
  this.context.fillStyle = clearColor;
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
  //this.DrawGridLines();
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
