echo setting up records

# login with an admin user
max_length=20

login=`pictl login adminuser@example.com password && pictl userkeyupdate | \
  jq -r "select(.proposalcredits).proposalcredits"`

# SETUP UNAUTHORIZED RECORDS
# gets inventory from unauthorized records
inventorylen=`pictl voteinv | \
  jq -r "select(.vetted).vetted.unauthorized" | \
  jq length`

# checks if vote inventory has < 20 unauthorized records and creates 
# the required proposals amount
# change operator to lt
if [ "$inventorylen" -lt "20" ]
then 
  # gets proposal token
  diff="$((max_length-inventorylen+1))"

  echo inventory incomplete. Needs to create $diff proposals
  # add credits to user for proposal submission
  politeiawww_dbutil -cockroachdb  -testnet -addcredits adminuser $diff
  for i in $(seq 1 $diff)
  do
    token=`pictl proposalnew --random | \
      jq -R 'match("(?<=Token  : ).*";"g")' | \
      jq -r "select(.string).string"`
    # set status to public
    proposal=`pictl proposalsetstatus $token public`
    # print output
    echo created new public proposal $token $i/$diff
  done
else
  echo inventory length is ok
fi
