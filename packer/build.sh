#!/bin/bash
FILE=/home/ec2-user/webapp.zip
EXTRACTED_PATH=/home/ec2-user/webapp/
CODE_BASE=/home/ec2-user/webapp/

sleep 30

sudo yum update -y
sudo yum upgrade -y
# Installing git
sudo yum install -y git

# Installing node
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs
# Checking if node installed
node -e "console.log('Running Node.js ' + process.version)"

# Installing postgres
sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg14]
name=PostgreSQL 14 for RHEL/CentOS 7 - x86_64
baseurl=https://download.postgresql.org/pub/repos/yum/14/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

sudo yum update -y
sudo yum install postgresql14 postgresql14-server -y 
sudo /usr/pgsql-14/bin/postgresql-14-setup initdb
sudo systemctl start postgresql-14
sudo systemctl enable postgresql-14
# Status of postgres 
sudo systemctl status postgresql-14

# Creating database and User
sudo -u postgres psql -c 'CREATE DATABASE csye6225;'
sudo -u postgres psql -c "CREATE USER \"ec2-user\" WITH PASSWORD 'pass';"
sudo -u postgres psql -c 'GRANT ALL PRIVILEGES ON DATABASE csye6225 TO "ec2-user";'


sudo yum install unzip -y

sudo mv /tmp/webapp.zip /home/ec2-user/webapp.zip

if [ -f "$FILE" ]; then
    echo "$FILE exists. Unzipping the file"
    unzip $FILE -d $EXTRACTED_PATH
fi

# git clone https://icecube-pixel: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@github.com/csye-6225-northeastern-org/webapp.git

# installing dependencies
cd $CODE_BASE
npm i

# ls /tmp/
# moving service file from temp location to systemd location
sudo cp /tmp/webapp.service /etc/systemd/system/
sudo chmod 664 /etc/systemd/system/webapp.service
sudo systemctl daemon-reload
sudo systemctl start webapp.service
sudo systemctl enable webapp.service
# # Status of Webapp
sudo systemctl status webapp.service
journalctl -u webapp.service

