(function(name, definition) {
    if (typeof define === 'function') {
        // define for AMD:
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // exports for Node.js
        module.exports = definition();
    } else {
        // using the module in the browser:
        var theModule = definition(),
        global = this,
        old = global[name];
        theModule.noConflict = function() {
            global[name] = old;
            return theModule;
        };
        global[name] = theModule;
    }
})('textMeasure', function() {

    var ceil = Math.ceil;

    var measureElementDimension = function(node) {
        var compStyles = window.getComputedStyle(node, null);

        var width = parseFloat(compStyles.getPropertyValue('width'));
        width += parseFloat(compStyles.getPropertyValue('margin-left'));
        width += parseFloat(compStyles.getPropertyValue('margin-right'));

        var height = parseFloat(compStyles.getPropertyValue('height'));
        height += parseFloat(compStyles.getPropertyValue('margin-top'));
        height += parseFloat(compStyles.getPropertyValue('margin-bottom'));

        return {
            width: ceil(width),
            height: ceil(height),
        };
    };
    var createElement = function(className, styles) {
        var el = document.createElement('div');
        el.className = className || '';
        el.style.cssText = styles || '';
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
        wordsCount: function(str) {
            return this.words(str).length;
        },
        words: function(str) {
            return str.split(' ');
        },
        longestWord: function(str, elementClass, containerClass, unit) {
            var words = this.words(str);
            var savedWidth = 0;
            var savedIndex = 0;
            words.forEach(function(word, index) {
                var width = this.getDimension(word,'auto', 'auto', elementClass, containerClass, unit).width;
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
        getDimension: function(html, maxWidth, maxHeight, elementClass, containerClass, unit) {
            // base variables:
            var useUnit     = unit || 'px';
            var returnObj = {};

            // the container to append the element on:
            var container = createElement(
                containerClass,
                baseStyles +
                    'max-width:' + (isNaN(maxWidth) ? maxWidth : maxWidth + useUnit) + ';' +
                    'max-height:' + (isNaN(maxHeight) ? maxHeight : maxHeight + useUnit) + ';'
            );

            // the element to render text in:
            var element = createElement(
                elementClass,
                baseElementStyles
            );
            element.innerHTML = html;

            // append Elements to dom:
            container.appendChild(element);
            rootEl.appendChild(container);

            var compStyles = measureElementDimension(element);
            returnObj.width = compStyles.width;
            returnObj.height = compStyles.height;

            returnObj.overflow = returnObj.height > maxHeight || returnObj.width > maxWidth;

            // remove child from measure element.
            destroyElement(rootEl, container);

            return returnObj;
        }
    };
});
