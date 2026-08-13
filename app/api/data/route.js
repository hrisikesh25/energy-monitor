let latestData = null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


// Handle browser CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}


// Arduino → Vercel
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
          {
            status: 400,
            headers: corsHeaders
          }
        );

      }

    }


    latestData = {
      ...data,
      timestamp: new Date().toISOString()
    };


    return Response.json(
      {
        success: true,
        message: "Energy data received",
        data: latestData
      },
      {
        status: 200,
        headers: corsHeaders
      }
    );


  } catch (error) {

    console.error("API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Invalid JSON data"
      },
      {
        status: 400,
        headers: corsHeaders
      }
    );

  }

}


// Frontend → Vercel
export async function GET() {

  if (!latestData) {

    return Response.json(
      {
        success: true,
        message: "No energy data received yet",
        data: null
      },
      {
        status: 200,
        headers: corsHeaders
      }
    );

  }


  return Response.json(
    {
      success: true,
      data: latestData
    },
    {
      status: 200,
      headers: corsHeaders
    }
  );

}