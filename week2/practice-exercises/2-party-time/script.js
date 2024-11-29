
/**
 * 3: Party time
 * 
 * After reading the documentation make a request to https://reservation100-sandbox.mxapps.io/rest-doc/api
 * and print the response to the console. Use async-await and try/catch.
 * 
 * Hints:
 * - make sure to use the correct headers and http method in the request
 */
import fetch from 'node-fetch';

async function makeReservation() {
  try {
    const url = 'https://reservation100-sandbox.mxapps.io/rest-doc/api/reservations';

    const headers = {
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify({
      name: 'Alex P',
      partySize: 4,  
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Reservation response:', data);

  } catch (error) {
    console.error('Error making reservation:', error.message);
  }
}

makeReservation();