# Text Measure
This is a Javascript utility to measure text in the browser. It will render a hidden DOM element with the html and measure the width and height of the text.

### wordsCount
Returns the amount of words the text has.

### longestWord
The longest word is important as it is the minimal width of the text element. Especially for headlines where some might not want to have hyphenated words.
Here it is not enough to just count the letter of a word, because some letters are narrower than others. Therefore each word needs to be rendered to the DOM.

```Javascript
var textMeasure = require('textMeasure');
textMeasure.longestWord('this is a nice text.', 'element', 'container');

// returns
{
	word: 'this',
	width: <width in px>
}

```

### words
The words method will split the text into an array. This might help to get the word length of the text and also find out which word is the longest.

```Javascript
var textMeasure = require('textMeasure');
textMeasure.words('this is a nice text.');

// returns
[ 'this', 'is', 'a', 'nice', 'text.' ]
```


### getDimension
Calculates the width and height of a given HTML. Some textboxes might have different styling of text in it or even paragraphs. This is why the styling is important for the measurement of the text. It is also important to set a width and a height because Text will not break automatically in the browser if the element has no width.

```Javascript
var textMeasure = require('textMeasure');
textMeasure.getDimension(
	'<p>this is a <b>paragraph</b></p>',
	300, 200,
	'element-class',
	'container-class'
);

// returns
{
	width: <number>,
	height: <number>,
	overflow: true/false
}
```

## Performance Issues
Some styles seams to have more impact on the rendering of the text in the browser. For example, text with a set `letter-spacing` property will take longer to calculate.
