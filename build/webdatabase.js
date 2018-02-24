//https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
//https://www.cnblogs.com/smileberry/p/3844269.html

var IndexedDb=function (dbname,connCallback,connectionVersion) {
    var that = this;
    void 0 === connectionVersion && (connectionVersion = 1)
    // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // DON'T use "var indexedDB = ..." if you're not in a function.
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
    if (!window.indexedDB) {
        console.log("Your browser dons't support IndexedDB");
        return;
    }
    this.connection = window.indexedDB.open(dbname, connectionVersion);
    this.connection.onerror = function (e) {
        console.log("open database error,", e);
        connCallback.connError(e);
    }
    this.connection.onupgradeneeded = function (e) {
        console.log("Upgrading");
        that.db = e.target.result;
        connCallback.connUpgrade(that,e);
    }
    this.connection.onsuccess = function (e) {
        console.log("open indexed db success");
        that.db = e.target.result;
        connCallback.connSuccess(that,e);
    }
}
IndexedDb.prototype.createTable=function (tableName,keyPath,callback) {
    var objectStore = this.db.createObjectStore(tableName, {keyPath: keyPath});
    if(void 0 === callback || void 0 === callback.success){
        console.log("create success");
    }else{
        callback.success(objectStore);
    }
}
IndexedDb.prototype.add=function (storeName,data,callback) {
    var transaction=this.db.transaction([storeName],"readwrite");
    var objectStore=transaction.objectStore(storeName);
    var request=objectStore.add(data);
    request.onsuccess=function (e) {
        if(void 0 === callback || void 0 === callback.success){
            console.log("add success")
        }else{
            callback.success(e);
        }

    }
    transaction.oncomplete=function (e) {
        if(void 0 === callback || void 0 === callback.complete){
            console.log("add complete");
        }else{
            callback.complete(e);
        }
    }
    transaction.onerror=function (e) {
        if(void 0 === callback || void 0 === callback.error){
            console.log("on error ",e.target.error);
        }else{
            callback.error(e);
        }
    }
}
IndexedDb.prototype.delete=function (storeName,keyPath,callback) {
    var transaction=this.db.transaction([storeName],"readwrite");
    var objectStore=transaction.objectStore(storeName);

    var request=objectStore.delete(keyPath);
    request.onsuccess=function (e) {
        if(void 0 === callback || void 0 === callback.success){
            console.log("delete success")
        }else{
            callback.success();
        }

    }
    transaction.oncomplete=function (e) {
        if(void 0 === callback || void 0 === callback.complete){
            console.log("delete complete");
        }else{
            callback.complete(e);
        }
    }
    transaction.onerror=function (e) {
        if(void 0 === callback || void 0 === callback.error){
            console.log("on error ",e.target.error);
        }else{
            callback.error(e);
        }
    }
}
IndexedDb.prototype.get=function (storeName,keyPath,callback) {
    var transaction=this.db.transaction([storeName],"readonly");
    var objectStore=transaction.objectStore(storeName);
    var request=objectStore.get(keyPath);
    request.onsuccess=function (e) {
        if(void 0 === callback || void 0 === callback.success){
            console.log("on error ",e.target.error);
        }else{
            callback.success(request.result);
        }

    }
    transaction.oncomplete=function (e) {
        if(void 0 === callback || void 0 === callback.complete){
            console.log("get complete");
        }else{
            callback.complete(e);
        }
    }
    transaction.onerror=function (e) {
        if(void 0 === callback || void 0 === callback.error){
            console.log("on error ",e);
        }else{
            callback.error(e);
        }
    }
}
IndexedDb.prototype.set=function (storeName,keyPath,key,value,callback) {
    var transaction = this.db.transaction([storeName], "readwrite");
    var objectStore = transaction.objectStore(storeName);
    var request = objectStore.get(keyPath);
    request.onsuccess = function (e) {
        request.result[key] = value;
        objectStore.put(request.result);
        if (void 0 === callback || void 0 === callback.success) {
            console.log("put success");
        } else {
            callback.success();
        }
    }
    transaction.oncomplete = function (e) {
        if (void 0 === callback || void 0 === callback.complete) {
            console.log("set complete");
        } else {
            callback.complete(e);
        }
    }
    transaction.onerror = function (e) {
        if(void 0 === callback || void 0 === callback.error){
            console.log("on error ",e.target.error);
        }else{
            callback.error(e);
        }

    }
}