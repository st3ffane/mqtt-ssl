#listener 1883
#listener 1884
#protocol websockets
# plain MQTT protocol
listener 1883

listener 1884
protocol websockets

#MQTT over TSL/SSL force v1.2
listener 8883
cafile /home/user/Documents/MQTT/secured/certs/ca.crt
certfile /home/user/Documents/MQTT/secured/certs/nomodie-SVF15N2L2ES.crt
keyfile /home/user/Documents/MQTT/secured/certs/nomodie-SVF15N2L2ES.key
tls_version tlsv1.2

#websocket over TSL/SSL
listener 9883
protocol websockets
cafile /home/user/Documents/MQTT/secured/certs/ca.crt
certfile /home/user/Documents/MQTT/secured/certs/nomodie-SVF15N2L2ES.crt
keyfile /home/user/Documents/MQTT/secured/certs/nomodie-SVF15N2L2ES.key
tls_version tlsv1.2