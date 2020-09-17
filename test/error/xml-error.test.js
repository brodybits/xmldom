'use strict';

var DOMParser = require('../../lib/dom-parser').DOMParser;
var { strictEqual } = require('assert');


describe('errorHandle', () => {
  it("empty document", () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		errors.push(key, msg)
	}
	});
	var dom = p.parseFromString('', 'text/xml');
	strictEqual(errors.length, 2)
  })

  it("unclosed document", () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		errors.push(key, msg)
	}
	});
	var dom = p.parseFromString('<img>', 'text/xml');
	strictEqual(errors.length, 2)
  })

  it("unclosed hmtl tags", () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		errors.push(key, msg)
	}
	});
	var dom = p.parseFromString('<img>', 'text/html');
	strictEqual(errors.length, 0,"unclosed html tag not need report!!")
  })

  it("invalid xml node", () => {
		var errors = [];
		var p = new DOMParser({
			errorHandler: function(key,msg){
				errors.push(key, msg)
			}
		});
		strictEqual(
			p.parseFromString('<test><!--', 'text/xml').documentElement.toString(),
			'<test/>'
		);
		strictEqual(errors.length, 4);
		errors = []
		strictEqual(
			p.parseFromString('<r', 'text/xml').documentElement.toString(),
			'<r/>'
		)
		strictEqual(errors.length, 4)
  })

  it("invalid html attribute (miss quote)", () => {
  	var errors = [];
	var p = new DOMParser({
		errorHandler: function(key,msg){
		errors.push(key, msg)
	}
	});
	var dom = p.parseFromString('<img attr=1/>', 'text/html');
	strictEqual(errors.length, 2,"invalid xml attribute(miss qute)")
	strictEqual(dom.toString(), '<img attr="1" xmlns="http://www.w3.org/1999/xhtml"/>')
  })

  it('valid html attribute value (<>&)', () => {
		var dom = new DOMParser({}).parseFromString('<img attr="<>&"/>', 'text/html');
		strictEqual(dom.toString(), '<img attr="&lt;>&amp;" xmlns="http://www.w3.org/1999/xhtml"/>',"invalid xml attribute valus (<)")
  })
})
