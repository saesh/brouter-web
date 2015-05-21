BR.OpacitySlider = L.Control.extend({
	  options: {
        position: 'topleft',
        callback: function(opacity) {}
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar control-slider'),
            input = $('<input id="slider" type="text"/>'),
            item = localStorage.opacitySliderValue,
            value = item ? parseInt(item) : 100;

        var stopClickAfterSlide = function(evt) {
            L.DomEvent.stop(evt);
            removeStopClickListeners();
        };
        var removeStopClickListeners = function() {
            document.removeEventListener('click', stopClickAfterSlide, true);
            document.removeEventListener('mousedown', removeStopClickListeners, true);
        };

        $(container).html(input);
        $(container).attr('title', 'Set transparency of route track and markers');

        input.slider({
            min: 0,
            max: 100,
            step: 1,
            value: value,
            orientation: 'vertical',
            reversed : true,
            selection: 'before', // inverted, serves as track style, see css
            tooltip: 'hide'
        }).on('slide slideStop', { self: this }, function (evt) {
            evt.data.self.options.callback(evt.value / 100);
        }).on('slideStop', function (evt) {
            localStorage.opacitySliderValue = evt.value;

            // When dragging outside slider and over map, click event after mouseup
            // adds marker when active on Chromium. So disable click (not needed) 
            // once after sliding.
            document.addEventListener('click', stopClickAfterSlide, true);
            // Firefox does not fire click event in this case, so make sure stop listener
            // is always removed on next mousedown.
            document.addEventListener('mousedown', removeStopClickListeners, true);
        });

        this.options.callback(value / 100);

        return container;
    }
});
