/**
 * This file uses the Page Object pattern to define objects for the about page.
 * For more information about the Page Object pattern take a look at the following presentation:
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var AboutPage = function () {
    this.logo = element.all(by.tagName('img')).get(1);  // the logo of the about page and not the one of the navbar
    this.lettering = element(by.css('.md-display-2'));
    this.description = element(by.tagName('p'));
};

module.exports = new AboutPage();
