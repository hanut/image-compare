# John's Image Tool

This image tool was built with ❤️to let John
do what he does best without wasting too much time
on manual, boring stuff. Automation FTW !!!

## Application Architecture

The application is a simple nodejs command line tool
that reads a csv file containing rows of image files with each row
having 2 image paths. The program checks the two images and reports
with a score of likeness that was previously being done by John manually.


Modules -
1. Command line argument parser
2. CSV Reader - Reads the input CSV
3. Image File Reader - Reads in the source image files, converts them to the required format and returns the png data
4. Image Matcher - Compares two pngs and returns a "John Score"
5. CSV Writer - Writes out the results to the output csv file 

The input CSV files are expected to have a header row containing the `image1` and `image2` values exactly and the paths
provided to the application are assumed to be absolute paths.


## Project Dependencies

The application uses a number of third party packages to reduce the amount
of maintenance effort required to keep the tool running. Below is a list of 
all the libraries/packages used by John's Image Tool - 

1. **fast-csv** - Fast-csv is library for parsing and formatting CSVs or any other delimited value file in node.
2. **sharp** - To work with input images so that both images as processed to be comparable
3. **resemblejs** - Used to actually match the images


## Testing
Test cases can be run using the `npm run test` command

There are test fixtures for all modules/functions in the `/tests` folder

## User Guide

### Installation
You can install the tool using the following command -

```bash
npm i -g https://github.com/hanut/image-compare
```

###
