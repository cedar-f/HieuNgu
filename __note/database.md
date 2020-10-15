# core database
## 1. Technology 
- Module use: [Query Buider](https://www.npmjs.com/package/node-querybuilder)
## 2. Connection support
- single: This will use the driver's basic single connection capabilities. All connections to your app will use this single database connection. This is usually less than ideal for most web applications but might be quite suitable for command line scripts and the like.
- pool: This will utilize the driver's connection pooling capabilities if it is offered. Connection pooling allows your application to pull from a pool of connections that were created by the driver. Typically the connections will be handed out to requesting methods in a round-robin fashion. This is ideal for a web application.
- cluster: When you have a cluster of servers and you want to create pools of connections to different servers to help load balance your stack, using the cluster connection type can come in handy. This is ideal for high-traffic web sites and applications that utilize a farm of database servers as opposed to just one.