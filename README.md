# angular2-with-express-starter

For using **angular2-with-express-starter** you have to be installed globally:
[node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm), [nodemon](https://github.com/remy/nodemon), [typescript](https://www.npmjs.com/package/typescript), [angular CLI](https://github.com/angular/angular-cli)

First, clone the project:
```bash
$ git clone https://github.com/commercialsuicide/angularCLI-with-express-starter.git
$ cd angularCLI-with-express-starter
```

Install necessary dependencies:
```bash
$ npm install
```

# Run the project in developer mode

For running the **angular2-with-express-starter**, you can run **express server** and **angular CLI** separately in two different terminals:
```bash
$ npm run startExpress
```
and
```bash
$ npm run startAngular
```

Or start both client end and server end in one terminal:
```bash
$ npm start
```

Now open **localhost:4200** and check the connection between Angular and Express: push the *"Test"* button on the page. If it shows *"Requests to server are OK"* - the connection is OK.

For communication between Angular and Express we are using proxy, proxy configuration is in `proxy.config.json`. When you need to create more routes, you have to add them to `proxy.config.json` too, by analogy with default `/test-route`.

# If watcher doesn't update changes (on linux)

If watcher doesn't update changes, you have to change the amount of watches. The problem with inotify is reseting this counter every time you restart your computer. You can fix it on linux (and should fix it after every computer restart) by executing the following command:
```bash
$ echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
```
And then restart `npm run startExpress` and `npm run startAngular` commands.

# Build the project

You can build the project using
```bash
$ ng build
```
Or for production usage you have to build your app using
```bash
$ ng build --prod --aot
```
