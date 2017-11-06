#!/usr/bin/env bash

urlToCheck=http://localhost:3000
response=null
until test $response = 200
    do
    response=$(curl --write-out %{http_code} --silent --output /dev/null $urlToCheck)
    echo "Waiting the server..."
done

echo "Server up"
