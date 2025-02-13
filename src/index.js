const buildOutput = (data) => ({
  body: JSON.stringify(data),
  headers: {
    'Content-Type': ['application/json']
  },
  statusCode: 200,
  statusText: 'OK'
});

// Depreciation table reflecting Jira Assets object schema: Computers, Phones, Tablets
const depreciationTable = [
  { month: 1, Computers: 63.75, Tablets: 75.25, Phones: 75.25 },
  { month: 2, Computers: 61.00, Tablets: 72.50, Phones: 72.50 },
  { month: 3, Computers: 58.25, Tablets: 69.75, Phones: 69.75 },
  { month: 4, Computers: 55.50, Tablets: 67.00, Phones: 67.00 },
  { month: 5, Computers: 52.75, Tablets: 64.25, Phones: 64.25 },
  { month: 6, Computers: 50.00, Tablets: 61.50, Phones: 61.50 },
  { month: 7, Computers: 47.25, Tablets: 58.75, Phones: 58.75 },
  { month: 8, Computers: 44.50, Tablets: 56.00, Phones: 56.00 },
  { month: 9, Computers: 41.75, Tablets: 53.25, Phones: 53.25 },
  { month: 10, Computers: 39.00, Tablets: 50.50, Phones: 50.50 },
  { month: 11, Computers: 36.25, Tablets: 47.75, Phones: 47.75 },
  { month: 12, Computers: 35.00, Tablets: 45.00, Phones: 45.00 },
  { month: 13, Computers: 34.25, Tablets: 43.75, Phones: 43.75 },
  { month: 14, Computers: 33.50, Tablets: 42.50, Phones: 42.50 },
  { month: 15, Computers: 32.75, Tablets: 41.25, Phones: 41.25 },
  { month: 16, Computers: 32.00, Tablets: 40.00, Phones: 40.00 },
  { month: 17, Computers: 31.25, Tablets: 38.75, Phones: 38.75 },
  { month: 18, Computers: 30.50, Tablets: 37.50, Phones: 37.50 },
  { month: 19, Computers: 29.75, Tablets: 36.25, Phones: 36.25 },
  { month: 20, Computers: 29.00, Tablets: 35.00, Phones: 35.00 },
  { month: 21, Computers: 28.25, Tablets: 33.75, Phones: 33.75 },
  { month: 22, Computers: 27.50, Tablets: 32.50, Phones: 32.50 },
  { month: 23, Computers: 26.75, Tablets: 31.25, Phones: 31.25 },
  { month: 24, Computers: 26.00, Tablets: 30.00, Phones: 30.00 },
  { month: 25, Computers: 25.59, Tablets: 29.59, Phones: 28.92 },
  { month: 26, Computers: 25.18, Tablets: 29.18, Phones: 27.84 },
  { month: 27, Computers: 24.77, Tablets: 28.77, Phones: 26.76 },
  { month: 28, Computers: 24.36, Tablets: 28.36, Phones: 25.68 },
  { month: 29, Computers: 23.95, Tablets: 27.95, Phones: 24.60 },
  { month: 30, Computers: 23.54, Tablets: 27.54, Phones: 23.52 },
  { month: 31, Computers: 23.13, Tablets: 27.13, Phones: 22.44 },
  { month: 32, Computers: 22.72, Tablets: 26.72, Phones: 21.36 },
  { month: 33, Computers: 22.31, Tablets: 26.31, Phones: 20.28 },
  { month: 34, Computers: 21.90, Tablets: 25.90, Phones: 19.20 },
  { month: 35, Computers: 21.49, Tablets: 25.49, Phones: 18.12 },
  { month: 36, Computers: 21.00, Tablets: 25.00, Phones: 17.00 },
  { month: 37, Computers: 20.10, Tablets: 24.10, Phones: 16.55 },
  { month: 38, Computers: 19.20, Tablets: 23.20, Phones: 16.10 },
  { month: 39, Computers: 18.30, Tablets: 22.30, Phones: 15.65 },
  { month: 40, Computers: 17.40, Tablets: 21.40, Phones: 15.20 },
  { month: 41, Computers: 16.50, Tablets: 20.50, Phones: 14.75 },
  { month: 42, Computers: 15.60, Tablets: 19.60, Phones: 14.30 },
  { month: 43, Computers: 14.70, Tablets: 18.70, Phones: 13.85 },
  { month: 44, Computers: 13.80, Tablets: 17.80, Phones: 13.40 },
  { month: 45, Computers: 12.90, Tablets: 16.90, Phones: 12.95 },
  { month: 46, Computers: 12.00, Tablets: 16.00, Phones: 12.50 },
  { month: 47, Computers: 11.10, Tablets: 15.10, Phones: 12.05 },
  { month: 48, Computers: 10.20, Tablets: 14.20, Phones: 11.60 }
];

exports.runAsync = async (req) => {
  try {
    console.log('Raw Request Body:', req.body);
    
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      throw new Error('Failed to parse request body');
    }

    const { originalPrice, purchaseDate, objectId, objectName, objectModel, objectType } = body;

    console.log('Received Data:', {
      originalPrice,
      purchaseDate,
      objectId,
      objectName,
      objectModel,
      objectType
    });

    // Validation for missing attributes
    if (!originalPrice || !purchaseDate || !objectType) {
      console.error('Missing required attributes for calculation.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required attributes for calculation.' }),
        headers: {
          'Content-Type': ['application/json']
        }
      };
    }

    const buyoutPrice = calculateBuyoutPrice(parseFloat(originalPrice), new Date(purchaseDate), objectType);

    const result = buildOutput({
      message: 'Calculation Successful',
      buyoutPrice,
      objectId,
      objectName,
      objectModel,
      objectType
    });

    return result;
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      statusText: 'Internal Server Error',
      body: JSON.stringify({ error: 'Failed to process request' }),
      headers: {
        'Content-Type': ['application/json']
      }
    };
  }
};

// Calculate the exact number of full months between two dates
function getFullMonthDifference(startDate, endDate) {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff;

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  // Adjust the total months if the end day is less than the start day
  if (endDay < startDay) {
    return totalMonths - 1;
  } else {
    return totalMonths;
  }
}

// Custom calculation logic based on device age and type
function calculateBuyoutPrice(originalPrice, purchaseDate, objectType) {
  const monthsUsed = getFullMonthDifference(purchaseDate, new Date());

  let depreciationRate;
  const cappedMonth = Math.min(monthsUsed, 48); // Cap the month at 48

  switch (objectType) {
    case 'Computers':
      depreciationRate = depreciationTable[cappedMonth - 1].Computers; // Lookup and apply the rate
      break;
    case 'Tablets':
      depreciationRate = depreciationTable[cappedMonth - 1].Tablets; // Lookup and apply the rate
      break;
    case 'Phones':
      depreciationRate = depreciationTable[cappedMonth - 1].Phones; // Lookup and apply the rate
      break;
    default:
      throw new Error(`Unknown object type: ${objectType}`);
  }

  return (originalPrice * (depreciationRate / 100)).toFixed(2); // Round to 2 decimal places
}