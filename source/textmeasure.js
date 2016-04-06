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

    var exception = function(message) {
        return 'Module textMeasure:' + message;
    };
    var rootEl = document.getElementsByTagName('body')[0];
    var baseStyles = 'position:absolute !important;top:-9999px !important;' +
                     'left:-9999px !important;visibility:hidden; !important';
    var baseElementStyles = 'display:inline-block !important;';

    return {
        fitDimension: function(string, maxWidth, maxHeight, elementClass, containerClass, unit) {
            if (isNaN(maxWidth) || isNaN(maxHeight)) {
                throw exception("Please add maxWidth and maxHeight to make this work");
            }
            var t0 = performance.now();

            // base variables:
            var useUnit     = unit || 'px';
            var returnObj = { fit: true };

            // the container to append the element on:
            var container = document.createElement('div');
            container.className = containerClass || '';
            container.style.cssText = baseStyles + 'max-width:' + maxWidth + 'px;' +
                    'max-height:' + maxHeight + 'px';

            // the element to render text in:
            var element = document.createElement('div');
            element.style.cssText = baseElementStyles;
            element.className = elementClass || '';
            element.innerHTML = string;

            // append Elements to dom:
            container.appendChild(element);
            rootEl.appendChild(container);

            var compStyles = window.getComputedStyle(element, null);
            returnObj.width = Math.round(parseFloat(compStyles.width) +
                              parseFloat(compStyles['margin-left']) +
                              parseFloat(compStyles['margin-right']) );
            returnObj.height = Math.round(parseFloat(compStyles.height) +
                              parseFloat(compStyles['margin-top']) +
                              parseFloat(compStyles['margin-bottom']) );

            // remove child from measure element.
            rootEl.removeChild(container);

            var t1 = performance.now();
            console.log("string.fitDimension takes", (t1 - t0), "ms");
            return returnObj;
        }
    };
});
