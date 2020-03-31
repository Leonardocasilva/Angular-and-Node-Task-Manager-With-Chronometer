# TaskManagerWithChronometer

## Technologies

- Front-End
  - Angular 9
  - SweetAlert Component
  - Font Awesome Component
  - Bootstrap Framework 4
    - Strutcure MVVM
- Back-End
  - NodeJS
  - Express
  - Mongoose
  - Debug Component
  - Cors Component
  - Body Parse Component
    - Structure MVC
- Database
  - MongoDB

I used a cluster of MongoDB that is hosted on web, in some cases, the server block the local IP, so, if this happens, I think that is a good idea, create a personal cluster and change de Mongo connection, on the App file, inside the Server directory, to avoid head pain.

Here is the [cluste used](https://cloud.mongodb.com/)

# Executing the App

## Installing the dependencies

For begin, we need install all dependencies that the app needs, for do it, you can execute the command bellow.

```
  npm install
```

Wait for all components can be installed and can proceed for the next step.

## Back-End

For execute the back-end, you need to navigate to the directory **/server** at the root. So let's do it.

```
cd server/
```

inside the directory, you need to execute the command 
```
  npm start
```

After this, the API will began run. you can confirm it, calling the end-point ```http://localhost:3000/``` and will receive the return.

```
{
  title: "Task Manager API",
  version: "0.0.2"
}
```

it's will show that the API is running correctly.

## Front-End

For the front-end, everything it's more easy, on the root, you can invoke the command 
```
ng serve --aot
```

If everything runs well, you will see this instructions

```
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.
```

# App Concepts
This project is a simple To Do list, with task that can be timed, all task have 5 function.

- Start / Resume
- Stop
- Edit
- Finish
- Re-open

The first page of the application will allow's you to create Tasks, describe it's name and after this, do you'll have the options bellow, except re-open, that is a option exclusive from the finished tasks page.

## Start / Resume

This option will allow you to start the chronometer on the task. or resume the same, case it's was stopped.

When you click in this option, the option "finish" will be allowed to use.

## Stop

This option allow you to stop your task, the chronometer will stop and not will be resumed if you reload your page.

## Edit

This option will allow you to edit the name of the task, the chronometer progress will not be affected for this option.

## Finish

This option will allow you to finish your task and you send the task for a new page, where all the finisheds tasks will is.

Remember, if the task was playing, when you select the "finish" option, the task will be stopped before be finished.

## Re-open

This option is exclusive for the finished tasks page.

When you select it, the task will be reopened and send back to to do page.
