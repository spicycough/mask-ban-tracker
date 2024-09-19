#!/bin/bash

wrangler r2 object put BUCKET_SOURCEDATA/counties-data \
  --file ./public/static/us-counties.geojson \
  --cache-control "public, max-age=31536000" \
  --content-type application/json \
  --persist-to ../.cache/ \
  --local

wrangler r2 object put BUCKET_SOURCEDATA/states-data \
  --file ./public/static/us-states.geojson \
  --cache-control "public, max-age=31536000" \
  --content-type application/json \
  --persist-to ../.cache/ \
  --local
