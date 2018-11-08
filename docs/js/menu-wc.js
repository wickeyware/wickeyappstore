'use strict';



var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

customElements.define('compodoc-menu', function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.isNormalMode = _this.getAttribute('mode') === 'normal';
        return _this;
    }

    _createClass(_class, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            this.render(this.isNormalMode);
        }
    }, {
        key: 'render',
        value: function render(isNormalMode) {
            let tp = lithtml.html(
'<nav>\n    <ul class="list">\n        <li class="title">\n            \n                <a href="index.html" data-type="index-link">wickeyappstore</a>\n            \n        </li>\n\n        <li class="divider"></li>\n        ' + (isNormalMode ? '<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>' : '') + '\n        <li class="chapter">\n            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>\n            <ul class="links">\n                \n                    <li class="link">\n                        <a href="overview.html" data-type="chapter-link">\n                            <span class="icon ion-ios-keypad"></span>Overview\n                        </a>\n                    </li>\n                    <li class="link">\n                        <a href="index.html" data-type="chapter-link">\n                            <span class="icon ion-ios-paper"></span>README\n                        </a>\n                    </li>\n                \n                \n                    <li class="link">\n                        \n                            <a href="changelog.html"\n                        \n                        data-type="chapter-link">\n                            <span class="icon ion-ios-paper"></span>CHANGELOG\n                        </a>\n                    </li>\n                \n                    <li class="link">\n                        \n                            <a href="license.html"\n                        \n                        data-type="chapter-link">\n                            <span class="icon ion-ios-paper"></span>LICENSE\n                        </a>\n                    </li>\n                \n                \n                    <li class="link">\n                        <a href="dependencies.html"\n                            data-type="chapter-link">\n                            <span class="icon ion-ios-list"></span>Dependencies\n                        </a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n        <li class="chapter modules">\n            <a data-type="chapter-link" href="modules.html">\n                <div class="menu-toggler linked" data-toggle="collapse"\n                    ' + (isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"') + '>\n                    <span class="icon ion-ios-archive"></span>\n                    <span class="link-name">Modules</span>\n                    <span class="icon ion-ios-arrow-down"></span>\n                </div>\n            </a>\n            <ul class="links collapse"\n            ' + (isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"') + '>\n                \n                    <li class="link">\n                        <a href="modules/WickeyAppStoreModule.html" data-type="entity-link">WickeyAppStoreModule</a>\n                        \n                            <li class="chapter inner">\n                                <div class="simple menu-toggler" data-toggle="collapse"\n                                    ' + (isNormalMode ? 'data-target="#components-links-module-WickeyAppStoreModule-e23705460345482309c5363ebc8ac795"' : 'data-target="#xs-components-links-module-WickeyAppStoreModule-e23705460345482309c5363ebc8ac795"') + '>\n                                    <span class="icon ion-md-cog"></span>\n                                    <span>Components</span>\n                                    <span class="icon ion-ios-arrow-down"></span>\n                                </div>\n                                <ul class="links collapse"\n                                    ' + (isNormalMode ? 'id="components-links-module-WickeyAppStoreModule-e23705460345482309c5363ebc8ac795"' : 'id="xs-components-links-module-WickeyAppStoreModule-e23705460345482309c5363ebc8ac795"') + '>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasAlert.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasAlert</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasPay.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasPay</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasProfile.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasProfile</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasReview.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasReview</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasSSO.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasSSO</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasShop.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasShop</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WasUp.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WasUp</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/WickeyAppStoreComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WickeyAppStoreComponent</a>\n                                        </li>\n                                    \n                                </ul>\n                            </li>\n                        \n                        \n                        \n                        \n                        \n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n            \n        \n        \n        \n        \n        \n            \n                <li class="chapter">\n                    <div class="simple menu-toggler" data-toggle="collapse"\n                        ' + (isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"') + '>\n                        <span class="icon ion-md-arrow-round-down"></span>\n                        <span>Injectables</span>\n                        <span class="icon ion-ios-arrow-down"></span>\n                    </div>\n                    <ul class="links collapse"\n                    ' + (isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"') + '>\n                        \n                            <li class="link">\n                                <a href="injectables/UserService.html" data-type="entity-link">UserService</a>\n                            </li>\n                        \n                            <li class="link">\n                                <a href="injectables/WasDataService.html" data-type="entity-link">WasDataService</a>\n                            </li>\n                        \n                    </ul>\n                </li>\n            \n        \n        \n        \n        \n        <li class="chapter">\n            <div class="simple menu-toggler" data-toggle="collapse"\n                ' + (isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"') + '>\n                <span class="icon ion-md-information-circle-outline"></span>\n                <span>Interfaces</span>\n                <span class="icon ion-ios-arrow-down"></span>\n            </div>\n            <ul class="links collapse"\n            ' + (isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"') + '>\n                \n                    <li class="link">\n                        <a href="interfaces/Inapp.html" data-type="entity-link">Inapp</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="interfaces/User.html" data-type="entity-link">User</a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n        \n        \n        \n        <li class="chapter">\n            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>\n        </li>\n        \n        \n        \n    </ul>\n</nav>'
);
        this.innerHTML = tp.strings;
        }
    }]);

    return _class;
}(HTMLElement));