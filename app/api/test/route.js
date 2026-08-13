export async function GET() {
  return Response.json({
    success: true,
    message: "Energy Monitor API is working"
  });
}

export async function POST(request) {
  try {
    const data = await request.json();

    console.log("DATA RECEIVED:");
    console.log(data);

    return Response.json({
      success: true,
      received: data
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Invalid JSON"
      },
      { status: 400 }
    );
  }
}