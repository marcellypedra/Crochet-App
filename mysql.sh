
# Update the system
echo "Updating the system..."
sudo apt-get update

# Install MySQL Server
echo "Installing MySQL Server..."
sudo apt-get install -y mysql-server

# Start MySQL service
echo "Starting MySQL service..."
sudo service mysql start

# Secure MySQL installation
echo "Securing MySQL installation..."
sudo mysql_secure_installation

# Login as root and create a database and user
echo "Creating database and user..."
MYSQL_ROOT_PASSWORD="your_root_password" #SET YOUR ROOT PASSWORD
DATABASE_NAME="Crochet_App"  
DATABASE_USER="your_user"  #SET YOUR USERNAME
DATABASE_PASSWORD="your_password" #SET YOUR USER PASSWORD

# Using MySQL commands to create database, user, and grant permissions
sudo mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "
CREATE DATABASE IF NOT EXISTS $DATABASE_NAME;
CREATE USER IF NOT EXISTS '$DATABASE_USER'@'localhost' IDENTIFIED BY '$DATABASE_PASSWORD';
GRANT ALL PRIVILEGES ON $DATABASE_NAME.* TO '$DATABASE_USER'@'localhost';
FLUSH PRIVILEGES;
"

# Database and table creation script
SQL_SCRIPT=$(cat <<EOF
USE Crochet_App;

CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    materials TEXT,
    project_type ENUM('ongoing', 'closed') DEFAULT 'ongoing',
    image VARCHAR(255)
);
EOF
)

# Run the SQL script
echo "Setting up the MySQL database..."
mysql -u "$DATABASE_USER" -p"$DATABASE_PASSWORD" -h "localhost" -e "$SQL_SCRIPT"

if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
else
    echo "Error: Database setup failed."
fi