.PHONY: default
default: lint

.PHONY: lint
lint:
	gjslint  --recurse . \
		--disable "210,217,220,225,0212" \
		--exclude_directories "examples,node_modules"
