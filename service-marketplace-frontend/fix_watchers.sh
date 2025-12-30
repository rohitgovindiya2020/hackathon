#!/bin/bash
echo "Current limit:"
cat /proc/sys/fs/inotify/max_user_watches

echo "Increasing limit to 524288..."
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p admin@123

echo "Done! New limit:"
cat /proc/sys/fs/inotify/max_user_watches
echo "You can now run 'npm start'!"
