#Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
echo "Login Azure"
az login

#copy Github directory
git clone https://github.com/marcellypedra/Crochet-App.git

#Install Node.js
cd Crochet-App
cd serverconfig
npm init -y

#Install express
npm install express










