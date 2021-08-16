/**
 * local cache
 */

 'use strict';

 const NodeCache = require( "node-cache" );
 const myCache = new NodeCache();
 
 var getValue = function(sid){
     let value = myCache.get(sid);
     return value;
 };
 
 var setValue = function(key, value, ttl){
     myCache.set(key, value, ttl);
 };
 
 var del = function(key){
     myCache.del(key);
 };
 
 module.exports = {
     getValue,
     setValue,
     del
 };