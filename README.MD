<h1 style="text-align: center;">SALT 保真系统</h1>

## 安装
### Dependencies, nodemon/pm/
* node.js   6.5.*
* npm       3.10.*
* MongoDb   3.2.*
* nodemon   1.10.*
* grunt-cli 1.2.*
* Bower     1.7.*

### 安装node.js
到官网按提示下载安装


### 配置数据库MongoDB, 单机未集群
#### 创建用户 or 和app同一台服务器忽略此步骤

MongoDB用户设置 参考<a href="https://docs.mongodb.com/manual/tutorial/enable-authentication/#user-administrator">这个</a>

与配置文件相关, 参考  <a href="#deployment">部署</a>


#### 创建文件夹: 
/path/to/mongodb/log 
/path/to/mongodb/data

#### 配置文件: mongo.conf

```Bash
systemLog:
  destination: file
  path: /path/to/mongodb/log
  logAppend: true
storage:
  dbPath: /path/to/mongodb/data
net:
  bindIp: 127.0.0.1
```

#### 启动MongoDB: 
mongd --config /path/to/mongodb/mongo.conf

### 安装nodemon

```Bash
npm install -g nodemon
```

### 安装Grunt-cli
```Bash
npm install -g grunt-cli
```

### 安装bower
```Bash
npm install -g bower
```




## 获取前端资源

```Bash
bower install
```



## 安装node依赖包

```Bash
npm install
```



<h2 id="deployment"> 部署资源</h2>
### 创建文件secret.js, 存储数据库/加解密/Token等相关配置
**./conf/secret.js**

```js
'use strict';

module.exports = ({
    db: {
        local: {
            'protocol': 'mongodb:',
            'slashes': true,
            'auth': null,
            'host': 'localhost:27017',
            'port': '27017',
            'hostname': 'localhost',
            'hash': null,
            'search': null,
            'query': null,
            'pathname': '/salt',
            'path': '/salt',
            'href': 'mongodb://localhost:27017/salt'
        },
        mlab: {
            'protocol': 'mongodb:',
            'slashes': true,
            'auth': 'www:qwert12345',
            'host': 'ds019756.mlab.com:19756',
            'port': '19756',
            'hostname': 'ds019756.mlab.com',
            'hash': null,
            'search': null,
            'query': null,
            'pathname': '/salt',
            'path': '/salt',
            'href': 'mongodb://www:qwert12345@ds019756.mlab.com:19756/salt'
        }
    },
    cipher: {
        salt_factor: 10
    },
    limits: {
        timeout: '4s'
    },
    session_secret: 'TKRv.IJ=Ww/4KiVs$Q#&!F!%V]'
});

```

### 创建文件夹uploads, 用于存储上传的保真图
**./public/uploads**

### 运行grunt, 部署资源
```Bash
grunt serve
```



## 启动网站
export NODE_ENV 和 PORT, 否则会运行在 development 8888端口

```Bash
NODE_ENV=production PORT=80 npm start
```

当然, 这样会比较好, 起码可以跑在后台:

```Bash
NODE_ENV=production PORT=80 nohup npm start &
```

