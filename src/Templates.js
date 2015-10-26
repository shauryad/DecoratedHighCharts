angular.module("DecoratedHighCharts").run(["$templateCache", function($templateCache) {$templateCache.put("DecoratedHighCharts.html","<div class=\"root\" style=\"position: relative\">\r\n    <div class=\"control flex-main-container\"\r\n         ng-init=\"showSecurityControl = false; showIndicatorControl = false; showBenchmarkControl = false;\">\r\n        <span class=\"flex-sub-container-left\">\r\n            <span ng-if=\"chartProperties.type === \'Scattered Plot\'\">\r\n                <span class=\"restrict-dropdown-menu\">\r\n                    <label>X:</label>\r\n                    <input type=\"text\" ng-model=\"chartProperties.x_attribute\" class=\"form-control\"\r\n                           style=\"width: 12em; display: inline; height:25px;\"\r\n                           typeahead=\"column as column.text for column in numericalColumns | filter:$viewValue:$emptyOrMatch | orderBy:\'text.toString()\'\"\r\n                           typeahead-focus\r\n                           typeahead-on-select=\"apiHandle.api.loadChart()\"\r\n                           typeahead-select-on-blur=\"true\"/>\r\n                </span>\r\n                <span class=\"restrict-dropdown-menu\">\r\n                    <label>Y:</label>\r\n                    <input type=\"text\" ng-model=\"chartProperties.y_attribute\" class=\"form-control\"\r\n                           style=\"width: 12em; display: inline; height:25px;\"\r\n                           typeahead=\"column as column.text for column in numericalColumns | filter:$viewValue:$emptyOrMatch | orderBy:\'text.toString()\'\"\r\n                           typeahead-focus\r\n                           typeahead-on-select=\"apiHandle.api.loadChart()\"\r\n                           typeahead-select-on-blur=\"true\"/>\r\n                </span>\r\n            </span>\r\n        </span>\r\n        <span class=\"flex-sub-container-right\">\r\n            <span dhc-click-outside dhc-open-state=\"states.menuDisplays.indicatorControl\"\r\n                              dhc-close-callback=\"toggleSlide(!states.menuDisplays.indicatorControl,\'indicator-control\')\">\r\n                <a class=\"clickable\" style=\"text-decoration:none\"\r\n                   ng-click=\"toggleSlide(!states.menuDisplays.moreOptions,\'more-options\');selected=\'\';\">\r\n                    <span class=\"fake-anchor-tag\">More Options</span>\r\n                    <i class=\"fa\" ng-class=\"{\'fa-chevron-up\': states.menuDisplays.moreOptions, \'fa-chevron-down\': !states.menuDisplays.moreOptions}\"></i>\r\n                </a>\r\n                <div class=\"more-options floating-form\" style=\"display: none;width:250px;\">\r\n                    <label>Group By:&nbsp;</label>\r\n                    <div class=\"restrict-dropdown-menu input-group\">\r\n                        <input type=\"text\" class=\"form-control\"\r\n                               ng-model=\"chartProperties.group_by\"\r\n                               typeahead=\"column as column.text for column in categoricalColumns | filter:$viewValue:$emptyOrMatch | orderBy:\'text.toString()\'\"\r\n                               typeahead-on-select=\"apiHandle.api.loadChart()\"\r\n                               typeahead-focus/>\r\n                        <span class=\"input-group-addon\" ng-click=\"chartProperties.group_by = undefined;apiHandle.api.loadChart()\">\r\n                            <strong>X</strong>\r\n                        </span>\r\n                    </div>\r\n                    <label>Point Radius:&nbsp;</label>\r\n                    <div class=\"restrict-dropdown-menu input-group\">\r\n                        <input type=\"text\" class=\"form-control\"\r\n                               ng-model=\"chartProperties.radius\"\r\n                               typeahead=\"column as column.text for column in numericalColumns | filter:$viewValue:$emptyOrMatch | orderBy:\'text.toString()\'\"\r\n                               typeahead-on-select=\"apiHandle.api.loadChart()\"\r\n                               typeahead-focus/>\r\n                        <span class=\"input-group-addon\" ng-click=\"chartProperties.radius = undefined;apiHandle.api.loadChart()\">\r\n                            <strong>X</strong>\r\n                        </span>\r\n                    </div>\r\n                    <div>\r\n                        <label>Regression:&nbsp;</label>\r\n                        <br/>\r\n                        <div class=\"btn-group\" dropdown>\r\n                            <button id=\"split-button\" type=\"button\" class=\"btn btn-default\">{{getRegressionText()}}</button>\r\n                            <button type=\"button\" class=\"btn btn-default\" dropdown-toggle>\r\n                                <span class=\"caret\"></span>\r\n                            </button>\r\n                            <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"split-button\">\r\n                                <li role=\"menuitem\" ng-repeat=\"type in chartFactory.regressionTypes\"\r\n                                                    ng-click=\"chartProperties.regression = type.tag;apiHandle.api.loadChart()\">\r\n                                    <a href=\"#\">{{type.text}}</a>\r\n                                </li>\r\n                                <li role=\"menuitem\" ng-click=\"chartProperties.regression = undefined;apiHandle.api.loadChart()\">\r\n                                    <a href=\"#\">None</a>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                    <br/>\r\n                    <div>\r\n                        <div class=\"btn-group\">\r\n                            <label class=\"btn btn-primary\" ng-model=\"chartProperties.show_datalabel\" btn-checkbox\r\n                                   ng-click=\"apiHandle.api.timeoutLoadChart()\">\r\n                                {{chartProperties.show_datalabel ? \"Data labels on\" : \"Data labels off\"}}\r\n                            </label>\r\n                        </div>\r\n                        <div class=\"btn-group\" style=\"padding-top:10px;\">\r\n                            <label class=\"btn btn-primary\" ng-model=\"chartProperties.outlier_remove\" btn-checkbox\r\n                                   ng-click=\"apiHandle.api.timeoutLoadChart()\">\r\n                                {{chartProperties.outlier_remove ? \"Outliers removed\" : \"Outliers not removed\"}}\r\n                            </label>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </span>\r\n            <span>\r\n                <span class=\"clickable\" style=\"padding-right:5px;color:#005da0;\" ng-click=\"exportXLS()\"><i class=\"fa fa-share-square-o\"></i></span>\r\n                <span class=\"clickable\" style=\"padding-right:5px;color:#005da0;\" ng-repeat=\"customButton in customButtons\" ng-click=\"customButton.callback()\">\r\n                    <i class=\"fa\" ng-class=\"customButton.faClass\"></i>\r\n                </span>\r\n            </span>\r\n        </span>\r\n    </div>\r\n    <hr/>\r\n    <div style=\"position:relative\">\r\n        <i ng-show=\"isProcessing\" class=\"fa fa-spinner fa-spin fa-3x spinner\" style=\"position:absolute;top:0;left:0\"></i>\r\n        <!-- this is where the stock chart goes -->\r\n        <div ng-attr-id=\"{{chartId}}\" style=\"width:100%;height:100%;\"></div>\r\n        <alert ng-show=\"alerts.generalWarning.active\" style=\"position:absolute;bottom:0;right:0;\"\r\n               close=\"alerts.generalWarning.active = false\" type=\"danger\">\r\n            {{alerts.generalWarning.message}}\r\n        </alert>\r\n    </div>\r\n</div>\r\n");}]);