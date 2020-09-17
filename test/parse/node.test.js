'use strict';

var wows = require('vows');
var assert = require('assert');
var DOMParser = require('../../lib/dom-parser').DOMParser;
var XMLSerializer = require('../../lib/dom-parser').XMLSerializer;
var parser = new DOMParser();

// Create a Test Suite
describe('XML Node Parse', () => {
    it('element', () => {
    	var dom = new DOMParser().parseFromString('<xml><child/></xml>');
    	assert.strictEqual(dom.childNodes.length, 1);
    	assert.strictEqual(dom.documentElement.childNodes.length, 1);
    	assert.strictEqual(dom.documentElement.tagName, 'xml');
    	assert.strictEqual(dom.documentElement.firstChild.tagName, 'child');
    })

    it('text', () => {
    	var dom = new DOMParser().parseFromString('<xml>start center end</xml>');
    	var root = dom.documentElement;
    	assert.strictEqual(root.firstChild.data, 'start center end');
    	assert.strictEqual(root.firstChild.nextSibling, null);
    })

    it('cdata', () => {
    	var dom = new DOMParser().parseFromString('<xml>start <![CDATA[<encoded>]]> end<![CDATA[[[[[[[[[]]]]]]]]]]></xml>');
    	var root = dom.documentElement;
    	assert.strictEqual(root.firstChild.data, 'start ');
    	assert.strictEqual(root.firstChild.nextSibling.data, '<encoded>');
    	assert.strictEqual(root.firstChild.nextSibling.nextSibling.nextSibling.data, '[[[[[[[[]]]]]]]]');
    })

    it('cdata empty', () => {
    	var dom = new DOMParser().parseFromString('<xml><![CDATA[]]>start <![CDATA[]]> end</xml>');
    	var root = dom.documentElement;
    	assert.strictEqual(root.textContent, 'start  end');
    })

    it('comment', () => {
    	var dom = new DOMParser().parseFromString('<xml><!-- comment&>< --></xml>');
    	var root = dom.documentElement;
    	assert.strictEqual(root.firstChild.nodeValue, ' comment&>< ');
    })

    it('cdata comment', () => {
    	var dom = new DOMParser().parseFromString('<xml>start <![CDATA[<encoded>]]> <!-- comment -->end</xml>');
    	var root = dom.documentElement;
    	assert.strictEqual(root.firstChild.nodeValue, 'start ');
    	assert.strictEqual(root.firstChild.nextSibling.nodeValue, '<encoded>');
    	assert.strictEqual(root.firstChild.nextSibling.nextSibling.nextSibling.nodeValue, ' comment ');
    	assert.strictEqual(root.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue, 'end');
    })

    it('append node', () => {
    	var dom = new DOMParser().parseFromString('<xml/>');
    	var child = dom.createElement("child");
    	assert.strictEqual(child, dom.documentElement.appendChild(child));
    	assert.strictEqual(child, dom.documentElement.firstChild);
    	var fragment = new dom.createDocumentFragment();
    	assert.strictEqual(child, fragment.appendChild(child));
    })

    it('insert node', () => {
    	var dom = new DOMParser().parseFromString('<xml><child/></xml>');
    	var node = dom.createElement("sibling");
    	var child = dom.documentElement.firstChild;
    	child.parentNode.insertBefore(node, child);
    	assert.strictEqual(node, child.previousSibling);
    	assert.strictEqual(node.nextSibling, child);
    	assert.strictEqual(node.parentNode, child.parentNode);
    })

    it('insert fragment', () => {
    	var dom = new DOMParser().parseFromString('<xml><child/></xml>');
    	var fragment = dom.createDocumentFragment();
    	assert.strictEqual(fragment.nodeType, 11);
    	var first = fragment.appendChild(dom.createElement("first"));
    	var last = fragment.appendChild(dom.createElement("last"));
    	assert.strictEqual(fragment.firstChild, first);
    	assert.strictEqual(fragment.lastChild, last);
    	assert.strictEqual(last.previousSibling, first);
    	assert.strictEqual(first.nextSibling, last);
    	var child = dom.documentElement.firstChild;
    	child.parentNode.insertBefore(fragment, child);
    	assert.strictEqual(last.previousSibling, first);
    	assert.strictEqual(first.nextSibling, last);
    	assert.strictEqual(child.parentNode.firstChild, first);
    	assert.strictEqual(last, child.previousSibling);
    	assert.strictEqual(last.nextSibling, child);
    	assert.strictEqual(first.parentNode, child.parentNode);
    	assert.strictEqual(last.parentNode, child.parentNode);
    })

    it("instruction", () => {
		var source = '<?xml version="1.0"?><root><child>&amp;<!-- &amp; --></child></root>';
		var doc = new DOMParser().parseFromString(source,"text/xml");
    	var source2 = new XMLSerializer().serializeToString(doc);
    	assert.strictEqual(source2, source);
    })

	it('public id && sysid', () => {
	  	var error = []
	    var parser = new DOMParser({
	    	locator:{},
	    	errorHandler:function(msg){
				error.push(msg);
			}
		});
	    var doc = parser.parseFromString('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html/>', 'text/html');
		assert.strictEqual(doc+'', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"></html>')
		
	})
})

//var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
//var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
//var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
//var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
//var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
//var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
//var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
//var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
//var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
//var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
//var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
//var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;
