terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.48.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  backend "s3" {
      bucket  = "gif-terraform-state-backend"
      encrypt = true
      key     = "gif_judge/terraform.tfstate"
      region  = "us-east-1"
      dynamodb_table = "gif-terraform-state-state-lock"
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

resource "random_pet" "lambda_bucket_name" {
  prefix = "gif"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id

  acl           = "private"
  force_destroy = true
}


data "archive_file" "lambda_gif_judge" {
  type = "zip"

  source_dir  = "${path.module}/.temp"
  output_path = "${path.module}/gif-judge.zip"

}

resource "aws_s3_bucket_object" "lambda_gif_judge" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "gif-judge.zip"
  source = data.archive_file.lambda_gif_judge.output_path

  etag = filemd5(data.archive_file.lambda_gif_judge.output_path)

}

resource "aws_lambda_function" "lambda_gif_judge" {
  function_name = "GifJudge"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_bucket_object.lambda_gif_judge.key

  runtime = "python3.8"
  handler = "main.handler"

  source_code_hash = data.archive_file.lambda_gif_judge.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      AWS_ACCESS = var.aws_access_key,
      AWS_SECRET = var.aws_secret,
      GIPHY_API_KEY = var.giphy_api_key
    }
  }
}

resource "aws_cloudwatch_log_group" "gif_judge" {
  name = "/aws/lambda/${aws_lambda_function.lambda_gif_judge.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_api_gateway_rest_api" "api_lambda" {
  name        = "gif_judge_api"
}

resource "aws_api_gateway_resource" "proxy" {
   rest_api_id = aws_api_gateway_rest_api.api_lambda.id
   parent_id   = aws_api_gateway_rest_api.api_lambda.root_resource_id
   path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_method" {
   rest_api_id   = aws_api_gateway_rest_api.api_lambda.id
   resource_id   = aws_api_gateway_resource.proxy.id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
   rest_api_id = aws_api_gateway_rest_api.api_lambda.id
   resource_id = aws_api_gateway_method.proxy_method.resource_id
   http_method = aws_api_gateway_method.proxy_method.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.lambda_gif_judge.invoke_arn
}




resource "aws_api_gateway_method" "proxy_root" {
   rest_api_id   = aws_api_gateway_rest_api.api_lambda.id
   resource_id   = aws_api_gateway_rest_api.api_lambda.root_resource_id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
   rest_api_id = aws_api_gateway_rest_api.api_lambda.id
   resource_id = aws_api_gateway_method.proxy_root.resource_id
   http_method = aws_api_gateway_method.proxy_root.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.lambda_gif_judge.invoke_arn
}


resource "aws_api_gateway_deployment" "apideploy" {
   depends_on = [
     aws_api_gateway_integration.lambda,
     aws_api_gateway_integration.lambda_root,
   ]

   rest_api_id = aws_api_gateway_rest_api.api_lambda.id
   stage_name  = "test"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_api_gateway_rest_api.api_lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_gif_judge.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.api_lambda.execution_arn}/*/*"
}

resource "aws_dynamodb_table" "games" {
  name           = "games"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

}

resource "aws_dynamodb_table" "players" {
  name           = "players"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

}

resource "aws_dynamodb_table" "selections" {
  name           = "selections"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

}
