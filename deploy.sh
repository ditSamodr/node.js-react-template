echo "Switching to branch master"
git checkout master

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r radit@172.232.231.25:var/www/umbra-2.prolead.id/

echo "Done!"