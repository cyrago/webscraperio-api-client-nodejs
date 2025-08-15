#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

// Import the Client from the built SDK
const { Client } = require('./dist/cjs/index.js');

// Check if API key is available
if (!process.env.WEBSCRAPERIO_API_KEY) {
    console.error('Error: WEBSCRAPERIO_API_KEY not found in .env file');
    process.exit(1);
}

// Create client instance
const client = new Client({
    token: process.env.WEBSCRAPERIO_API_KEY,
    useBackoffSleep: true
});

// Helper function to run a test
async function runTest(testName, tagParam, expectedCondition) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${testName}`);
    console.log(`Tag parameter: ${tagParam === undefined ? 'none (fetch all)' : `"${tagParam}"`}`);
    console.log('-'.repeat(60));
    
    try {
        // Create generator with or without tag
        const generator = tagParam === undefined 
            ? client.getSitemaps() 
            : client.getSitemaps(tagParam);
        
        // Fetch all records
        const sitemaps = await generator.getAllRecords();
        
        // Display results
        console.log(`Sitemaps returned: ${sitemaps.length}`);
        
        // Check if test passes based on expected condition
        const testPassed = expectedCondition(sitemaps.length);
        console.log(`Status: ${testPassed ? '✅ PASSED' : '❌ FAILED'}`);
        
        // Display sitemap names if any
        if (sitemaps.length > 0 && sitemaps.length <= 10) {
            console.log('\nSitemaps found:');
            sitemaps.forEach((sitemap, index) => {
                console.log(`  ${index + 1}. ID: ${sitemap.id}, Name: ${sitemap.name || sitemap._id}`);
            });
        } else if (sitemaps.length > 10) {
            console.log(`\nShowing first 10 sitemaps:`);
            sitemaps.slice(0, 10).forEach((sitemap, index) => {
                console.log(`  ${index + 1}. ID: ${sitemap.id}, Name: ${sitemap.name || sitemap._id}`);
            });
            console.log(`  ... and ${sitemaps.length - 10} more`);
        }
        
        return testPassed;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log(`Status: ❌ FAILED (Error occurred)`);
        return false;
    }
}

// Main function to run all tests
async function main() {
    console.log('Web Scraper API - Tag Parameter Test Suite');
    console.log('='.repeat(60));
    console.log('This script tests the getSitemaps() method with different tag parameters\n');
    
    let passedTests = 0;
    const totalTests = 3;
    
    // Test 1: With tag="test" - should return exactly 1 sitemap
    const test1Passed = await runTest(
        'Get sitemaps with tag="test"',
        'test',
        (count) => count === 1
    );
    if (test1Passed) passedTests++;
    
    // Test 2: Without tag parameter - should return all sitemaps (at least 1)
    const test2Passed = await runTest(
        'Get all sitemaps (no tag filter)',
        undefined,
        (count) => count >= 1
    );
    if (test2Passed) passedTests++;
    
    // Test 3: With tag="invalid-tag" - should return 0 sitemaps
    const test3Passed = await runTest(
        'Get sitemaps with tag="invalid-tag"',
        'invalid-tag',
        (count) => count === 0
    );
    if (test3Passed) passedTests++;
    
    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Overall: ${passedTests === totalTests ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    // Exit with appropriate code
    process.exit(passedTests === totalTests ? 0 : 1);
}

// Run the tests
main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
});