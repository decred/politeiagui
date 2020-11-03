#!/bin/bash
cockroach start-single-node --background  --certs-dir=${HOME}/.cockroachdb/certs/node --listen-addr=localhost --store=${HOME}/.cockroachdb/data
sleep 5
$HOME/pibins/politeiad --buildcache 1>&- 2>&-  &
sleep 5
$HOME/pibins/politeiawww 1>&- 2>&-  &
sleep 5
nginx
echo "Started"