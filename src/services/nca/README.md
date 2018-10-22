# Running the NCA calcullation

```sh
# login from local terminal
ssh -i ~/.ssh/sasha-iaas-no.pem mprinc@158.39.75.130
ssh -i ~/.ssh/sinisha-iaas-no.pem sir@158.39.75.130
# get in the folder
cd /var/colabo/
# activate python environment with necessary packages, etc
source /var/colabo/colabo-env/bin/activate

# python sv_client.py <map_id> <cluster_size>
python sv_client.py "5b96619b86f3cc8057216a03" 4
```

# Presenting the NCA clusters

```sh
# login with SFTP client (CyberDuck, Filezilla, ...)
# from `/var/colabo/` copy on the local machine
# you need this only one is OK
sdg_groups.html
# every time you rerun the calcullation
sdg.json
# then just open the `sdg_groups.html` in browser
```

