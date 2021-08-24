#!/usr/bin/env bash

#Admin user
pictl usernew adminuser@example.com adminuser password --verify
politeiawww_dbutil -cockroachdb  -testnet -setadmin adminuser true
politeiawww_dbutil -cockroachdb  -testnet -addcredits adminuser 100

#User1 with one credit
pictl usernew user1@example.com user1 password --verify
politeiawww_dbutil -cockroachdb  -testnet -addcredits user1 1

#User2 with no credit
pictl usernew user2@example.com user2 password --verify

#User3 paywall not paid
pictl usernew user3@example.com user3 password --verify

#Paywall
adminuser_uuid=`pictl login adminuser@example.com password | \
  jq -r "select(.userid).userid"`
user1_uuid=`pictl login user1@example.com password | \
  jq -r "select(.userid).userid"`
pictl login adminuser@example.com password
pictl usermanage ${adminuser_uuid} clearpaywall "causeadminuser"
pictl usermanage ${user1_uuid} clearpaywall "causeuser1"
