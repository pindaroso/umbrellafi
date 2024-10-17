include riskengine/.env
include contracts/.env
export

install-macos:
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	brew install node jq gettext libusb gcc cmake pyenv pyenv-virtualenv gfortran openblas
	npm install --global yarn
	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
	curl -L https://foundry.paradigm.xyz | bash
	foundryup

install-linux:
	apt-get update
	apt-get install make build-essential libssl-dev zlib1g-dev
	apt-get install libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm
	apt-get install libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
	curl https://pyenv.run | bash

build:
	cd contracts; forge build
	cd app; yarn; yarn build

dev:
	cd app; yarn dev

sync-typechain:
	envsubst < app/env.txt > app/.env
	rm -rf app/src/abi
	cp -R contracts/out app/src/abi
	rm -rf app/src/abi/**/*.{s,t}.sol app/src/abi/*.{s,t}.sol app/src/typechain
	cd app; yarn typechain
	rm -rf app/src/abi

RUN_FILE=contracts/broadcast/Deploy.s.sol/80001/run-latest.json
FORGE_ARGS:=--rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --broadcast -vvvv
deploy-contracts: 
	cd contracts; forge script DeployScript $(FORGE_ARGS)
	export MANAGER_ADDRESS=$$(cat $(RUN_FILE) | jq -r '.transactions[0].contractAddress') \
	export RISK_ENGINE_ADDRESS=$$(cat $(RUN_FILE) | jq -r '.transactions[0].additionalContracts[0].address'); \
	envsubst < contracts/env.txt > contracts/.env

forge-script:
	cd contracts; forge script $(CMD) $(FORGE_ARGS)

forge-test:
	cd contracts; forge test --match-path test/$(CMD).t.sol -vvvv --fork-url $(RPC_URL)

forge-test-all:
	$(MAKE) forge-test CMD=UniswapV3Liquidity FORK_URL=$(RPC_URL)
	$(MAKE) forge-test CMD=UniswapV3Flash FORK_URL=$(RPC_URL)
	$(MAKE) forge-test CMD=UniswapV3Swap FORK_URL=$(RPC_URL)

bounce:
	$(MAKE) forge-script CMD=RemoveConsumerScript
	$(MAKE) deploy-contracts
	$(MAKE) forge-script CMD=AddConsumerScript
	$(MAKE) forge-script CMD=AddAssetsScript
	$(MAKE) forge-script CMD=CreateETFScript
	$(MAKE) forge-script CMD=UpdateWeightsScript
	$(MAKE) sync-typechain
	$(MAKE) build

setup-riskengine:
	cd riskengine; pyenv init; pyenv install 3.9.1; pyenv virtualenv 3.9.1 riskengine

deploy-riskengine:
	rsync -r riskengine --exclude='__pycache__' -e "ssh -i ~/.ssh/id_ed25519_umbrellafi-xyz" root@167.71.192.89:/root/
	scp -i ~/.ssh/id_ed25519_umbrellafi-xyz riskengine/riskengine.service root@167.71.192.89:/etc/systemd/system/riskengine.service
	ssh -i ~/.ssh/id_ed25519_umbrellafi-xyz root@167.71.192.89 "systemctl daemon-reload && systemctl restart riskengine"

PYENV_ACTIVATE:=eval "$$(pyenv init -)"; eval "$$(pyenv virtualenv-init -)"; pyenv activate riskengine
install-riskengine-requirements: 
	$(PYENV_ACTIVATE); cd riskengine; pip install --upgrade pip; pip install -r requirements.txt

riskengine-cli:
	$(PYENV_ACTIVATE); cd riskengine; python cli.py $(CMD)

riskengine-flask:
	$(PYENV_ACTIVATE); cd riskengine; flask run 
