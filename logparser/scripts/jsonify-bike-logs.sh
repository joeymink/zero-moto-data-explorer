#!/bin/sh

for i in `ls /app/bike-logs/*.bin`
do
    file_basename=`basename $i`

    echo "Processing $file_basename..."
    echo "- running parser..."
    cd /app/zero-log-parser
    parsed_filename=/app/parsed-logs/$file_basename.txt
    python zero_log_parser.py $i -o $parsed_filename

    echo "running extractor..."
    cd /app/zero-log-data-extractor
    parsed_basename=`basename $parsed_filename`
    python extract_ride_data.py --format json --outfile /app/json-logs/$parsed_basename.json $parsed_filename
    echo "Finished $file_basename!"
    echo
done
