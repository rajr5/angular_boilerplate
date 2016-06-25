# Stock Mean Application
This is a boilerplate mean application using Node, Express, Angular, mongo (mlab), Heroku, Gulp

## seting up dev environment
1. Download the repo and run `npm install`
2. create a .env file in the root directory with the following paramters
  - MAILGUN_USERNAME
  - MAILGUN_PASSWORD
  - MONGODB
  - TOKEN_SECRET
3. MongoDB connection string can be local or hosted (e.x. mongolab)
4. Token Secret should be a strongly generated alpha-numeric string
5. Ensure gulp is install globally (possibly other dependencies if running throws dependency errors)

### Sample .env File
```
MAILGUN_USERNAME='postmaster@sandbox67c118365e564798a8864434e4b2a3cb.mailgun.org'
MAILGUN_PASSWORD='ed49d942fd9e6c11208ee3aacb29df9d'

MONGODB='localhost'

TOKEN_SECRET='dc1c7e6b02a286885dcdfsd543498lkj578a97bd45d57ec531e7397b8a67'
```

## building
Run `npm build` of `gulp build` to build one JS application file and another JS template file in public/js
Run either 'npm start

## developing
1. Build - `npm build`
2. Start server - `npm`
3. Watch file changes - `npm watch`

### For use in visual studio code:
1. Create a standard launch.json run file py pressing F5 and chooseing Node.js
2. Create a new task `ctrl+shift+p` and type `task` and choose configure task runner.  Se sample below
3. Run server with `F5` and then run watch task with `ctrl+shift+p` and type `task` and choose run task and choose default
4. This should open up browser window with brosersync that will refresh with any front-end changes.  For backend changes, you will have to restart the server.

**.vscode/task.json**
```javascript
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "0.1.0",
  "command": "gulp",
  "isShellCommand": true,
  "args": ["--no-color"],
  "showOutput": "always",
  "tasks": [
    {
      "taskName": "default",
      "args": [],
      "isBuildCommand": true,
      "isWatching": true
    }
  ]
}
```

## deploying
*only Heroku instructions included*
1. Create a heroku application
2. Set global variables on heroku using CLI or the web console.
  - MAILGUN_USERNAME
  - MAILGUN_PASSWORD
  - MONGODB
  - TOKEN_SECRET
3. [Follow Heroku instructions here for setting a remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote)
4. ansure any changes made are added/committed to git
5. run `git push heroku master` to deploy
6. ENJOY!

