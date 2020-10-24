#!/bin/bash
#Setup cockroach
$HOME/piscripts/cockroachcerts.sh
sleep 5
#Start cockroach
cockroach start-single-node --background  --certs-dir=${HOME}/.cockroachdb/certs/node --listen-addr=localhost --store=${HOME}/.cockroachdb/data
#Run DB setup piscripts
sleep 5
$HOME/piscripts/cachesetup.sh
$HOME/piscripts/cmssetup.sh
$HOME/piscripts/userdbsetup.sh
$HOME/pibins/politeiawww_dbutil -createkey
sleep 5
#Start politeiad
$HOME/pibins/politeiad --buildcache &
sleep 10
#Start politeiawww and fetch identity (Needs enter)
{ printf '\n'; sleep 5; } | $HOME/pibins/politeiawww --fetchidentity
sleep 10
#Start politeiawww normally
$HOME/pibins/politeiawww &
sleep 10
#Admin user
$HOME/pibins/piwww newuser adminuser@example.com adminuser password --verify
$HOME/pibins/politeiawww_dbutil -cockroachdb  -testnet -setadmin adminuser true
$HOME/pibins/politeiawww_dbutil -cockroachdb  -testnet -addcredits adminuser 100
#User1 with one credit
$HOME/pibins/piwww newuser user1@example.com user1 password --verify
$HOME/pibins/politeiawww_dbutil -cockroachdb  -testnet -addcredits user1 1
#User2 with no credit
$HOME/pibins/piwww newuser user2@example.com user2 password --verify
#User3 paywall not paid
$HOME/pibins/piwww newuser user3@example.com user3 password --verify
#Paywall
adminuser_uuid=`$HOME/pibins/piwww login adminuser@example.com password | \
  jq -r "select(.userid).userid"`
user1_uuid=`$HOME/pibins/piwww login user1@example.com password | \
  jq -r "select(.userid).userid"`
$HOME/pibins/piwww login adminuser@example.com password
$HOME/pibins/piwww manageuser ${adminuser_uuid} clearpaywall "causeadminuser"
$HOME/pibins/piwww manageuser ${user1_uuid} clearpaywall "causeuser1"