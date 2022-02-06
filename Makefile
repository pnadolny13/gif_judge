terraform_init:
	source .env && cd infra && terraform init

terraform_deploy:
	cd api && python3 -m venv venv && source venv/bin/activate && pip install -r api/requirements.txt && cp -r ./venv/lib/python3.9/site-packages/ ../infra/.temp && cp -r api/* ../infra/.temp
	source .env && cd infra && terraform apply -auto-approve

terraform_down:
	cd infra && terraform destroy

api_local:
	source .env && cd api/api/ && uvicorn main:app --reload

app_local:
	source .env && cd gif-judge && npm start
