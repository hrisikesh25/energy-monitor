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
        error: error.message
      },
      {
        status: 400
      }
    );
  }
}