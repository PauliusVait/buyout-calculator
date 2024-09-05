const buildOutput = (data) => ({
  body: JSON.stringify(data),
  headers: {
    'Content-Type': ['application/json']
  },
  statusCode: 200,
  statusText: 'OK'
});

exports.runAsync = async (req) => {
  try {
    // Ensure body is parsed correctly if it's a string
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const { originalPrice, purchaseDate, objectId, objectName } = body;

    console.log('Received Data:', {
      originalPrice,
      purchaseDate,
      objectId,
      objectName
    });

    // Add your calculation logic here
    const buyoutPrice = calculateBuyoutPrice(parseFloat(originalPrice), new Date(purchaseDate));

    const result = buildOutput({
      message: 'Calculation Successful',
      buyoutPrice,
      objectId,
      objectName
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

// Placeholder example calculation function, modify with your actual logic
function calculateBuyoutPrice(originalPrice, purchaseDate) {
  const purchaseYear = purchaseDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const depreciationRate = 0.2; // Assuming a 20% yearly depreciation
  const usedYears = currentYear - purchaseYear;
  const buyoutPrice = originalPrice * Math.pow((1 - depreciationRate), usedYears);

  return buyoutPrice;
}