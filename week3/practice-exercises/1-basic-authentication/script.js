
/**
 * 2. Authentication
 * 
 * Using node-fetch make an authenticated request to https://restapiabasicauthe-sandbox.mxapps.io/api/books
 * Print the response to the console. Use async-await and try/catch.
 * 
 * Hints:
 * - for basic authentication the username and password need to be base64 encoded
 */
import fetch from 'node-fetch';

async function printBooks() {
  try {
    const url = 'https://restapiabasicauthe-sandbox.mxapps.io/api/books';
    const headers = {
      'Authorization': 'Basic YWRtaW46aHZnWDhLbFZFYQ==',
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Books:', data);

  } catch (error) {
    console.error('Error fetching books:', error.message);
  }
}

printBooks();