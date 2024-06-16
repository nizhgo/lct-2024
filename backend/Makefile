PYTHON := python
LINT_TARGET := app
MYPY_TARGET := app
lint:
	@${PYTHON} -m isort.main --diff --check ${LINT_TARGET}
	@${PYTHON} -m black --check --diff ${LINT_TARGET}
	@${PYTHON} -m flake8 --statistics ${LINT_TARGET}
	@${PYTHON} -m mypy ${MYPY_TARGET}

format-py:
	@black ${LINT_TARGET}
	@isort ${LINT_TARGET}
	@autoflake --in-place --remove-all-unused-imports -r --ignore-init-module-imports ${LINT_TARGET}

format: format-py