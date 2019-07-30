
## 开始项目

安装依赖:
```js
npm install // yarn install
```

设置环境变量:
```sh
vim .env
```

启动项目:
```sh
npm start // yarn start

```

## 部署

```sh
# 安装pm2
1. npm install -g pm2

# 安装依赖
2. npm install

# 启动项目
4. pm2 start index.js

```
注意： .env文件中设置上传文件夹UPLOAD_DIR,并保证拥有读写权限
  nginx做前端代理的话，要设置/upload地址，指定到UPLOAD_DIR目录

In production you need to make sure your server is always up so you should ideally use any of the process manager recommended [here](http://expressjs.com/en/advanced/pm.html).
We recommend [pm2](http://pm2.keymetrics.io/) as it has several useful features like it can be configured to auto-start your services if system is rebooted.

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports.  A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. We just log to the console for simplicity, you can configure more transports as per your requirement.

#### API logging
Logs detailed info about each api request to console during development.
![Detailed API logging](https://cloud.githubusercontent.com/assets/4172932/12563354/f0a4b558-c3cf-11e5-9d8c-66f7ca323eac.JPG)

#### Error logging
Logs stacktrace of error to console along with other details. You should ideally store all error messages persistently.
![Error logging](https://cloud.githubusercontent.com/assets/4172932/12563361/fb9ef108-c3cf-11e5-9a58-3c5c4936ae3e.JPG)


# siphtor_server
