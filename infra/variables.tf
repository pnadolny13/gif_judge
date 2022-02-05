# Input variable definitions

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "us-east-1"
}

variable "aws_access_key" {
  type    = string
}

variable "aws_secret" {
  type    = string
}

variable "giphy_api_key" {
  type    = string
}