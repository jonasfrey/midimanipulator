pid_websersocket=$(pgrep -f "websersocket_07d513fd-433b-4a89-a4dc-ee25dbc4fb6b.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd