terraform {
    required_providers {
        render= {
            source = "render-oss/render"
            version= "~> 1.9"
        }
    }
}

provider "render" {
    owner_id = "tea-daj69teq1p3s73a9e0v0"
}

resource "render_web_service" "social_media_api" {
    name = "social_media_api"
    plan = "free"
    region = "singapore"

    runtime_source = {
        image= {
            image_url = "docker.io/princeofsaiyans/sm-api"
            tag     = "latest"
        }
    }
     env_vars = {
      MONGODB_URI = {
        value = var.mongodb_uri  //Take the actual MongoDB URI from the Terraform variable mongodb_uri and give it to Render as MONGODB_URI.
    }

     CLOUDINARY_CLOUD_NAME = {
      value = var.cloudinary_cloud_name
    }

    CLOUDINARY_API_KEY = {
      value = var.cloudinary_api_key
    }

    CLOUDINARY_API_SECRET = {
      value = var.cloudinary_api_secret
    }

    JWT_SECRET = {
      value = var.jwt_secret
    }
  }

 }