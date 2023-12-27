## b2b-supplier

## getting started

```sh
git clone http://172.19.26.140/b2b/b2b-supplier.git
cd b2b-supplier
yarn
yarn start
#visit http://localhost:3001
```

## 代码规范

@Action('name')
name 命名大家统一下 模块名：功能名 多个命名可以用‘：’分开 👍  
name 不建议命名方式 userName,user_name，user-name👎  
name 命名一律小写 👍  
name 推荐优先名词命名，动词在后 如 goods:edit👍

## 项目规范

## Storybook

```sh
npm i -g getstorybook
cd my-react-app
getstorybook
yarn run storybook
```

## 自动化构建

在原来的启动命令后面加入类型参数，仅支持 dev,test1,test2 和 online 四个类型例如：yarn star:dev 连接本地后台
yarn start:test1 连接 118 后台
yarn start:test2 连接 120 后台
yarn start:online 连接线上后台部署生产环境同理例如:yarn build:all:test1 部署 118 环境
yarn build:all:test2 部署 120 环境
yarn build:all:online 部署线上环境原来的 yarn start 和 build:all 依然能够正常运行，但是不会自动覆盖 config 文件


## nginx部署情况


/data/nginx/conf/athena.conf
/data/www/s2b/supplier/dist_supplier

