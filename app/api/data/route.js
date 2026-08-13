export async function POST(request) {
  try {
    const data = await request.json();

    console.log("ENERGY DATA RECEIVED:");
    console.log(data);

    // Required fields
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

    // Check required fields
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        return Response.json(
          {
            success: false,
            error: `Missing field: ${field}`
          },
          { status: 400 }
        );
      }
    }

    // Check device ID
    if (typeof data.deviceId !== "string") {
      return Response.json(
        {
          success: false,
          error: "deviceId must be a string"
        },
        { status: 400 }
      );
    }

    // Return successful response
    return Response.json({
      success: true,
      message: "Energy data received",
      data: data
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      {
        success: false,
        error: "Invalid JSON"
      },
      { status: 400 }
    );
  }
}