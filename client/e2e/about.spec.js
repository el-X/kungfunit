'use strict';

/**
 * End-to-end test for the about page.
 */
describe('The about view', function () {
    var page;

    beforeEach(function () {
        browser.get('/about');
        page = require('./about.po.js');
    });

    it('should include an image and lettering with correct data', function () {
        expect(page.logo.getAttribute('src')).toMatch(/assets\/images\/kungfunit.png$/);
        expect(page.logo.getAttribute('alt')).toBe('KungFunit Logo');
        expect(page.lettering.getText()).toBe('KungFunit');
        expect(page.description.getText()).toBe('The greatest Kung Fu Unit Converter of all time. Bam!');
    });
});
