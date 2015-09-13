angular
    .module('MainApplicationModule')
    .directive('autoRefresh', ['$interval', function ($interval) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var interval;

                function setRefresh() {
                  interval = $interval(function() {
                      element[0].setAttribute('src', '/video/frame?random=' + new Date())
                  }, attrs.autoRefresh);

                };

                attrs.$observe("autoRefresh", function(target,o) {
                    if (interval) {
                        inteval.cancel();
                    }
                    setRefresh();
                });

            }
        };
    }]);
