# StackStorm Graph

Cool visualizations for monitoring data - graphite, collectd3, ganglia

## Install dependencies

1. Install [rrdtool](http://oss.oetiker.ch/rrdtool). On Mac, [homebrew](http://mxcl.github.io/homebrew/) works fine. On Linux - install rrdtool and librrd-dev. E.g.,  ```apt-get install rrdtool, apt-get install librrd-dev```. On Windows, figure this out yourself (and add instructions here). Make sure rrdtool is on the path and working (try ```$ which rrdtool```, ```$ rrdtool```). 

2. Get node dependencies: 

		$ npm install

## Sample data

Get [sample data](https://s3-us-west-1.amazonaws.com/stackstorm/collectd3-sampledata/sampledata.zip) and extract it outside of the project directory.

## Configure
Open `config/default.yml`. Do it!

Set up collectd or whisper directory and initial timestamp.

## Developing

Always use grunt. It continuosly watches for changes, rebuilds, lints and unit-tests the codebase and re-launch the node server. 

Install grunt-cli globally, (```npm install grunt-cli -g```) and run grunt

		$ grunt

Or, use ```grunt-cli``` which is already installed locally

		$ node_modules/.bin/grunt
		
### Unit Tests
	$npm test


### Run server

	$ npm start
