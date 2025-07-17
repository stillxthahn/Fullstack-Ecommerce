**S3**
- d-ec-products
- Folder: uploads
- Allow **public access**
- CORS enabled
- Bucket policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
	{
	  "Sid": "PublicReadGetObject",
	  "Effect": "Allow",
	  "Principal": "*",
	  "Action": "s3:GetObject",
	  "Resource": "arn:aws:s3:::d-ec-products/*"
	}
  ]
}
```

**Static website**
-  aws s3 sync dist/ s3://d-ec.vpbank.click --delete --profile vpbank

**API Gateway**
- d-ec-apigw
- Lambda proxy integration to parse the multipart/form-data request
- Enable CORS inside Lambda ?
- Multipart/form-data support: 
  - Base64 encode the file in the request body
  - Decode it in the Lambda function
  - Use the AWS SDK to upload the file to S3

**RDS**
sudo dnf update -y
sudo dnf install mariadb105

mysql -h d-ec-rds.cafie6gkkcoq.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p \
      -D mydb < mysql-dump.sql
- d-ec-rds
- MySQL database
- RDS Proxy: 1 SG - 3 inbound rules: For Lambda, and RDS since Proxy and Instance using 1 SG
- Store user information (name, email, password hash, etc.)
- Restore through bastion host

**ALB**
- Add role ec-secret-reader to the EC2 instance
- SG inbound rules: HTTP: 3000 from ALB
  - HTTP: 80 from anywhere
  - HTTPS: 443 from anywhere
- SG outbound rules: MYSQL: 3306 to RDS
- EC2 uesr data:
```bash
#!/bin/bash
sudo dnf update -y
sudo dnf install -y git
sudo dnf install -y nodejs
git clone https://github.com/stillxthahn/Fullstack-Ecommerce
cd Fullstack-Ecommerce/backend
sudo npm install
sudo npm install -g pm2
pm2 start server.js --name "backend" --watch
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/nodejs18/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save

```
- Target group: Listen on port 3000
- Health check path: /health

**Lambda**
- Connect RDS:
  - Auto attach IAM role with permissions to access RDS 
  - Auto create SG:
    - rds-lambda-3: Ingress rule for allowing lambda function to connect to rds db -> map to lambda-rds-1
    - lambda-rds-1: Egress rule for allowing lambda function to connect to rds db -> map to rds-lambda-3, rds-lambda-1
- Add proxy:
  - Auto attach IAM role with permissions to access RDS Proxy
  - Auto create SG:
    - rdsproxy-lambda-2: Ingress rule for allowing lambda function to connect to rds proxy -> map to lambda-rdsproxy-2
    - lambda-rdsproxy-2: Egress rule for allowing lambda function to connect to rds proxy -> map to rdsproxy-lambda-2, rdsproxy-lambda-2 