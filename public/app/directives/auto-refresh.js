angular
    .module('MainApplicationModule')
    .directive('autoRefresh', ['$interval', function ($interval) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var imageElement;
                $interval(function() {
                    element.html("");
                    imageElement = document.createElement('img');
                    imageElement.setAttribute('src', '/video/frame?random=' + new Date())
                    element.append(imageElement);
                }, 1000);
            }
        };
    }]);
