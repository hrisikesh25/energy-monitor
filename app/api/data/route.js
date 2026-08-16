let latestData = null;

export async function POST(request) {
  try {
    const data = await request.json();

    console.log("ENERGY DATA RECEIVED:");
    console.log(data);

    const requiredFields = [
      "deviceId",
      "voltage",
      "current",
      "realPower",
      "apparentPower",
      "powerFactor",
      "reactivePower",
      "energy",
      "relay"
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return Response.json(
          {
            success: false,
            message: `Missing field: ${field}`
          },
          { status: 400 }
        );
      }
    }

    latestData = {
      ...data,
      timestamp: new Date().toISOString()
    };

    return Response.json({
      success: true,
      message: "Energy data received",
      data: latestData
    });

  } catch (error) {

    console.error("API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Invalid JSON data"
      },
      { status: 400 }
    );
  }
}


export async function GET() {

  if (!latestData) {
    return Response.json({
      success: true,
      message: "No energy data received yet",
      data: null
    });
  }

  return Response.json({
    success: true,
    data: latestData
  });
}