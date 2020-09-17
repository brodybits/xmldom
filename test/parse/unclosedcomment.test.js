'use strict';

var { strictEqual } = require('assert');
var DOMParser = require('../../lib/dom-parser').DOMParser;

describe('errorHandle', () => {
  it('unclosedcomment', () => {
    var parser = new DOMParser();
		var doc = parser.parseFromString('<!--', 'text/xml');
		strictEqual(doc.toString(), '!--');
  })
})
