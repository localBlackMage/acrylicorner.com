mouseX = 0;
mouseY = 0;
mouseDown = false;

let pointGrapher = null;

function main() {
	// Create engine
	var engine = new Engine();

	// Create graphics
	var graphics = new Graphics();

	// Create graph
	var graph = new Graph();

	pointGrapher = new PointGrapher();

	// Clear screen
	graphics.Clear();
	JSGraphics.DrawGridLines();

	// Add curve functions here
	JSGraph.AddCurveFunction("NLI", NLICurve, 50, 100, false);
	JSGraph.AddCurveFunction("BB Form", BBFCurve, 50, 100, false);

	pointGrapher.SetCurvePoints();
	pointGrapher.SetControlPoints(1);

	// JSGraph.SetShellFunction(Shells);
	// JSGraph.SetKnotFunction(Knots);
}
