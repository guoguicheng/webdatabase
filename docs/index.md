### 数据库连接
IndexedDb操作类

    IndexedDb(dbName,connCallback,databaseVersion) 
    /**
    *param:dbName 数据库名称
    *param:connCallback:{
    *   connSuccess:function(self,e){
    *        //连接成功回调self当前类实例和事件
    *   },
    *   connUpgrade:function(self,e){
    *       //连接成功回调self当前类实例和事件
    *   },
    *   connError:function(e){
    *       //连接失败返回错误信息
    *   }
    *}
    *param:databaseVersion 数据库版本
    **/
    
    ######例如######
    var dbs=new IndexedDb('databaseName',{
        connUpgrade: function (self) {      //首次连接或数据库版本更新时触发
            self.createTable("TableName1",'KeyPath1',{ //当需要创建表时需要更新版本来触发connUpgrade方法，connUpgrade回调外调用createTable来创建表的方法是错误的
                success:function (objectStore) {
                    // 创建一个索引来通过 name 搜索客户。
                    // 可能会有重复的，因此我们不能使用 unique 索引。
                    objectStore.createIndex('name','name',{unique:false});
                    // 创建一个索引来通过 email 搜索客户。
                    // 我们希望确保不会有两个客户使用相同的 email 地址，因此我们使用一个 unique 索引。
                    objectStore.createIndex('email','email',{unique:true});
                }
            })
            //创建另一张表TableName2
            self.createTable(TableName2,'keyPath2')

        },
        connSuccess:function (self) {     //连接成功回掉数据库操作类实例
            
        },
        connError:function(e){ //如果连接失败
            console.log(e);
        }
    })
    
### 创建表结构函数（必须触发connUpgrade，并只可在函数内调用）
函数原型:createTable(tableName,keyPath,callback)  

    /**
    *param:tableName 表名称
    *param:keyPath 数据表索引列名称
    *param:callback:{
    *   success:function(){} //执行成功回调
    *}
    **/
    
### 删除表结构函数（必须触发connUpgrade，并只可在函数内调用）
函数原型:deleteTable(tableName)  

    /**
    *param:tableName 表名称
    **/

### 添加表数据
函数原型 add(tableName,data,callback)  

    /**
    *param:tableName 要操作的表名称
    *param:data 要添加的数据，结构需与创建表结构createTable时定义的相同
    *param:callback：{ 添加完成回调
    *   success:function () {}
    *   complete:function(e){},
    *   error:function(e){}
    *}
    **/

    dbs.add("TableName1",{
        'KeyPath1':'1111',
        'name':'ggc',
        'email','abc@qq.com'
    },{
        success:function () {},
        complete:function(e){},
        error:function(e){}
    })
    
### 获取表数据  
函数原型:get(tableName,keyPathVal,callback)  

    /**
    *param:tableName 要操作的表名称
    *param:keyPathVal 索引列的值
    *callback:{
    *   success:function (result) {
    *       console.log(result);
    *   },
    *   complete:function(e){},
    *   error:function(e){}
    *}
    **/
    //注意该方法已readonly方式打开，需要更新数据请使用set方法
    dbs.get("TableName1","keyPath1_Value",{
        success:function (result) {
            console.log(result);
        },
        complete:function(e){},
        error:function(e){}
    })  
    
### 删除一条数据
函数原型：delete(tableName,keyPathVal,callback)

    /**
    *param:tableName 要操作的表名称
    *param:keyPathVal 索引列的值
    *callback:{
    *   success:function () {},
    *   complete:function(e){},
    *   error:function(e){}
    *}
    **/
    dbs.delete("TableName1","keyPathVal",{
        success:function () {},
        complete:function(e){},
        error:function(e){}
    })
    
### 更新数据
函数原型：set(tableName,keyPathVal,key,value,callback)

    /**
    *param:tableName 要操作的表名称
    *param:keyPathVal 索引列的值
    *param:key 需要更新的key
    *param:value 需要更新的key的值
    *callback:{
    *   success:function () {},
    *   complete:function(e){},
    *   error:function(e){}
    *}
    **/
    
    //相当于mysql 语句 update TableName1 set updateKey=updateValue where keyPath=keyPathVal
    dbs.set("TableName1",keyPathVal,'updateKey',updateValue,{
        success:function () {},
        complete:function(e){},
        error:function(e){}
    })  
    
### 关闭数据库连接
函数原型:close()  

    /**
    *无参数
    **/
    
### 删除数据库
函数原型:deleteDatabase(dbName)

    /**
    *param:dbName 当前打开数据库的数据库名称
    **/
    
### 其他高级操作
数据库实例成功后通过 dbs.connection 可获取当前数据库连接对象，可执行更高级的操作