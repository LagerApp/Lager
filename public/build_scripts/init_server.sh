echo "Creating new UNIX user: lager"
sudo adduser lager
sudo mkdir /home/lager/.ssh/

echo "Adding Lager server's SSH keys into authorized_keys"
sudo echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDMGCQxyA6VK3c8USiMkhWz+accbxFuMql+Smo8qgyEm8IoIAOWyvjdHs4zsByfSUSTSJ3TqydMJQTx+SS3zbfPEVVhmM/BmNrDuvsHfssuXgs6Ob7KD+UzD8VrQlrPApVKunSm72ZWH95QlOD3jdWFr6pnV9YAgxpMwz2x7CxXmRe9ZgFwh4lAdo7VTeADZHMJAt0f0bBQecxBFGTTYZ71ehqsYKhXilbmnpHFBNFdyBEEszGFQjF1djniaD3Rk480pFDb3D24lNUbb8kdVujhd+9ZdDJ09WJuzPMVqCp+1Lz1tbqsNCHF1LCupcb1+V6YCz1geQE6DspVWfaOwd95 rahij@hackercave.local" | sudo tee --append /home/lager/.ssh/authorized_keys

ip_address=`dig @ns1.google.com -t txt o-o.myaddr.l.google.com +short | tr -d '"'`
echo "Notifying Lager server of new server. Make sure that this host can connect to http://122.164.33.65:4567"
curl --data "server[ip]=$ip_address" http://122.164.33.65:4567/servers