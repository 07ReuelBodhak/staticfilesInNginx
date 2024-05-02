## **image cacheing and load balancing** 

This is simple project in which we can cache image in nginx server and forward to the client

# **Table of Contents**

- Installation
- Infortmation
- Usage
- License

# **Installation**

you can locate to ther server folder and type this command in terminal
docker compose up || docker compose up --scale node-app:3 (if you want to scale your app)

# **Information**

what is an nginx ? 
nginx is simply an webserver thats the official website says and all tutorials i have watched says so 

what can it do ?
- we can use it as reverse proxy if we have a node js application at the backend rather than sending request to node js server we send request to nginx server that resolve those request 
- we can also use it for load balancing means if the clien send request it distributes those request among multiple server like if u have 4 or 5 server running on differnt port or on even same port or u just have mulitple instance of your node js app running same thing it distributes those request 
- it can use to cache static files or images like lets say when client request the page and the page has one static image rather than requesting those image from the backend server again and again the nginx store the image in a cache and provide those image so whats so special in it the special thing is it saves time and also reduces the load on backend server

now there are so many different feature of nginx but we have done this so far in our code 

also one thing if anyone dont know about docker it is like lets say it is like a school bag 
in our school bag there are various items so if we need some item we just pull them out and use it similarly in docker if we need some image we pull it and use it.

so now what is an image it is like a lets say a lego bricks , so each lego sets comes with an instruction like how to build a space ship and all similarly docker image is a set of lego instead of bricks it contains programs and stuff that we dont need to worry about and like when we use instruction to build lego similarly our computer follows instruction that comes with the image and make it ready for us to use.

there is one more important term called docker container as name suggest its a container thats all like in that we have bunch images that our program need that's what it is use for so main purpose of container is like lets say u make a mern stack project and that project runs completly great in your computer but when u share same folder and all and when someone else try to use that code its not working 

dissapointing right so docker-container resolve this issue and also u can run ur app obviously in it much smoother way thnx to docker lightweight images 

# **usage**
in this i will tell only about nginx cause thats all it is about

upstream nodejs-servers {
    server server-node-app-1:3000; #name of my running node app
}
so upstream here u can define ur mulitple backend server as i told u for load balancing and when u use docker compose to scale ur node app  u do have to get the ip address or name  of the ruuning app you can do it by typing this command "docker inspect <container id or name > | grep IPAddress" ypu can find the container id or name by typing this code "docker ps"

on in server block server {} 
listen 80; means the port ur nginx server is listening to 
okay one more confusing thing came in my mind when i was studying like okay nginx server running on 80 and node server is running on 3000 how do they communicate with each other 
so in docker-compose.yml in nginx u will see this ports : - "3000:80" what does it mean it mean that when client request to port 3000 the docker will forward those request to 80 inside the container where nginx is running.

**1** proxy_set_header X-Real-IP $remote_addr;: Sets the X-Real-IP header to the IP address of the client making the request. This header can be used by the backend server to identify the real IP address of the client, especially when requests pass through proxies or load balancers.

**2** $proxy_add_x_forwarded_for;: Appends the client's IP address to the X-Forwarded-For header. This header is used to track the chain of proxy servers that the request has passed through, helping the backend server determine the original client's IP address.

**3** proxy_set_header Host $http_host;: Sets the Host header to the value of the Host header received from the client's request. This ensures that the backend server receives the correct host name, especially when requests are forwarded from Nginx to the backend server.

**4** proxy_set_header X-NginX-Proxy true;: Sets the X-NginX-Proxy header to true to indicate that the request was proxied by Nginx. This header can be useful for the backend server to identify requests that have been forwarded by Nginx.

**5** proxy_pass http://nodejs-servers;: Specifies the backend server to which Nginx should forward the requests. In this case, requests are forwarded to a group of backend servers defined in the http://nodejs-servers upstream block.

**6** proxy_redirect off;: Disables automatic redirection of HTTP redirects from the backend server. This ensures that Nginx passes HTTP redirects received from the backend server back to the client without modification.

proxy_cache_path /var/cache/nginx keys_zone=my_cache:10m inactive=60m levels=1:2 max_size=10g;

**1** proxy_cache_path /var/cache/nginx: Specifies the directory where cached files will be stored.

**2** keys_zone=my_cache:10m: Defines a shared memory zone named "my_cache" with a size of 10 megabytes. This zone is used to store cache keys and metadata.

**3** inactive=60m: Sets the time period after which cached items are considered inactive and can be removed from the cache. In this case, items become inactive after 60 minutes of not being accessed.

**4** levels=1:2: Sets the directory structure for storing cached files. In this case, it uses a one-level directory structure with two subdirectories.

**5** max_size=10g: Specifies the maximum size of the cache storage. In this case, the maximum size is set to 10 gigabytes.

proxy_cache my_cache;
proxy_cache_methods GET;
proxy_cache_valid 200 10m;
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
proxy_cache_lock on;
add_header X-Proxy-Cache $upstream_cache_status;

**1** proxy_cache my_cache;: Specifies the name of the cache zone to use for storing cached responses. In this case, it's named "my_cache".

**2** proxy_cache_methods GET;: Specifies which HTTP methods should be cached. Here, only GET requests will be cached.

**3** proxy_cache_valid 200 10m;: Specifies how long responses with a status code of 200 (OK) should be cached. In this case, responses will be cached for 10 minutes.

**4** proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;: Defines which stale cached responses are allowed to be used when there are errors or timeouts, or when responses with specific status codes (500, 502, 503, 504) are received from the backend server.

**5** proxy_cache_lock on;: Enables locking to prevent multiple requests from simultaneously refreshing the cache for the same resource.

**6** add_header X-Proxy-Cache $upstream_cache_status;: Adds a header to responses indicating whether the response was served from the cache or fetched from the backend server. The value of this header will be the status of the cache lookup (e.g., "MISS" if not found in cache, "HIT" if found).

and else was just a default error page when server is down

# **License**

This project is licensed under the MIT License.
