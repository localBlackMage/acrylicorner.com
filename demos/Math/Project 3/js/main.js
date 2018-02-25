mouseX = 0;
mouseY = 0;
mouseDown = false;

let pointGrapher = null;

function main() {
    pointGrapher = new PointGrapher();

	// Create engine
    let engine = new Engine();

	// Create graphics
    let graphics = new Graphics();

	// Create graph
	let graph = new Graph();



	// Clear screen
	graphics.Clear();

	// Add curve functions here


    // JSGraph.AddCurveFunction("BB Form", BBFCurve, 50, 100, false);
    // JSGraph.AddCurveFunction("NLI", NLICurve, 50, 100, true, NLIShell);
    // JSGraph.AddCurveFunction("MPI", MPSDCurve, 50, 100, false);

    JSGraph.AddCurveFunction("Polynomial Interpolation Curves", PolyInterpCurve, 50, 100, false);
}
