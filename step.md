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

**API Gateway**
- d-ec-apigw
- Lambda proxy integration to parse the multipart/form-data request
- Enable CORS inside Lambda ?
- Multipart/form-data support: 
  - Base64 encode the file in the request body
  - Decode it in the Lambda function
  - Use the AWS SDK to upload the file to S3

**RDS**
- d-ec-rds
- MySQL database
- RDS Proxy: 1 SG - 3 inbound rules: For Lambda, and RDS since Proxy and Instance using 1 SG
- Store user information (name, email, password hash, etc.)
- Restore through bastion host

**ALB**
- EC2 uesr data:
- Add role ec-secret-reader to the EC2 instance
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
pm2 save



```
