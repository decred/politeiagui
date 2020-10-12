# politeiae2e

This can be used for e2e testing and also generalized testing of the full politeiagui -> politeiawww -> politeiad stack.

Note: This does not currently support cms. 

## How to setup politeiae2e


Build the docker image using the commands `chmod +x build.sh` and `./build.sh`. 

`build.sh` has a certificate creation command that can be edited if needed. 

It creates a file `dockerfiles/nginx.cert` that can be imported to your browser or testing program as a trusted cert.

### detach start:

`docker run -d --rm -p 8443:443 politeiae2e`

### attached start:

`docker run -it --rm -p 8443:443 politeiae2e`

### drop a shell (for debugging):

`docker run --rm -it --entrypoint /bin/sh politeiae2e`


### Default Useraccounts:

#### **adminuser:**
adminuser@example.com

password

#### **user1:**
user1@example.com

password

#### **user2:**
user2@example.com

password

more can be added by editing `dockerfile/setup.sh`