# Zero Motorcycles Data Explorer

This is totally a work-in-progress. Five minutes here, 20 minutes there... The goal
is to ultimately provide an end-to-end solution to go from your raw bike logs
to a fun visual presentation of that data.

## Usage

Constantly changing, but at this point...

### Build it
1. `docker-compose -f compose-local.yml build`

### Place your motorcycle's log files
1. Create folder if it doesn't exist yet, `mkdir bike-logs`
2. Place your bike's `.bin` log files in the `bike-logs` folder

### Run the logparser on your bike's logs
1. `docker-compose -f compose-local.yml run logparser`

### Run the ingestion process
1. `docker-compose -f compose-local.yml run web`
