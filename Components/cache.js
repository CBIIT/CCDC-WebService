/**
 * local cache
 */

 "use strict";

 const NodeCache = require( "node-cache" );
 const myCache = new NodeCache();
 
let getValue = function(sid){
    let value = myCache.get(sid);
    return value;
};

let setValue = function(key, value, ttl){
    myCache.set(key, value, ttl);
};

let del = function(key){
    myCache.del(key);
};

let flush = () => {
  myCache.flushAll();
};
 
module.exports = {
    getValue,
    setValue,
    del,
    flush
};