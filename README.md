# Text Measure
this is a module in js to meausure text in the browser. To measure text it will render a hidden DOM Element.

### fitDimension
trys to fit the dimension into a given format. it will return a object like

````
var textMeasure = require('textMeasure');
textMeasure.fitDimension(string, maxWidth, maxHeight)

// returns
{
    fit: true,
    width: Number,
    height: Number
}

````
