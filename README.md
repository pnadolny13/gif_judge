# Gif Judge

The react front end is hosted on GitHub pages and the API backend is hosted on API gateway.

The following will deploy the backend API, it needs an aws profile to be set in the session.

```bash
export AWS_PROFILE=personal
make terraform_up
```

The following will build and deploy the react front end to GitHub pages.
If the changes arent reflected then the job might need to be manually triggered in the Actions tab.

```bash
make app_deploy
```

## References

https://medium.com/@grahamflas/how-to-create-a-simple-gif-searching-app-with-a-react-frontend-and-rails-backend-and-a-backend-13fd77bf152

https://tighten.co/blog/react-101-building-a-gif-search-engine/
