default: build

build: doc/
	docker run -it --rm -v `pwd`:/documents -p 8000:8000 moird/mkdocs mkdocs build
