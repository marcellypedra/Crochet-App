
#install node.js
echo "Installing node.js"
apt install -y nodejs

#install NPM nd init NPM
echo "Installing NPM package"
apt install -y npm
npm init -y

#install packages (express, multer, path,mysql2 and Bcrypt)
echo "Installing packages express,path, multer, bcryptjs, mysql2 and os"
npm install express path multer bcryptjs mysql2 os

#install packages for unit tests
echo "Installing packages for unit tests"
npm install mocha chai chai-http sinon












