#
# chmod u+x
# sh continuousServer.sh

for ((i=0; i<=10; i++)); do
    # echo "http://example.com/$i.jpg"
    node KnAllEdgeBackend 8042
done
