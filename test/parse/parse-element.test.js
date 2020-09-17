'use strict';

var assert = require('assert');
var DOMParser = require('../../lib/dom-parser').DOMParser;

describe('XML Node Parse', () => {
    it('noAttribute', () => {
			const expected = '<xml/>'
			assert.strictEqual(new DOMParser().parseFromString('<xml ></xml>','text/xml')+'', expected);
    	assert.strictEqual(new DOMParser().parseFromString('<xml></xml>','text/xml')+'', expected);
    	assert.strictEqual(new DOMParser().parseFromString('<xml />','text/xml')+'', expected);
    	assert.strictEqual(new DOMParser().parseFromString(expected,'text/xml')+'', expected);
    })

    it('simpleAttribute', () => {
			const expected = '<xml a="1" b="2"/>'
			const expectedEmptyB = '<xml a="1" b=""/>'
			assert.strictEqual(new DOMParser().parseFromString('<xml a="1" b="2"></xml>','text/xml').toString(), expected);
    	assert.strictEqual(new DOMParser().parseFromString('<xml a="1" b="2" ></xml>','text/xml').toString(), expected);
			assert.strictEqual(new DOMParser().parseFromString('<xml a="1" b=\'\'></xml>','text/xml').toString(), expectedEmptyB);
    	assert.strictEqual(new DOMParser().parseFromString('<xml a="1" b=\'\' ></xml>','text/xml').toString(), expectedEmptyB);
    	assert.strictEqual(new DOMParser().parseFromString('<xml a="1" b="2/">','text/xml').toString(), '<xml a="1" b="2/"/>');
    	assert.strictEqual(new DOMParser().parseFromString('<xml a="1" b="2" />','text/xml').toString(), expected);
    	assert.strictEqual(new DOMParser().parseFromString('<xml  a="1" b=\'\'/>','text/xml').toString(), expectedEmptyB);
    	assert.strictEqual(new DOMParser().parseFromString('<xml  a="1" b=\'\' />','text/xml').toString(), expectedEmptyB);
    })

    it('nsAttribute', () => {
    	const expected = '<xml xmlns="1" xmlns:a="2" a:test="3"/>';
    	assert.strictEqual(new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3"></xml>','text/xml').toString(), expected);
    	assert.strictEqual(new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3" ></xml>','text/xml').toString(), expected);
     	assert.strictEqual(new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3/">','text/xml').toString(), expected.replace('3', '3/'));
    	assert.strictEqual(new DOMParser().parseFromString('<xml xmlns="1" xmlns:a="2" a:test="3" />','text/xml').toString(), expected);
    })
})
