#!/bin/sh

(curl concava:1026/v1/queryContext -s -S --header 'Content-Type: application/json' \
    --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "entities": [
        {
            "type": "SensorData",
            "isPattern": "true",
            "id": "${1:-0000000000000001-.*}"
        }
    ]
}
EOF
