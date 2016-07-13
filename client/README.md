# KungFunit Client
This is where the client-side code of KungFunit resides. 
Its main purpose is to convey all of the information
made available through the [server](https://github.com/el-X/kungfunit/tree/master/server) 
in a readable and aesthetically appealing way.

## Installation

First of all install [Node.js](https://nodejs.org/).

Afterwards run the following commands in order to install Gulp and Bower:

    npm install -g gulp
    npm install -g bower

Then install all Node.js and Bower dependencies by typing in the following commands:

    npm install
    bower install

## Start

There are two ways to start the project. But before you can do that you have to make sure
that the installation procedures of the corresponding
[server](https://github.com/el-X/kungfunit/tree/master/server) have been run. 

If all prerequisites have been met, you can either build or serve the _client_.
Alternatively you can use one of the Gulp tasks described in the chapter [Gulp tasks](#gulp-tasks).
 
### Build

To build an optimized version of your application use the command `gulp` or `gulp build`.
If the build process has finished, the compiled code can be found in the folder `/dist`.
Copy the contents of `/dist` into the `/public` folder of the [server](https://github.com/el-X/kungfunit/tree/master/server) 
and start said _server_ by typing in the following command:
                                                                        
    npm start
    
You can then reach the application through the URL [http://localhost:8080/](http://localhost:8080/).    
 
### Serve

For the development phase, the command `gulp serve` launches a server which supports live 
reload of your modifications.

In order to make full use of the application you have to navigate to the 
[server](https://github.com/el-X/kungfunit/tree/master/server) directory and start 
the _server_ by typing in the following command:

    npm start
    
The application is then reachable through the URL [http://localhost:3000/](http://localhost:3000/).

## Gulp tasks

* `gulp` or `gulp build` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp test` to launch your unit tests with Karma
* `gulp test:auto` to launch your unit tests with Karma in watch mode
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files
