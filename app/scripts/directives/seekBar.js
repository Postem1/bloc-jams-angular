(function() {
    function seekBar($document) {
        //Calculates the horizontal percent along the seek bar where the
        //event (passed in from the view as  $event) occurred.
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
                offsetXPercent = Math.max(0, offsetXPercent);
                offsetXPercent = Math.min(1, offsetXPercent);
                return offsetXPercent;
        };
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace:    true,
            restrict:   'E',
            scope:  {},
            link:   function(scope, element, attributes){
                scope.value = 0;
                scope.max = 100;

                //Holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it.
                var seekBar = $(element);

                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                        return percent + "%";
                };

                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                //Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };

                //uses $apply to constantly apply the change in value of  scope.value as the user drags the seek bar thumb.
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                                scope.value = percent * scope.max;
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
