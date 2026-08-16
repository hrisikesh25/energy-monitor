let relayState = "OFF";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// =====================================================
// CORS PREFLIGHT
// =====================================================
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// =====================================================
// GET RELAY COMMAND
// Arduino Yún → Vercel
// =====================================================
export async function GET() {
  return Response.json(
    {
      success: true,
      relay: relayState,
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

// =====================================================
// SET RELAY COMMAND
// Website → Vercel
// =====================================================
export async function POST(request) {
  try {
    const data = await request.json();

    if (data.relay !== "ON" && data.relay !== "OFF") {
      return Response.json(
        {
          success: false,
          message: "Relay must be ON or OFF",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    relayState = data.relay;

    console.log("RELAY COMMAND:", relayState);

    return Response.json(
      {
        success: true,
        relay: relayState,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}