# rpyc client
import sys
try:
    sys.path.append('/var/colabo/colabo-env/lib/python2.7/site-packages/')
except:pass
import rpyc
conn = rpyc.connect("localhost", 12345)
c = conn.root

#text = 'Why do Mexicans come to America?'
#print c.get_norms(text, 1)


# do stuff over rpyc
if __name__ == "__main__":
    
    if len(sys.argv) == 2:
        mid = sys.argv[1]
    
        r = c.get_sims(mid)
        print r

    if len(sys.argv) == 4:
        mid = sys.argv[1]
        uid = sys.argv[2]
        rid = sys.argv[3]
    
        r = c.get_sims_for_user(mid, uid, rid)
        print r
