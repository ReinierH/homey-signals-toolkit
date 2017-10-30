# Homey signals toolkit

Homey signals toolkit provides tools to developers in order to properly filter signals. The tool uses the
Athom web api in order to record signals, filters noisy signals and writes the relevant signals in csv format to a file

## Prerequisites

* NodeJS
* npm

## Installing

Clone the repository 
```
git clone git@github.com:ReinierH/homey-signals-toolkit.git
```
Run npm install inside the root directory
```
npm install
```
## Record

Record can be used to record ir, 433 or 868 signals. It automatically filters the proper signal by counting repeating signals, and stores
that specific signal to a file.

usage:
```
node record.js <filename> <433|868|ir> <timeout>
```

