/**
*   Text Measure
*   Author: Leif Marcus
*   version: 1.0
*   Licenze: MIT
*/
(function(name, definition) {
    if (typeof define === 'function') {
        // define for AMD:
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // exports for Node.js
        module.exports = definition();
    } else {
        // using the module in the browser:
        var curModule = definition(),
        global = this,
        originalModule = global[name];
        curModule.noConflict = function() {
            global[name] = originalModule;
            return curModule;
        };
        global[name] = curModule;
    }
} ('textMeasure', function() {

    var ceil = Math.ceil;
    var checkWidth = ['width', 'margin-left', 'margin-right', 'padding-left', 'padding-right'];
    var checkHeight = ['height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'];

    /**
    *   adds calculated style values together
    *   @param {object} compStyles - a CSSStyleDeclaration Object
    *   @param {array} arr - a list of css properties to go through
    *   @returns {number} returns the sum of all property values.
    */
    var addValues = function(compStyles, arr) {
        var curr = 0;
        for (var i = arr.length - 1; i >= 0; i--) {
            curr += parseFloat(compStyles.getPropertyValue(arr[i]));
        }
        return curr;
    };
    /**
    *   measures the dimension of a dom element
    *   @param {object} node - the html element object (DOMNode)
    *   @returns {object} calculated width and height of the node
    */
    var measureElementDimension = function(node) {
        var compStyles = getComputedStyle(node, null);
        var width = addValues(compStyles, checkWidth);
        var height = addValues(compStyles, checkHeight);

        return {
            width: ceil(width),
            height: ceil(height),
        };
    };
    /**
    *   creates a dom node
    *   @param {string} className - a classname to append to the element
    *   @param {string} styles - style rules for the style attribute
    *   @param {string} html - some html to append to the element
    *   @returns {object} calculated width and height of the node
    */
    var createElement = function(className, styles, html) {
        var el = document.createElement('div');
        el.className = className || '';
        el.style.cssText = styles || '';
        if (html) { el.innerHTML = html; }
        return el;
    };
    var destroyElement = function(parent, child) {
        parent.removeChild(child);
    };

    var rootEl = document.getElementsByTagName('body')[0];
    var baseStyles = 'position:absolute !important;top:-9999px !important;' +
                     'left:-9999px !important;visibility:hidden; !important;';
    var baseElementStyles = 'display:inline-block !important;';


    return {
        /**
        *   counts the words of a given string
        *   @param {string} str - the string that should be analysed
        *   @returns {number} word count
        */
        wordsCount: function(str) {
            return this.words(str).length;
        },
        /**
        *   creates an array with all words
        *   @param {string} str - the string that should be analysed
        *   @returns {array} words in an array
        */
        words: function(str) {
            return str.split(' ');
        },
        /**
        *   gets the Word with the longest Width
        *   @param {string} str - the string that should be analysed
        *   @param {string} elementClass - optional
        *   @param {string} containerClass - optional
        *   @returns {object} the word and the width of it.
        */
        longestWord: function(str, elementClass, containerClass) {
            var words = this.words(str);
            var savedWidth = 0;
            var savedIndex = 0;
            words.forEach(function(word, index) {
                var width = this.getDimension(
                    word,
                    'auto',
                    'auto',
                    elementClass,
                    containerClass
                ).width;

                if (width > savedWidth) {
                    savedWidth = width;
                    savedIndex = index;
                }
            }, this);
            return {
                word: words[savedIndex],
                width: savedWidth
            };
        },
        /**
        *   gets a dimension of an element with text inside
        *   by a given max dimension
        *   @param {string} html - a string or html string
        *   @param {number|string} maxWidth - max width of the container
        *   @param {number|string} maxHeight - max height of the container
        *   @param {string} [elementClass] - class for the element
        *   @param {string} [containerClass] - class for the container
        *   @returns {object} width and height of the text and text overflow
        */
        getDimension: function(html, maxWidth, maxHeight, elementClass, containerClass) {
            // base variables:

            // the container to append the element on:
            var container = createElement(
                containerClass,
                baseStyles +
                    'max-width:' + (isNaN(maxWidth) ? maxWidth : maxWidth + 'px') + ';' +
                    'max-height:' + (isNaN(maxHeight) ? maxHeight : maxHeight + 'px') + ';'
            );

            // the element to render text in:
            var element = createElement(
                elementClass,
                baseElementStyles,
                html
            );

            // append Elements to dom:
            container.appendChild(element);
            rootEl.appendChild(container);

            var compStyles = measureElementDimension(element);

            // remove child from measure element.
            destroyElement(rootEl, container);

            return {
                width: compStyles.width,
                height: compStyles.height,
                overflow: compStyles.height > maxHeight ||
                          compStyles.width > maxWidth
            };
        }
    };
}));
