Build it
--------
1. `docker-compose -f compose-local.yml build`

Place your motorcycle's log files
---------------------------------
1. Create folder if it doesn't exist yet, `mkdir bike-logs`
2. Place your bike's `.bin` log files in the `bike-logs` folder

Run the logparser on your bike's logs
-------------------------------------
1. `docker-compose -f compose-local.yml run logparser`

