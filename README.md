# ConCaVa Documentation

## Dependencies

- Docker

## Development

Help and feedback are highly appreciated!

### Local

```bash
git clone git@github.com:kukua/concava
cd concava
git checkout gh-pages
git submodule init
git submodule update
make # to build, or

make serve
# Navigate to http://localhost:8000
# Make changes + PRs

# Give latest folder back to current user
sudo chown -R $USER:$USER .
```
