#!/bin/bash

if [ $1 == "backend" ]
then
    cd backend
    npm start
elif [ $1 == "frontend" ]
then
    cd frontend
    BROWSER=NONE npm start
elif [ $1 == "mysql" ]
then
    mysql -ukarthik -pkarthik
fi